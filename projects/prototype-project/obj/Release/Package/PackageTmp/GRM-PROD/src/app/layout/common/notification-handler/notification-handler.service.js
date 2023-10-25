(
  function() {
    'use strict';

    angular
      .module('app.layout.common.notification-handler')
      .factory('NotificationHandler', NotificationHandlerFactory)
    ;

    /* @ngInject */
    function NotificationHandlerFactory(PopupService, NotificationService) {
      return {
        confirm: confirm,
        error: error,
        info: info,
        success: success,
        warn: warn
      };

      function confirm(params) {
        var cfg = _.extend({
          messageOrKey: '', params: undefined, translate: true
        }, params);
        return PopupService.confirm({
          content: {
            msg: cfg.messageOrKey, params: cfg.params
          },
          btnAction: cfg.btnAction,
          btnClose: cfg.btnClose,
          title: cfg.title,
          translateContent: !_.isNil(cfg.translate) ? true === cfg.translate : true
        }).result;
      }

      function error(params) {
        var cfg = _.extend({
          messageOrKey: '', params: undefined, translate: true
        }, params);

        return NotificationService.error(cfg);
      }

      function info(params) {
        var cfg = _.extend({
          messageOrKey: '', params: undefined, translate: true
        }, params);

        return NotificationService.info(cfg);
      }

      function success(params) {
        var cfg = _.extend({
          messageOrKey: '', params: undefined, translate: true
        }, params);

        return NotificationService.success(cfg);
      }

      function warn(params) {
        var cfg = _.extend({
          messageOrKey: '', params: undefined, translate: true
        }, params);

        return NotificationService.warn(cfg);
      }
    }
  }
)();
