(
  function () {
    'use strict';

    angular
      .module('app.dataservices.unspsc-classification')
      .factory('UnspscClassificationApiService', UnspscClassificationApiService);

    /* @ngInject */
    function UnspscClassificationApiService($http,
                                            $q,
                                            UnspscClassificationObjectService,
                                            Paths) {
      return {
        search: search
      };

      function search(params) {
        var UC_API_PATH = 'unspscClassification';
        var deferred = $q.defer();

        var cfg = {};
        if (!_.isNil(params)) {
          cfg.params = params.params ? params.params : params; // TEMP - should always be params.params

          if (!_.isNil(params.promise)) {
            cfg.timeout = params.promise;
          }
        }

        $http
          .get(Paths.getApiPath() + UC_API_PATH, cfg)
          .then(
            function success(response) {
              var lookupList = [];
              _.forEach(response.data, function iterator(dto) {
                  var item = {};
                  if (params.expanded) {
                      item = UnspscClassificationObjectService.toExpandedObject(dto);
                      item.segment = UnspscClassificationObjectService.toObject(item.segment);
                      item.family = UnspscClassificationObjectService.toObject(item.family);
                      item.class = UnspscClassificationObjectService.toObject(item.class);
                      item.identifier = UnspscClassificationObjectService.toObject(item.identifier);
                  }
                  else {
                      item = UnspscClassificationObjectService.toObject(dto);
                  }
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
          )
        ;
        return deferred.promise;
      }
    }
  }
)();
