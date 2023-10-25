(
  function () {
    'use strict';

    angular
      .module('app.dataservices.institution-parameter')
      .factory('InstitutionParameterApiService', InstitutionParameterApiService);

    /* @ngInject */
    function InstitutionParameterApiService($http, $q, InstitutionParameterObjectService, Paths) {
      return {
        getInstitutionParameters: getInstitutionParameters
      };

      function getInstitutionParameters(id) {
        var deferred = $q.defer();
        var INST_PATH = 'institutions/' + id; 

        var cfg = {};

        $http
          .get(Paths.getApiPath() + INST_PATH, cfg)
          .then(
            function success(response) {
              deferred.resolve(InstitutionParameterObjectService.toObject(response.data));
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;

        return deferred.promise;
      }
    }
  }
)();
