(
  function() {
    'use strict';

    angular
      .module('app.business-logic.common')
      .constant('ApplicationActions', {
        idle: 'idle',
        loading: 'loading',
        searching: 'searching'
      })
    ;
  }
)();
