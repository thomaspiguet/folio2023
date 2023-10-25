(
  function() {
    'use strict';

    angular
      .module('app.commons.translation')
      .filter('translate', translateFilter)
    ;

    /* @ngInject */
    function translateFilter(Translate) {
      return function(input, parms) {
        return Translate.filter(input, parms);
      };
    }
  }
)();
