(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition')
      .factory('RequisitionApiService', RequisitionApiService);

    /* @ngInject */
    function RequisitionApiService($http, $q, Paths, RequisitionObjectService, RequisitionItemObjectService, RequisitionSearchResultObjectService) {

      var SERVICE_PATH = 'requisitions';

      // Exports...
      var serviceObject = {
        search: search,
        create: create,
        update: update,
        delete: deleteFn,
        read: read,
        readItem: readItem,
        addAuthorizer: addAuthorizer,
        replaceAuthorizer: replaceAuthorizer
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

      function search(searchConfiguration, resultType) {
        var criteria = _.extend({
          requisitionId: undefined
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

        var deferred = $q.defer();
        var params = _.extend({}, searchConfiguration.config);
        params.params = _.extend({}, criteria, paging, sorting);

        $http
          .get(Paths.getApiPath() + SERVICE_PATH, params)
          .then(
            function success(response) {
              var results = {
                items: [],
                count: response.headers('records-count') || 0
              };
              // Deserialize results into their "by product" flavor
              if (isResultsAsProducts) {
                _.forEach(response.data, function iterator(dto) {
                  results.items.push(RequisitionSearchResultObjectService.toProductResultObject(dto));
                });
              // Deserialize results into their "by header" flavor
              }
              else {
                _.forEach(response.data, function iterator(dto) {
                  results.items.push(RequisitionSearchResultObjectService.toHeaderResultObject(dto));
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

      function read(id, cfgParams) {
        var deferred = $q.defer();

        if (_.isNil(id)) {
          deferred.reject('Missing mandatory parameter [id]');
        }
        else {
          var cfg = _.extend({
            params : {selectExpand: ''},
            blockUI: true,
            showSpinner: true
          }, cfgParams);
          $http
            .get(Paths.getApiPath() + SERVICE_PATH + '/' + id, cfg)
            .then(
              function success(response) {
                var result = RequisitionObjectService.toObject(response.data);
                deferred.resolve(result);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }
        return deferred.promise;
      }

      function readItem(id, cfgParams) {
        var deferred = $q.defer();

        if (_.isNil(id)) {
          deferred.reject('Missing mandatory parameter [id]');
        }
        else {
          var cfg = _.extend({
            //params : {selectExpand: ''},
            blockUI: true,
            showSpinner: true
          }, cfgParams);
          $http
            .get(Paths.getApiPath() + SERVICE_PATH + '/items/' + id, cfg)
            .then(
              function success(response) {
                var result = RequisitionItemObjectService.toObject(response.data);
                deferred.resolve(result);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }
        return deferred.promise;
      }

      function create(params) {
        var deferred = $q.defer();

        if (_.isNil(params) || _.isNil(params.userProfileId) || _.isNil(params.complete) || _.isNil(params.requisition)) {
          deferred.reject('Missing mandatory parameter(s) [ {userProfileId, complete, requisition} ]');
        }
        else {
          var data = {
            userProfileId: params.userProfileId,
            complete: params.complete,
            requisition: RequisitionObjectService.toDto(params.requisition)
          };

          $http
            .post(Paths.getApiPath() + SERVICE_PATH, data, {blockUI : true})
            .then(
              function success(response) {
                deferred.resolve(RequisitionObjectService.toObject(response.data));
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

        if (_.isNil(params) || _.isNil(params.id) || _.isNil(params.userProfileId) || _.isNil(params.complete) || _.isNil(params.requisition)) {
          deferred.reject('Missing mandatory parameter(s) [ {userProfileId, complete, requisition} ]');
        }
        else {
          var data = {
            userProfileId: params.userProfileId,
            complete: params.complete,
            requisition: RequisitionObjectService.toDto(params.requisition)
          };

          $http
            .put(Paths.getApiPath() + SERVICE_PATH + '/' + params.id, data, {blockUI : true})
            .then(
              function success(response) {
                deferred.resolve(RequisitionObjectService.toObject(response.data));
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
            .delete(Paths.getApiPath() + SERVICE_PATH + '/' + id, {blockUI : true})
            .then(
              function success(response) {
                deferred.resolve(RequisitionObjectService.toObject(response.data));
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }
        return deferred.promise;
      }

      function addAuthorizer(requisitionId, authorizerId) {

        var deferred = $q.defer();

        $http
          .post(Paths.getApiPath() + SERVICE_PATH + '/' + requisitionId + '/authorizer/add', authorizerId, { blockUI: true, showSpinner: true })
          .then(
            function success(response) {
              deferred.resolve(response);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          );

        return deferred.promise;
      }

      function replaceAuthorizer(requisitionId, authorizerFromId, authorizerToId) {

        var queryParams = {
          authorizerToSubstituteId: authorizerFromId,
          substituteAuthorizerId: authorizerToId
        };

        var deferred = $q.defer();

        $http
          .post(Paths.getApiPath() + SERVICE_PATH + '/' + requisitionId + '/authorizer/substitution', queryParams, { blockUI: true, showSpinner: true })
          .then(
            function success(response) {
              deferred.resolve(response);
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
