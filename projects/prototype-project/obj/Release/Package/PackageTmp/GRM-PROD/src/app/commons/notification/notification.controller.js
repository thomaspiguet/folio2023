(
  function() {
    'use strict';

    angular
      .module('app.commons.notification')
      .controller('NotificationBaseController', NotificationBaseCtrl)
    ;

    /* @ngInject */
    function NotificationBaseCtrl($mdToast, Translate, config) {
      var vm = this;
      vm.feedbackClass = computeFeedbackClass();
      function computeFeedbackClass() {
        switch (config.type) {
          case 'error':
            return 'mdi mdi-close';
          case 'success':
            return 'mdi mdi-check';
          case 'info':
            return 'mdi mdi-help';
          case 'warn':
            return 'mdi mdi-exclamation';
          default:
            return '';
        }
      }

      if (config.translate) {
        vm.message = Translate.instant(config.messageOrKey, config.params);
      } else {
        vm.message = config.messageOrKey;
      }

      vm.closeToast = function() {
        $mdToast.hide();
      };
    }
  }
)();
