(
  function() {
    'use strict';

    angular
      .module('app.filters')
      .filter('noTrailingSpace', noTrailingSpaceFilter)
    ;

    /* @ngInject */
    function noTrailingSpaceFilter() {
      return function filter(input, parms) {
         if (!_.isString(input)) {
            return input;
        }
        return input.trim();
      };
    }
  }
)();
