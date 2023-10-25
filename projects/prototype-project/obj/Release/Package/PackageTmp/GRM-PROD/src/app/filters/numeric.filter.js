(
  function() {
    'use strict';

    angular
      .module('app.filters')
      .filter('numeric', numericFilter)
    ;

    /* @ngInject */
    function numericFilter() {
      return function filter(input, parms) {
        return input.replace(/[^0-9]/gi, '');
      };
    }
  }
)();
