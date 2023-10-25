;(
  function() {
    'use strict';

    angular
      .module('app.platform')
      .component('platformBar', platformBar())
    ;

    function platformBar() {
      var cdo = {
        templateUrl: 'platform-bar.template.html',
        controller: PlatformBarController
      };

      return cdo;
    }

    /* @ngInject */
    function PlatformBarController() {

    }
  }
)();
