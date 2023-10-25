(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition-follow-up')
      .factory('RequisitionFollowUpApiService', RequisitionFollowUpApiService)
    ;

    /* @ngInject */
    function RequisitionFollowUpApiService($http, $q, Paths, RequisitionFollowUpItemObjectService) {
      var routes = {
        followUps: Paths.getApiPath() + 'requisitions/follow-ups',
        summary: Paths.getApiPath() + 'requisitions/follow-ups/summary',
        followUpsSearch: Paths.getApiPath() + 'requisitions/follow-ups/search',
        summaries: Paths.getApiPath() + 'requisitions/follow-ups/summaries'
      };

      function getFollowUpSummary(searchParams) {
        var deferred = $q.defer();

        var params = _.extend({}, searchParams);

        $http
          .get(routes.summary, { params: params })
          .then(
            function success(response) {
              var res = [];
              _.forEach(response.data, function onSummaryItems(summaryItem) {
                res.push(summaryItem);
              });
              deferred.resolve(res);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function getFollowUpSummaries(searchParams) {
        var deferred = $q.defer();

        var criteria = _.extend({
          requisitionId: undefined,
          productId: undefined,
          productDescription: undefined,
          dueOnFrom: undefined,
          dueOnTo: undefined,
          daysLate: undefined,
          requesterId: undefined,
          departmentId: undefined,
          statusCode: []
        }, searchParams.searchCriteria || {});

        $http
          .get(routes.summaries, { params: criteria, blockUI: searchParams.blockUI, showSpinner: searchParams.showSpinner })
          .then(
            function success(response) {
              var res = [];
              _.forEach(response.data, function onSummaries(summary) {
                res.push(summary);
              });
              deferred.resolve(res);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function searchFollowUpItems(searchParams) {
        var deferred = $q.defer();

        var criteria = _.extend({
          // requisitionId: undefined,
          // productId: undefined,
          // productDescription: undefined,
          // dueOnFrom: undefined,
          // dueOnTo: undefined,
          // daysLate: undefined,
          requesterId: undefined,
          departmentId: undefined,
          isRequesterInvolved: undefined
          // statusCode: []
        }, searchParams.searchCriteria || {});

        // // TODO: this needs to be externalized
        // var paging = {
        //   pageSize: searchParams.paging.size || 10,
        //   pageOffset: searchParams.paging.offset || 0
        // };

        // // TODO: this needs to be externalized
        // var sorting = {
        //   sortBy: searchParams.sorting.by || ['requisitionId'],
        //   sortDescending: searchParams.sorting.descending
        // };

        var res = {
          items: [],
          count: 0
        };

        $http
          .get(routes.followUpsSearch, { params: _.extend({}, criteria/*, paging, sorting*/), blockUI: searchParams.blockUI, showSpinner: searchParams.showSpinner })
          .then(
            function success(response) {

              var res = {
                items: [],
                count: response.headers('records-count') || 0
              };
              _.forEach(response.data, function onRequisitionFollowUps(requisitionFollowUpDto) {
                res.items.push(RequisitionFollowUpItemObjectService.toObject(requisitionFollowUpDto));
              });

              res.count = parseInt(res.count, 10);

              deferred.resolve(res);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function getFollowUpItems(searchParams) {
        var deferred = $q.defer();

        var params = _.extend({}, searchParams);
        $http
          .get(routes.followUps, { params: params })
          .then(
            function success(response) {
              var res = [];
              _.forEach(response.data, function onRequisitionFollowUps(requisitionFollowUpDto) {
                res.push(RequisitionFollowUpItemObjectService.toObject(requisitionFollowUpDto));
              });
              deferred.resolve(res);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function getFollowUpItem(searchParams) {
        var deferred = $q.defer();

        var params = {
          expanded: searchParams.expanded || false
        };

        $http
          .get(routes.followUps + '/' + searchParams.requisitionItemId, { params: params, blockUI: searchParams.blockUI, showSpinner: searchParams.showSpinner })
          .then(
            function success(response) {
              var res = RequisitionFollowUpItemObjectService.toObject(response.data);
              deferred.resolve(res);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      return {
        getFollowUpSummary: getFollowUpSummary,
        getFollowUpItems: getFollowUpItems,
        getFollowUpItem: getFollowUpItem,
        searchFollowUpItems: searchFollowUpItems,
        getFollowUpSummaries: getFollowUpSummaries
      };
    }
  }
)();
