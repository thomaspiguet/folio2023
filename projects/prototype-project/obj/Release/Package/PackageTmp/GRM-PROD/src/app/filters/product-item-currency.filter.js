(
  function() {
    'use strict';

    angular
      .module('app.filters')
      .filter('productItemCurrency', productItemCurrencyFilter)
    ;

    /* @ngInject */
    function productItemCurrencyFilter($filter) {
      return function filter(input, parms) {
        return $filter('currency')(input, undefined, 4);
      };
    }
  }
)();
