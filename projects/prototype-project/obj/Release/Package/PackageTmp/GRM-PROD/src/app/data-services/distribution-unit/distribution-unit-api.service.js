(
  function () {
    'use strict';

    angular
      .module('app.dataservices.distribution-unit')
      .factory('DistributionUnitApiService', DistributionUnitApiService);

    /* @ngInject */
    function DistributionUnitApiService($http, $q, DistributionUnitObjectService, Paths) {
      return {
        search: search
      };

      function search(searchConfig) {
        var params = searchConfig.params;
        var DU_API_PATH = 'distributionUnits/' + params.statisticalUnitId ;
        var deferred = $q.defer();

        var cfg = {};
        if (!_.isNil(params)) {
          cfg.parameters = {
            criteria: params.criteria,
            skip: params.skip,
            take: params.take
          };
        }

        $http
          .get(Paths.getApiPath() + DU_API_PATH, cfg)
          .then(
            function success(response) {
              var lookupList = [];
              _.forEach(response.data, function iterator(dto) {
                var item = DistributionUnitObjectService.toObject(dto);
                lookupList.push(item);
              });
              deferred.resolve({
                data : lookupList,
                headers : response.headers
              });
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
