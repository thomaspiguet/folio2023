(
  function() {
    'use strict';

    angular
      .module('app.filters')
      .filter('alphaNumeric', alphaNumericFilter)
    ;

    /* @ngInject */
    function alphaNumericFilter() {
      return function filter(input, parms) {
        return input.replace(/[^0-9a-z]/gi, '');
      };
    }
  }
)();
