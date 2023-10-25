(
  function () {
    'use strict';

    angular
      .module('app.dataservices.lookupservices')
      .factory('LookupCatalogApiService', LookupCatalogApiService);

    /* @ngInject */
    function LookupCatalogApiService($http, $q, DynamicLookupObjectService, Paths, SystemLookupObjectService) {
      return {
        getSystemEntriesCatalog: getSystemEntriesCatalog,
        getTableEntriesCatalog: getTableEntriesCatalog
      };

      function getSystemEntriesCatalog() {
        var deferred = $q.defer();

        $http
          .get(Paths.getApiPath() + 'lookups/systemElementsCatalog')
          .then(
            function success(response) {
              deferred.resolve(SystemLookupObjectService.toObject(response.data));
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function getTableEntriesCatalog() {
        var deferred = $q.defer();

        $http
          .get(Paths.getApiPath() + 'lookups/tablesCatalog')
          .then(
            function success(response) {
              //var lookupsCatalog = LookupObjectService.toObject(response.data);

              deferred.resolve(DynamicLookupObjectService.toObject(response.data));
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
