(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition-template')
      .factory('RequisitionTemplateProductInfoApi', RequisitionTemplateProductInfoApi);

    /* @ngInject */
    function RequisitionTemplateProductInfoApi($http, $q, Paths, RequisitionTemplateProductInfoObjectService, NotificationHandler) {

      return {
        getProduct: getProduct,
        getProducts: getProducts,
      };

      function getProduct(criteria) {
        var params = _.extend({
            productId: undefined, // mandatory?
            siteId: undefined, // mandatory?
            departmentId: undefined, // mandatory?
            deliveryLocationId: undefined
          }, criteria);

        var deferred = $q.defer();

        $http
          .get(Paths.getApiPath() + 'requisitionTemplates/productInfo', { params: params, blockUI: true, showSpinner: true })
          .then(
            function success(response) {
              var productInfoList = [];
              var responseData = response.data;

              if (_.isArray(responseData)) {
                _.forEach(responseData,
                  function iterator(dto) {
                    var productInfoObject = RequisitionTemplateProductInfoObjectService.toObject(dto);
                    productInfoList.push(productInfoObject);
                  },
                  this);
                deferred.resolve(productInfoList);
              } else {
                if (criteria.productCode === responseData.productCode) {
                  productInfoList.push(RequisitionTemplateProductInfoObjectService.toObject(responseData));
                  deferred.resolve(productInfoList);
                }
                else {
                  confirmSubstituteProduct(criteria.productCode, responseData.productCode)
                    .result
                    .then(
                      function(response) {
                        productInfoList.push(RequisitionTemplateProductInfoObjectService.toObject(responseData));
                        deferred.resolve(productInfoList);
                      },
                      function(reason) {
                        deferred.reject(undefined);
                      }
                    )
                  ;
                }
              }
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function getProducts(criteria) {
        var params = _.extend({
          products: [],
          siteId: undefined,
          departmentId: undefined,
          deliveryLocationId: undefined
        }, criteria);

        var deferred = $q.defer();

        $http
          .get(Paths.getApiPath() + 'requisitionTemplates/productInfoList', { params: params, blockUI: true, showSpinner: true  })
          .then(
            function success(response) {
              var productInfoList = [];
              var responseData = response.data;
              _.forEach(responseData,
                function iterator(dto) {
                  var productInfoObject = RequisitionTemplateProductInfoObjectService.toObject(dto);
                  productInfoList.push(productInfoObject);
                },
                this);
              deferred.resolve(productInfoList);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function confirmSubstituteProduct(inProductCode, outProductCode) {
        return NotificationHandler
          .confirm({
            msg: 'requisitionSubstituteProductConfirm',
            params: [inProductCode, outProductCode],
            title: 'popupWarningTitle',
            translate: true
          });
      }
    }
  }
)();
