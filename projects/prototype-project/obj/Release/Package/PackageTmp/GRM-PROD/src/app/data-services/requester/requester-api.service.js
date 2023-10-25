(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requester')
      .factory('RequesterApiService', RequesterApiService);

    /* @ngInject */
    function RequesterApiService($http, $q, Paths, RequesterObjectService) {

      return {
        getRequesters: getRequesters
      };

      function getRequesters(searchParams) {
        var deferred = $q.defer();
        $http
          .get(Paths.getApiPath() + 'requesters', {
            params: searchParams.params,
            timeout: searchParams.promise,
            blockUI: true
          })
          .then(
            function success(response) {
              var requesters = [];
              var responseData = response.data;
              _.forEach(responseData, function iterator(dto) {
                var requester = RequesterObjectService.toObject(dto);
                requesters.push(requester);
              });
              deferred.resolve({
                data: requesters,
                headers: response.headers
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
