(
  function() {
    'use strict';

    angular
      .module('app.dataservices.authorization')
      .factory('AuthorizationApiService', AuthorizationApiService)
    ;

    /* @ngInject */
    function AuthorizationApiService(
      $log,
      $http,
      $q,
      AuthorizationObjectService,
      AuthorizationRequisitionGroupObjectService,
      DynamicLookupService,
      Paths,
      RequisitionGroupsAuthorizerApprovalObjectService,
      RequisitionGroupsDetailObjectService
    ) {

      function read(criteria) {
        var deferred = $q.defer();

        if (_.isNil(criteria) || _.isNil(criteria.requisitionItemId)) {
          deferred.reject('Missing mandatory parameter [requisitionItemId]');
        }

        $http
          .get(Paths.getApiPath() + 'authorizations/requisitionItems/' + criteria.requisitionItemId)
          .then(
            function success(response) {
              var authorizations = [];
              _.forEach(response.data, function iterator(authorizationDto) {
                var authorizationObj = AuthorizationObjectService.toObject(authorizationDto);

                authorizationObj.natureDescription = DynamicLookupService.getNaturesOfAuthorization().getDescriptionByCode(authorizationObj.typeCode);
                authorizationObj.typeDescription = DynamicLookupService.getAuthorizationTypes().getDescriptionByCode(authorizationObj.sourceCode);
                authorizationObj.exceptionTypeDescription = DynamicLookupService.getAuthorizationExceptionSources().getDescriptionByCode(authorizationObj.exceptionTypeCode);
                authorizationObj.statusDescription = DynamicLookupService.getAuthorizationStatuses().getDescriptionByCode(authorizationObj.statusCode);

                authorizations.push(authorizationObj);
              });
              deferred.resolve(authorizations);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      /**
       * Fetch authorization requisition groups.
       *
       * @param {object} searchConfig - an object with the following structure:
       *
       * {
       *   routeParams // params to be included on api route [requesterId is mandatory]
       *   criteria // query string filters - sorting, ranges, etc
       *   sorting // sorting criteria - attribute, direction
       *   requestConfig: // the search configuration object - blockUI, showSpinner
       * }
       *
       * @returns {array} - an array of [AuthorizationRequisitionGroup] objects
       */
      function getAuthorizationRequisitionGroups(searchConfig) {
        var deferred = $q.defer();

        if (_.isNil(searchConfig.routeParams) || _.isNil(searchConfig.routeParams.requesterId)) {
          deferred.reject('Missing mandatory route parameter [requesterId]');
        }

        var config = _.extend({}, searchConfig.requestConfig);
        config.params = _.extend({}, searchConfig.criteria);

        $http
          .get(Paths.getApiPath() + 'authorizations/requisitionGroups/' + searchConfig.routeParams.requesterId, config)
          .then(
            function success(response) {
              var authorizations = [];
              _.forEach(response.data, function iteratee(authorization) {
                authorizations.push(AuthorizationRequisitionGroupObjectService.toObject(authorization));
              });

              deferred.resolve({
                authorizations: authorizations,
                count: parseInt(response.headers('records-count') || 0, 10)
              });
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function getRequisitionGroupDetails(searchConfig) {
        var deferred = $q.defer();
        if (_.isNil(searchConfig) || _.isNil(searchConfig.routeParams) || _.isNil(searchConfig.routeParams.authorizationGroupId)) {
          deferred.reject('Missing mandatory parameter [authorizationGroupId]');
        }
        else {
          var config = _.extend({}, searchConfig.requestConfig);
          $http
            .get(Paths.getApiPath() + 'authorizations/requisitionGroups/' + searchConfig.routeParams.authorizationGroupId + '/details', config)
            .then(
              function success(response) {
                var authorizationGroupDetailObjects = [];
                _.forEach(response.data, function iteratee(authorizationGroupDetail) {
                  authorizationGroupDetailObjects.push(RequisitionGroupsDetailObjectService.toObject(authorizationGroupDetail));
                });
                deferred.resolve(authorizationGroupDetailObjects);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }

        return deferred.promise;
      }

      function getRequisitionGroupAuthorizerApprovals(searchConfig) {
        var deferred = $q.defer();
        if (_.isNil(searchConfig) || _.isNil(searchConfig.routeParams) || _.isNil(searchConfig.routeParams.authorizationGroupId)) {
          deferred.reject('Missing mandatory parameter [authorizationGroupId]');
        }
        else {
          var config = _.extend({}, searchConfig.requestConfig);
          $http
            .get(Paths.getApiPath() + 'authorizations/requisitionGroups/' + searchConfig.routeParams.authorizationGroupId + '/authorizerApprovals', config)
            .then(
              function success(response) {
                var authorizerApprovalObjects = [];
                _.forEach(response.data, function iteratee(authorizerApproval) {
                  authorizerApprovalObjects.push(RequisitionGroupsAuthorizerApprovalObjectService.toObject(authorizerApproval));
                });
                deferred.resolve(authorizerApprovalObjects);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }

        return deferred.promise;
      }

      /**
       * Fetch authorization requisition groups.
       *
       * @param {object} rangeConfig - an object with the following structure:
       *
       * {
       *   criteria: { includesCounts }, // the search criteria object
       *   cfg: { blockUI (true/false) } // the search configuration object
       * }
       *
       * @returns {array} - an array of [AuthorizationAmountRangeFilterGroup] objects
       */
      function getAuthorizationAmountRangeFilterGroups(rangeConfig) {
        var deferred = $q.defer();

        if (_.isNil(rangeConfig.routeParams) || _.isNil(rangeConfig.routeParams.requesterId)) {
          deferred.reject('Missing mandatory parameter [requesterId]');
        }

        var config = _.extend({}, rangeConfig.requestConfig);
        config.params = _.extend({}, rangeConfig.criteria);

        if (!_.isNil(rangeConfig.includesCounts)) {
          config.params.includesCounts = rangeConfig.includesCounts;
        }

        $http
          .get(Paths.getApiPath() + 'authorizations/amountRangeFilterGroups/' + rangeConfig.routeParams.requesterId, config)
          .then(
            function success(response) {
              deferred.resolve({
                amountRanges: response.data
              });
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      /**
       * Fetch authorization requisition groups.
       *
       * @param {object} authorizeConfig - an object with the following structure:
       *
       * {
       *   groupIds - an array of authorization group IDs
       * }
       * @returns {true} - true if all authorizations have been completed successfully
       */
      function authorizeGroups(authorizeConfig) {
        var deferred = $q.defer();

        if (_.isNil(authorizeConfig) || _.isNil(authorizeConfig.routeParams) && _.isNil(authorizeConfig.routeParams.groupIds)) {
          deferred.reject('Missing mandatory parameter [groupIds]');
        }
        else {

          var config = _.extend({}, authorizeConfig.requestConfig);

          $http
            .put(Paths.getApiPath() + 'authorizations/requisitionGroups/' + _.toString(authorizeConfig.routeParams.groupIds) + '/authorize', null, config)
            .then(
              function success(response) {
                deferred.resolve(true);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }

        return deferred.promise;
      }

      /**
       * Refuse authorization requisition groups.
       *
       * @param {object} refuseConfig - an object with the following structure:
       *
       * {
       *   routeParams.groupIds - an array of authorization group IDs
       *   data.note - a note to explain why groups have been refused
       * }
       * @returns {true} - true if all authorizations have been completed successfully
       */
      function refuseGroups(refuseConfig) {
        var deferred = $q.defer();

        if (_.isNil(refuseConfig) || _.isNil(refuseConfig.routeParams) || _.isNil(refuseConfig.routeParams.groupIds)) {
          deferred.reject('Missing mandatory parameter [groupIds]');
        }
        else if (_.isNil(refuseConfig) || _.isNil(refuseConfig.data) || _.isNil(refuseConfig.data.note)) {
          deferred.reject('Missing mandatory parameter [note]');
        }
        else {
          var data = _.extend({}, refuseConfig.data);
          var config = _.extend({}, refuseConfig.requestConfig);

          $http
            .put(Paths.getApiPath() + 'authorizations/requisitionGroups/' + _.toString(refuseConfig.routeParams.groupIds) + '/refuse', data, config)
            .then(
              function success(response) {
                deferred.resolve(true);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }

        return deferred.promise;
      }

      return {
        read: read,
        getAuthorizationRequisitionGroups: getAuthorizationRequisitionGroups,
        getAuthorizationAmountRangeFilterGroups: getAuthorizationAmountRangeFilterGroups,
        authorizeGroups: authorizeGroups,
        refuseGroups: refuseGroups,
        getRequisitionGroupDetails: getRequisitionGroupDetails,
        getRequisitionGroupAuthorizerApprovals: getRequisitionGroupAuthorizerApprovals
      };
    }
  }
)();
