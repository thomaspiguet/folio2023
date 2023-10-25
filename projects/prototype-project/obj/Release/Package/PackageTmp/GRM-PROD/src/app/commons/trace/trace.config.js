;(
  function() {
    'use strict';

    angular
      .module('app.commons.trace')
      .config(configFn)
    ;
    
    /* @ngInject */
    function configFn($httpProvider) {
      $httpProvider.interceptors.push('TraceInterceptor');
    }
  }
)();
