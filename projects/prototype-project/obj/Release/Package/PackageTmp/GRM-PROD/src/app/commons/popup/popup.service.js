(function () {
      'use strict';

      angular
          .module('app.commons.popup')
          .provider('PopupService', PopupServiceProvider)
      ;

      /* @ngInject */
      function PopupServiceProvider() {
        var viewPaths = {
          info: undefined,
          warn: undefined,
          error: undefined,
          confirm: undefined,
          wait: undefined,
          input: undefined
        };

        var windowTemplatePaths = {
          embedded: undefined,
          embeddedConstrained: undefined,
          embeddedFullHeightConstrained: undefined
        };

        var provider = this;
        provider.setPaths = function setPaths(obj) {
          viewPaths = _.extend(viewPaths, obj.viewPaths);
          windowTemplatePaths = _.extend(windowTemplatePaths, obj.windowTemplatePaths);
        };

        var defaultCtrl = function defaultCtrl($scope, $uibModalInstance, opts) {
          $scope.opts = opts;
          $scope.onAction = function () {
            $uibModalInstance.close(true);
          };
          $scope.onClose = function () {
            $uibModalInstance.dismiss(false);
          };
        };

        var popupConfig = function popupConfig(popupConfigObj) {
          return {
            keyboard: popupConfigObj.keyboard,
            windowTemplateUrl: windowTemplatePaths.embedded,
            windowTopClass: 'embedded',
            templateUrl: popupConfigObj.templateUrl,
            size: popupConfigObj.size,
            backdrop: 'static',
            controller: ['$scope', '$uibModalInstance', 'opts', popupConfigObj.controller],
            resolve: {
              opts: function () {
                return {
                  title: popupConfigObj.title,
                  content: popupConfigObj.content,
                  btnClose: popupConfigObj.btnClose,
                  btnAction: popupConfigObj.btnAction,
                  error: popupConfigObj.error,
                  isArray: function isArray() {
                    return (popupConfigObj.content instanceof Array);
                  },
                  translateContent: popupConfigObj.translateContent
                };
              },
              result: {
                value: popupConfigObj.controller.dataModel
              }
            }
          };
        };

        this.$get = PopupService;

        /* @ngInject */
        function PopupService($q, $uibModal, $uibModalStack) {
          var service = {};
          //var modal;
          var modals = [];

          service.getModals = function () {
            return modals;
          };

          service.clearModals = function () {
            $uibModalStack.dismissAll();
            modals = [];
          };

          service.addToModals = function addToModals(modal, type) {
            modals.push({instance: modal, type: type});
          };

          service.removeFromModals = function removeFromModals(modal) {
            _.remove(modals, function (obj) {
              return obj.instance === modal;
            });
          };

          service.info = function info(cfg) {
            var modal = $uibModal.open(
                popupConfig({
                  templateUrl: viewPaths.info,
                  size: cfg.size || 'md',
                  controller: cfg.controller || defaultCtrl,
                  title: cfg.title || 'info',
                  content: cfg.content || 'emptyContent',
                  btnClose: cfg.btnClose || 'btnClose',
                  keyboard: !_.isNil(cfg.keyboard) ? cfg.keyboard : true,
                  translateContent: !_.isNil(cfg.translateContent) ? cfg.translateContent : true
                })
            );
            modalInstanciated(modal, 'info');
            return modal;
          };
          service.warn = function warn(cfg) {
            var modal = $uibModal.open(
                popupConfig({
                  templateUrl: viewPaths.warn,
                  size: cfg.size || 'md',
                  controller: cfg.controller || defaultCtrl,
                  title: cfg.title || 'warning',
                  content: cfg.content || 'emptyContent',
                  btnClose: cfg.btnClose || 'btnClose',
                  keyboard: !_.isNil(cfg.keyboard) ? cfg.keyboard : true,
                  translateContent: !_.isNil(cfg.translateContent) ? cfg.translateContent : true
                })
            );
            modalInstanciated(modal, 'warn');
            return modal;
          };
          service.error = function error(cfg) {
            var modal = $uibModal.open(
                popupConfig({
                  templateUrl: viewPaths.error,
                  size: cfg.size || 'md',
                  controller: cfg.controller || defaultCtrl,
                  title: cfg.title || 'error',
                  content: cfg.content || 'emptyContent',
                  btnClose: cfg.btnClose || 'btnClose',
                  error: cfg.error,
                  keyboard: !_.isNil(cfg.keyboard) ? cfg.keyboard : true,
                  translateContent: !_.isNil(cfg.translateContent) ? cfg.translateContent : true
                })
            );
            modalInstanciated(modal, 'error');
            return modal;
          };
          service.confirm = function confirm(cfg) {
            preventStackedModal('confirm');
            var modal = $uibModal.open(
                popupConfig({
                  templateUrl: cfg.templateUrl || viewPaths.confirm,
                  size: cfg.size || 'md',
                  controller: cfg.controller || defaultCtrl,
                  title: cfg.title || 'confirm',
                  content: cfg.content || 'emptyContent',
                  btnClose: cfg.btnCancel || 'cancel',
                  btnAction: cfg.btnAction || 'btnYes',
                  keyboard: !_.isNil(cfg.keyboard) ? cfg.keyboard : true,
                  translateContent: !_.isNil(cfg.translateContent) ? cfg.translateContent : true
                })
            );
            modalInstanciated(modal, 'confirm');
            return modal;
          };
          service.wait = function wait(cfg) {
            var modal = $uibModal.open(
                popupConfig({
                  templateUrl: viewPaths.wait,
                  size: cfg.size || 'md',
                  controller: cfg.controller || defaultCtrl,
                  title: cfg.title || 'pleaseWait',
                  content: cfg.content || 'emptyContent',
                  keyboard: !_.isNil(cfg.keyboard) ? cfg.keyboard : true,
                  translateContent: !_.isNil(cfg.translateContent) ? cfg.translateContent : true
                })
            );
            modalInstanciated(modal, 'wait');
          };
          service.popup = function popup(cfg) {
            var modal = $uibModal.open(_.extend({
              backdrop: 'static',
              keyboard: true,
              size: 'md',
              windowTemplateUrl: cfg.fullHeight ?
                  windowTemplatePaths.embeddedFullHeightConstrained :
                  windowTemplatePaths.embeddedConstrained,
              windowTopClass: 'embedded content-scrollable'
            }, cfg));
            modalInstanciated(modal, 'popup');
            return modal;
          };
          service.inputDialog = function input(cfg) {
            var controller = function controller($scope, $uibModalInstance, opts) {
              $scope.opts = opts;
              $scope.stateModel = {
                btnAction: {
                  disabled: opts.content.required
                }
              };
              $scope.dataModel = {
                inputValue: undefined
              };
              $scope.onAction = function () {
                $uibModalInstance.close($scope.dataModel);
              };
              $scope.onClose = function () {
                $uibModalInstance.dismiss(false);
              };
              $scope.onChange = function() {
                if (opts.content.required) {
                  $scope.stateModel.btnAction.disabled = _.isEmpty($scope.dataModel.inputValue);
                } else {
                  $scope.stateModel.btnAction.disabled = false;
                }
              };
            };

            var modal = $uibModal.open(
                popupConfig({
                  templateUrl: viewPaths.input,
                  size: cfg.size || 'md',
                  controller: controller,
                  title: cfg.title || 'input',
                  content: cfg.content || { type: 'text', msg: undefined, maxLength: undefined, required: false },
                  btnClose: cfg.btnCancel || 'cancel',
                  btnAction: cfg.btnAction || 'btnYes',
                  keyboard: !_.isNil(cfg.keyboard) ? cfg.keyboard : true,
                  translateContent: true
                })
            );
            modalInstanciated(modal, 'input');
            return modal;
          };

          //TODO : find a better async way to prevent multiple popup of the same specific type to be physically stacked..
          function preventStackedModal(type) {
            if (modals.length > 0) {
              var lastModal = _.last(modals);
              if (lastModal.type === type) {
                lastModal.instance.dismiss(false);
                service.removeFromModals(lastModal.instance);
              }
            }
          }

          function modalInstanciated(modal, type) {
            //When a modal will be closed or dismissed, it will be automatically removed from modals.
            modal.closed.then(function () {
              service.removeFromModals(modal);
            });
            service.addToModals(modal, type);
          }

          return service;
        }
      }
    })();
