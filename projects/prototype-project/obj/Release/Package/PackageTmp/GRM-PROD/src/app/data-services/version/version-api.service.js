(
  function () {
    'use strict';

    angular
      .module('app.dataservices.version')
      .factory('VersionApiService', VersionApiService);

    /* @ngInject */
    function VersionApiService($http, $q, Paths) {
      return {
        getVersion: getVersion
      };

      function getVersion() {
        var deferred = $q.defer();

        $http
          .get(Paths.getApiPath() + 'version')
          .then(
            function success(response) {
              deferred.resolve(response);
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
