(function () {
      'use strict';

      angular
          .module('app.commons.notification')
          .provider('NotificationService', NotificationServiceProvider)
      ;

      /* @ngInject */
      function NotificationServiceProvider($windowProvider) {

        var provider = this;

        provider.warn = {
          hideDelay : 10000,
          position: 'top center'
        };
        provider.error = {
          hideDelay : 0,
          position: 'top center'
        };
        provider.success = {
          hideDelay : 4000,
          position: 'top right'
        };
        provider.info = {
          hideDelay : 10000,
          position: 'top center'
        };

        provider.errorHideDelay = 10000;
        provider.sucessHideDelay = 10000;
        provider.infoHideDelay = 10000;

        var baseConfig =  {
          locals: {
            config: {
              messageOrKey: undefined,
              translate: false,
              params: undefined,
              type: undefined,
            }
          },
          templateUrl: 'notification.template.html',
          position: 'top right',
          controller: 'NotificationBaseController',
          controllerAs: 'ctrl',
          bindToController: true,
          parent: $windowProvider.$get().document.querySelector('.platform-application-container')
        };

        provider.$get = NotificationService;

        /* @ngInject */
        function NotificationService($mdToast) {
          var service = {};

          service.error = function error(cfg) {
            var config = _.extend({}, baseConfig, {
              locals: {
                config: {
                  messageOrKey: cfg.messageOrKey,
                  translate: cfg.translate,
                  params: cfg.params,
                  type: 'error'
                }
              },
              hideDelay: provider.error.hideDelay,
              position: provider.error.position,
              toastClass: 'notification-error'
            });
            return $mdToast.show(config);
          };

          service.success = function success(cfg) {
            var config = _.extend({}, baseConfig, {
              locals: {
                config: {
                  messageOrKey: cfg.messageOrKey,
                  translate: cfg.translate,
                  params: cfg.params,
                  type: 'success'
                }
              },
              hideDelay: provider.success.hideDelay,
              position: provider.success.position,
              toastClass: 'notification-success'
            });
            return $mdToast.show(config);
          };

          service.info = function info(cfg) {
            return $mdToast.show(_.extend({}, baseConfig, {
              locals: {
                config: {
                  messageOrKey: cfg.messageOrKey,
                  translate: cfg.translate,
                  params: cfg.params,
                  type: 'info'
                }
              },
              hideDelay: provider.info.hideDelay,
              position: provider.info.position,
              toastClass: 'notification-info'
            }));
          };

          service.warn = function warn(cfg) {
            return $mdToast.show(_.extend({}, baseConfig, {
              locals: {
                config: {
                  messageOrKey: cfg.messageOrKey,
                  translate: cfg.translate,
                  params: cfg.params,
                  type: 'warn'
                }
              },
              hideDelay: provider.warn.hideDelay,
              position: provider.warn.position,
              toastClass: 'notification-warn'
            }));
          };

          return service;
        }
      }
    })();
