(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition.authorizer')
      .factory('RequisitionAuthorizerApiService', RequisitionAuthorizerApiService)
    ;

    /* @ngInject */
    function RequisitionAuthorizerApiService($http, $q, Paths, RequisitionAuthorizerObjectService) {

      var SERVICE_PATH = 'authorizers/requisition';

      return {
        getAuthorizersToAdd: getAuthorizersToAdd,
        getAuthorizersForSubstitution: getAuthorizersForSubstitution
      };

      function getAuthorizers(url, params) {
        var deferred = $q.defer();
        $http
          .get(url, params)
          .then(
            function success(response) {
              var list = [];

              //Get data from response
              var responseData = response.data;

              _.forEach(responseData, function iterator(dto) {
                list.push(RequisitionAuthorizerObjectService.toObject(dto));
              }, this);

              deferred.resolve({
                data : list,
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

      function getAuthorizersToAdd(params) {
        var queryParams = {
          params: _.extend({},
            {criteria : params.params.criteria},
            params.params.paging,
            params.params.sorting
          ),
          timeout: params.promise
        };

        return getAuthorizers(Paths.getApiPath() + SERVICE_PATH + '/' + params.params.requisitionId + '/add', queryParams);
      }

      function getAuthorizersForSubstitution(params) {
        var queryParams = {
          params: _.extend({},
            {authorizerToSubstituteId : params.params.authorizerToSubstituteId},
            {criteria : params.params.criteria},
            params.params.paging,
            {authorizerToSubstituteAmount : params.params.authorizerToSubstituteAmount},
            {isNonCataloguedToAuthorize : params.params.isNonCataloguedToAuthorize}
          ),
          timeout: params.promise
        };

        return getAuthorizers(Paths.getApiPath() + SERVICE_PATH + '/' + params.params.requisitionId + '/substitution', queryParams);
      }
    }
  }
)();
