(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition-template')
      .factory('RequisitionTemplateApiService', RequisitionTemplateApiService);

    /* @ngInject */
    function RequisitionTemplateApiService($http, $q, Paths, RequisitionTemplateObjectService, RequisitionTemplateSearchResultObjectService) {
      var RT_API_PATH = 'requisitionTemplates';

      // Exports...
      var serviceObject = {
        search: search,
        getById: getById,
        create: create,
        update: update,
        delete: deleteFn
      };

      // Define readonly property (constant-like) directly on the service object
      // instead of having to inject yet another Angular constant service...
      Object.defineProperty(serviceObject, 'SEARCH_RESULTS_AS_PRODUCTS', {
        get: function () {
          return 'SEARCH_RESULTS_AS_TEMPLATE_PRODUCTS';
        }
      });
      Object.defineProperty(serviceObject, 'SEARCH_RESULTS_AS_HEADERS', {
        get: function () {
          return 'SEARCH_RESULTS_AS_TEMPLATE_HEADERS';
        }
      });

      return serviceObject;

      /**
       * Search requisition templates based on given search configuration
       * @param {object} searchConfiguration - An object exposing the following attributes:
       *  - criteria: the search criteria
       *  - paging: the paging info
       *  - sorting: the sorting info
       * @param {string} resultType The results type to obtain (whether TEMPLATE_PRODUCTS or TEMPLATE_HEADERS)
       */
      function search(searchConfiguration, resultType) {
        var criteria = _.extend({
          templateId: undefined,
          templateName: undefined,
          siteId: undefined,
          departmentId: undefined,
          addressId: undefined,
          requesterId: undefined,
          isActive: undefined,
          isAutomaticGeneration: undefined,
          productCode: undefined,
          productDescription: undefined,
          productStoreId: undefined,
          isProductInvalid: undefined
        }, searchConfiguration.criteria || {});
        var isResultsAsProducts = resultType === serviceObject.SEARCH_RESULTS_AS_PRODUCTS;
        criteria.isResultsAsProducts = isResultsAsProducts;

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

        var params = _.extend({}, searchConfiguration.config);
        params.params = _.extend({}, criteria, paging, sorting);

        var deferred = $q.defer();
        $http
          .get(Paths.getApiPath() + RT_API_PATH, params)
          .then(
            function success(response) {
              var results = {
                items: [],
                count: response.headers('records-count') || 0
              };
              // Deserialize results into their "by product" flavor
              if (isResultsAsProducts) {
                _.forEach(response.data, function iterator(dto) {
                  results.items.push(RequisitionTemplateSearchResultObjectService.toProductResultObject(dto));
                });
              // Deserialize results into their "by header" flavor
              }
              else {
                _.forEach(response.data, function iterator(dto) {
                  results.items.push(RequisitionTemplateSearchResultObjectService.toHeaderResultObject(dto));
                });
              }
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

      function getById(id) {
        var deferred = $q.defer();

        if (_.isNil(id)) {
          deferred.reject('Missing mandatory parameter [id]');
        }
        else {
          $http
            .get(Paths.getApiPath() + RT_API_PATH + '/' + id, {blockUI : true, showSpinner: true})
            .then(
              function success(response) {
                var result = RequisitionTemplateObjectService.toObject(response.data);
                deferred.resolve(result);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            );
        }
        return deferred.promise;
      }

      function create(params) {
        var deferred = $q.defer();

        if (_.isNil(params) || _.isNil(params.requisitionTemplate)) {
          deferred.reject('Missing mandatory parameter(s) [ {requisitionTemplate} ]');
        }
        else {
          var data = RequisitionTemplateObjectService.toDto(params.requisitionTemplate);
          $http
            .post(Paths.getApiPath() + RT_API_PATH, data, { blockUI: true })
            .then(
              function success(response) {
                deferred.resolve(RequisitionTemplateObjectService.toObject(response.data));
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }
        return deferred.promise;
      }

      function update(params) {
        var deferred = $q.defer();

        if (_.isNil(params) || _.isNil(params.requisitionTemplate) || _.isNil(params.requisitionTemplate.id)) {
          deferred.reject('Missing mandatory parameter(s) [ {requisitionTemplate.id} ]');
        }
        else {
          var data = RequisitionTemplateObjectService.toDto(params.requisitionTemplate);
          $http
            .put(Paths.getApiPath() + RT_API_PATH + '/' + params.requisitionTemplate.id, data, { blockUI: true })
            .then(
              function success(response) {
                deferred.resolve(RequisitionTemplateObjectService.toObject(response.data));
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            );
        }
        return deferred.promise;
      }

      function deleteFn(id) {
        var deferred = $q.defer();

        if (_.isNil(id)) {
          deferred.reject('ID is mandatory to delete a resource');
        }
        else {
          $http
            .delete(Paths.getApiPath() + 'requisitionTemplates/' + id, {blockUI : true})
            .then(
              function success(response) {
                deferred.resolve({ id: id });
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }
        return deferred.promise;
      }
    }
  }
)();
