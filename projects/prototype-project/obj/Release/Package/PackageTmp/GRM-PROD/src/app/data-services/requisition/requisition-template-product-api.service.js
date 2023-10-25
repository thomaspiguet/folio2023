(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition')
      .factory('RequisitionTemplateProductApi', RequisitionTemplateProductApi);

    /* @ngInject */
    function RequisitionTemplateProductApi($http, $q, Paths, ProductInfoObjectService) {
      return {
        get: get
      };

      function get(params) {
        var deferred = $q.defer();

        var cfg = {};
        if (!_.isNil(params)) {
          cfg.params = params;
        }

        $http
          .get(Paths.getApiPath() + 'requisitions/templateProducts', cfg)
          .then(
            function success(response) {
              var productInfoList = [];
              var warning = response.data.resultMessage;
              _.forEach(response.data.templateProducts,
                function iterator(dto) {
                  var productInfoObject = ProductInfoObjectService.toObject(dto);
                  productInfoList.push(productInfoObject);
                },
                this);
              deferred.resolve({ data: productInfoList, warning: warning });
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
