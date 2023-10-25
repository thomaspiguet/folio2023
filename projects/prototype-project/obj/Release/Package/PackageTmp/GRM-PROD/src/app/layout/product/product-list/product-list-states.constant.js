(
  function() {
    'use strict';

    angular
      .module('app.layout.product.product-list')
      .constant('ProductListStates', {
        // Idle state variants
        idle: 'idle',
        fetching: 'fetching'
      })
    ;
  }
)();
