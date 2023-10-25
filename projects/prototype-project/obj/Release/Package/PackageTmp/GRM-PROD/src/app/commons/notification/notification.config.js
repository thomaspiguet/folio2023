(
  function() {
    'use strict';

    angular
      .module('app.commons.notification')
      .config(config)
    ;

    /* @ngInject */
    function config(NotificationServiceProvider) {
      // Initialize notification service

      /* hideDelay and position are configurable for each type. stick to app default values for now.
      NotificationServiceProvider.info.hideDelay = 10000;
      NotificationServiceProvider.info.position = 'top center';
      ...
      */

    }
  }
)();
