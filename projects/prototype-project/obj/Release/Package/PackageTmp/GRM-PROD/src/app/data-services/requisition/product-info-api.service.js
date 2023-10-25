(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition')
      .factory('ProductInfoApi', ProductInfoApi);

    /* @ngInject */
    function ProductInfoApi($http, $q, Paths, ProductInfoObjectService, NotificationHandler, Translate) {
      return {
        getProduct: getProduct,
        getProducts: getProducts
      };

      function getProduct(criteria) {
        var params = _.extend({
            productId: undefined, // mandatory?
            storeId: undefined,
            requiredOn: undefined, // mandatory?
            siteId: undefined, // mandatory?
            clientId: undefined,
            departmentId: undefined, // mandatory?
            modelNumber: undefined,
            requesterId: undefined, // mandatory?
            deliveryLocationId: undefined,
            requisitionType: undefined, // mandatory?
            itemRequiredOn: undefined, // mandatory?
            vendorId: undefined,
            isWeeklyConsommationDisplayed: false,
            requesterPermission: undefined, // mandatory?
            cultureCode: undefined
          }, criteria);

        var deferred = $q.defer();

        $http
          .get(Paths.getApiPath() + 'requisitions/productInfo', { params: params, blockUI: true, showSpinner: true })
          .then(
            function success(response) {
              var productInfoList = [];
              var responseData = response.data;

              if (_.isArray(responseData)) {
                _.forEach(responseData,
                  function iterator(dto) {
                    var productInfoObject = ProductInfoObjectService.toObject(dto);
                    productInfoList.push(productInfoObject);
                  },
                  this);
                deferred.resolve(productInfoList);
              } else {
                if (criteria.productCode === responseData.productCode) {
                  productInfoList.push(ProductInfoObjectService.toObject(responseData));
                  deferred.resolve(productInfoList);
                }
                else {
                  if (responseData.productCode) {
                    confirmSubstituteProduct(criteria.productCode, responseData.productCode)
                      .result
                      .then(
                        function(response) {
                          productInfoList.push(ProductInfoObjectService.toObject(responseData));
                          deferred.resolve(productInfoList);
                        },
                        function(reason) {
                          deferred.reject(undefined);
                        }
                      )
                    ;
                  }
                  else {
                     var reason = Translate.instant('requisitionInvalidProductCodeMsg');
                     deferred.reject(reason);
                  }
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
          requesterId: undefined,
          deliveryLocationId: undefined,
          requisitionType: undefined,
          itemRequiredOn: undefined,
          isWeeklyConsommationDisplayed: undefined,
          requesterPermission: undefined,
        }, criteria);

        var deferred = $q.defer();

        $http
          .get(Paths.getApiPath() + 'requisitions/productInfoList', { params: params, blockUI: true, showSpinner: true })
          .then(
            function success(response) {
              var productInfoList = [];
              var responseData = response.data;
              _.forEach(responseData,
                function iterator(dto) {
                  var productInfoObject = ProductInfoObjectService.toObject(dto);
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
