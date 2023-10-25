(
  function() {
    'use strict';

    angular
      .module('app.dataservices.statistics')
      .factory('ProductConsumptionStatisticsApi', ProductConsumptionStatisticsApiFactory)
    ;

    /* @ngInject */
    function ProductConsumptionStatisticsApiFactory($http, $q, Paths, ProductConsumptionStatisticsObjectService) {

      return {
        getProductsConsumptionStatistics: getProductsConsumptionStatistics
      };

      function getProductsConsumptionStatistics(params) {

        var SERVICE_PATH = 'statistics/products';

        var queryParams = _.extend({
          currentYear: undefined,
          departmentId: undefined,
          productId: undefined
        }, params);

        var deferred = $q.defer();

        $http
          .get(Paths.getApiPath() + SERVICE_PATH, { params: queryParams })
          .then(
            function success(response) {
              deferred.resolve(ProductConsumptionStatisticsObjectService.toObject(response.data));
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
