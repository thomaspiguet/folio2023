(function () {
  'use strict';

  angular
    .module('app.commons.http')
    .factory('loadingInterceptor', loadingInterceptor)
  ;

  /* @ngInject */
  function loadingInterceptor($log, $q, $rootScope) {
    function isApiCall(config) {
      return config.url.indexOf('http') !== -1 &&
          config.headers.Accept !== 'text/html' && /* Excludes template requests */
          config.url.indexOf('html') === -1 && /* some plugins do requests with html */
          config.url.indexOf('tpl') === -1; /* match any template naming standards */
    }

    return {
      request: function(config) {
        // $log.log('$broadcast.loadingStarted - ' + config.url);
        if (isApiCall(config)) {
          $rootScope.$broadcast('loadingStarted', {
            blockUI: Boolean(config.hasOwnProperty('blockUI') ? config.blockUI : undefined),
            showSpinner: Boolean(config.hasOwnProperty('showSpinner') ? config.showSpinner : undefined)
          });
        }
        return config;
      },
      requestError: function(rejection) {
        // $log.log('$broadcast.loadingFinished - ' + rejection.config.url);
        if (isApiCall(rejection.config)) {
          $rootScope.$broadcast('loadingFinished', {
            blockUI: Boolean(rejection.config.hasOwnProperty('blockUI') ? rejection.config.blockUI : undefined)
          });
        }
        return $q.reject(rejection);
      },
      response: function(response) {
        // $log.log('$broadcast.loadingFinished - ' + response.config.url);
        if (isApiCall(response.config)) {
          $rootScope.$broadcast('loadingFinished', {
            blockUI: Boolean(response.config.hasOwnProperty('blockUI') ? response.config.blockUI : undefined)
          });
        }
        return response;
      },
      responseError: function(rejection) {
        // $log.log('$broadcast.loadingFinished - ' + rejection.config.url);
        if (isApiCall(rejection.config)) {
          $rootScope.$broadcast('loadingFinished', {
            blockUI: Boolean(rejection.config.hasOwnProperty('blockUI') ? rejection.config.blockUI : undefined)
          });
        }
        return $q.reject(rejection);
      }
    };
  }
})();
