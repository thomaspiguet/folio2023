(
  function() {
    'use strict';

    angular
        .module('app.commons.popup.generic-popup')
        .component('genericPopup', genericPopup())
    ;

    function genericPopup() {
      var cdo = {
        templateUrl: 'generic-popup.template.html',
        controller: GenericPopupController,
        bindings: {
          resolve: '<',
          close: '&',
          dismiss: '&',
          modalInstance: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function GenericPopupController($compile, $element, $scope, $document, $log, $q) {

      var ctrl = this;

      ctrl.$onInit = function() {
        ctrl.config = ctrl.resolve.config;
        ctrl.innerComponentConfig = ctrl.resolve.innerComponentConfig;
        if (!_.isUndefined(ctrl.innerComponentConfig.bindings.dataModel)) {
          ctrl.innerComponentModel = _.extend({}, ctrl.innerComponentConfig.bindings.dataModel);
        }
        ctrl.stateModel = ctrl.config.stateModel;
        if (!_.isUndefined(ctrl.config.displayLogic)) {
          ctrl.config.displayLogic(ctrl.stateModel, ctrl.innerComponentModel);
        }
      };

      ctrl.$postLink = function () {
        var innerComponentElement;
        if (ctrl.innerComponentConfig.name) {
          innerComponentElement = $document[0].createElement(_.kebabCase(ctrl.innerComponentConfig.name));
          innerComponentElement = angular.element(innerComponentElement);

          if (!_.isUndefined(ctrl.innerComponentConfig.bindings)) {
            var contentAttr = {};

            _.forOwn(ctrl.innerComponentConfig.bindings, function (value, key) {
              contentAttr[_.kebabCase(key)] = '$ctrl.innerComponentConfig.bindings.' + key;
            });

            if (!_.isNil(ctrl.innerComponentConfig.changeHandlerBindingName)) {
              contentAttr[_.kebabCase(ctrl.innerComponentConfig.changeHandlerBindingName)] = '$ctrl.innerComponentModelChangeHandler(model)';
            }
            innerComponentElement.attr(contentAttr);
          }

          angular.element($element[0].querySelector('.panel-body')).append($compile(innerComponentElement)($scope));
        }
      };

      ctrl.innerComponentModelChangeHandler = function (model) {
        ctrl.innerComponentModel = _.extend({}, model);
        if (!_.isUndefined(ctrl.config.displayLogic)) {
          ctrl.config.displayLogic(ctrl.stateModel, ctrl.innerComponentModel);
        }
      };

      ctrl.ok = function ok() {
        if (_.isFunction(ctrl.config.okButton.action)) {
          $q.when(ctrl.config.okButton.action(ctrl.innerComponentModel)).then(
              function success(response) {
                ctrl.quit();
              },
              function failure(reason) {
                $log.log(reason);
              });
        } else {
          ctrl.close({
            $value: {
              action: ctrl.config.okButton.action,
              model: ctrl.innerComponentModel
            }
          });
        }
      };

      ctrl.cancel = function cancel() {
        ctrl.dismiss({$value: 'cancel'});
      };

      ctrl.quit = function quit() {
        ctrl.close({$value: 'close'});
      };
    }
  }
)();
