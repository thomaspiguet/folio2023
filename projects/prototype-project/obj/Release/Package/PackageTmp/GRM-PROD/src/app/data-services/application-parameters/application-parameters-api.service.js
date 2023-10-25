;(
  function() {
    'use strict';

    angular
      .module('app.dataservices.application-parameters')
      .factory('ApplicationParametersApi', ApplicationParametersApiFactory)
    ;

    /* @ngInject */
    function ApplicationParametersApiFactory($http, $q, Paths) {
      return {
        getApplicationParameters: getApplicationParameters
      };

      function getApplicationParameters() {
        var deferred = $q.defer();
        $http
          .get(Paths.getApiPath() + 'applicationParameters')
          .then(
            function success(response) {
              deferred.resolve(response.data);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }
    }
  }
)();
