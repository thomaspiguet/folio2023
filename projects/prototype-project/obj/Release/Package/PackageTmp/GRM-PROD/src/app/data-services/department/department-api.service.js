(
  function() {
    'use strict';

    angular
      .module('app.dataservices.department')
      .factory('DepartmentApiService', DepartmentApiService);

    /* @ngInject */
    function DepartmentApiService($http, $q, DepartmentObjectService, Paths) {

      return {
        getDepartments: getDepartments
      };

      function getDepartments(params) {
        var deferred = $q.defer();
        $http
          .get(Paths.getApiPath() + 'departments', {
            params: params.params,
            paramSerializer: '$httpParamSerializerJQLike',
            timeout: params.promise,
            blockUI: true
          })
          .then(
            function success(response) {
              var departments = [];
              var responseData = response.data;
              _.forEach(responseData, function iterator(dto) {
                departments.push(DepartmentObjectService.toObject(dto));
              });
              deferred.resolve({
                data: departments,
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
