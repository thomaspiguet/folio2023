(
  function() {
    'use strict';

    angular
      .module('app.layout.product.product-filter')
      .constant('ProductFilterStates', {
        // Idle state variants
        idle: 'idle',
        idleSuccess: 'idleSuccess',
        idleError: 'idleError',

        // Occurring
        searching: 'searching',

        // Completed
        searched: 'searched'
      })
    ;
  }
)();
