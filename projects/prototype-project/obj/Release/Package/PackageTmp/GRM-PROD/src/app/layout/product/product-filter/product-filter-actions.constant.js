(
  function() {
    'use strict';

    angular
      .module('app.layout.product.product-filter')
      .constant('ProductFilterActions', {
        onSearch: 'onSearch',
        onClear: 'onClear'
      })
    ;
  }
)();
