(
  function() {
    'use strict';

    angular
      .module('app.dataservices.product')
      .factory('ProductApiService', ProductApiService);

    /* @ngInject */
    function ProductApiService($http, $q, Paths, ProductObjectService) {

      return {
        searchProducts: searchProducts,
        searchCatalogs: searchCatalogs
      };

      function searchProducts(searchConfiguration) {
        return search(Paths.getApiPath() + 'products', searchConfiguration);
      }

      function searchCatalogs(searchConfiguration) {
        return search(Paths.getApiPath() + 'products/catalog', searchConfiguration);
      }

      function search(endpoint, searchConfiguration) {
        var criteria = _.extend({
          brand: undefined,
          buyerId: undefined,
          catalogDescription: undefined,
          clientId: undefined,
          contractNumber: undefined,
          deliveryLocationId: undefined,
          departmentId: undefined,
          gtinCode: undefined,
          homologationClass: undefined,
          homologationNumber: undefined,
          manufacturerId: undefined,
          manufacturerItemCode: undefined,
          productCode: undefined,
          productDescription: undefined,
          productSource: 'associated',
          requesterId: undefined,
          siteId: undefined,
          unspscClassificationCode: undefined,
          unspscClassificationId: undefined,
          vendorId: undefined,
          vendorItemCode: undefined,
          vendorProductDescription: undefined
        }, searchConfiguration.criteria || {});

        var paging = {
          pageSize: searchConfiguration.paging.size,
          pageOffset: searchConfiguration.paging.offset
        };
        var sorting = {
          sortBy: []
        };
        if (searchConfiguration.sorting.by && searchConfiguration.sorting.by.length) {
          var crit = searchConfiguration.sorting.by;
          if (true === searchConfiguration.sorting.descending) {
            crit = crit + ':d';
          }
          else {
            crit = crit + ':a';
          }
          sorting.sortBy.push(crit);
        }

        var deferred = $q.defer();
        var params = _.extend({}, searchConfiguration.config);
        params.params = _.extend({}, criteria, paging, sorting);

        $http
          .get(endpoint, params)
          .then(
            function success(response) {
              var results = {
                items: [],
                count: parseInt((response.headers('records-count') || 0), 10)
              };
              _.forEach(response.data, function iterator(dto) {
                results.items.push(ProductObjectService.toObject(dto));
              }, this);

              deferred.resolve({
                data: results
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
