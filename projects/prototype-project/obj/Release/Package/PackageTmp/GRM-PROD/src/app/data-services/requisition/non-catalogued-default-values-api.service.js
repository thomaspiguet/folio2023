(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition')
      .factory('NonCataloguedDefaultValuesApi', NonCataloguedDefaultValuesApi);

    /* @ngInject */
    function NonCataloguedDefaultValuesApi($http, $q, Paths/*, NonCataloguedDefaultValuesObjectService*/) {
      return {
        getDefaultValues: getDefaultValues,
        getDefaultBuyer: getDefaultBuyer
      };

      function getDefaultValues(params) {
        var deferred = $q.defer();

        var cfg = {};
        cfg.blockUI = true;
        cfg.showSpinner = true;
        if (!_.isNil(params)) {
          cfg.params = params;
        }

        $http
          .get(Paths.getApiPath() + 'requisitions/nonCataloguedProduct/defaults', cfg)
          .then(
            function success(response) {
              var defaultValues = response;/*ProductInfoObjectService.toObject(dto);*/
              deferred.resolve(defaultValues);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          );
        return deferred.promise;
      }

      function getDefaultBuyer(params) {
        var deferred = $q.defer();

        var cfg = {};
        cfg.blockUI = true;
        cfg.showSpinner = true;
        if (!_.isNil(params)) {
          cfg.params = params;
        }

        $http
            .get(Paths.getApiPath() + 'requisitions/nonCataloguedProduct/defaults/buyer', cfg)
            .then(
                function success(response) {
                  var defaultBuyer = response;/*ProductInfoObjectService.toObject(dto);*/
                  deferred.resolve(defaultBuyer);
                },
                function failure(reason) {
                  deferred.reject(reason);
                }
            );
        return deferred.promise;
      }
    }
  }
)();
