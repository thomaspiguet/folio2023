(
   function () {
    'use strict';

    angular
      .module('app.dataservices.institution-parameter')
      .factory('InstitutionParameterService', InstitutionParameterService)
    ;

    /* @ngInject */
    function InstitutionParameterService($log, $q, InstitutionParameterApiService) {

      var service = this;
      var institutionParameters;

      function setInstitutionParameters() {
        var deferred = $q.defer();
        if (!_.isNil(institutionParameters)) {
          deferred.resolve({ institutionParametersSet: true });
        }
        else {
          //Id hardcoded to 1, not used at the moment by the service.
          InstitutionParameterApiService.getInstitutionParameters(1)
            .then(
              function success(response) {
                institutionParameters = response;
                deferred.resolve({ institutionParametersSet: true});
              },
              function failure(reason) {
                $log.log(reason);
                deferred.reject();
              }
            )
          ;
        }
        return deferred.promise;
      }

      function getInstitutionParameters() {
        return institutionParameters;
      }

      return {
        getInstitutionParameters: getInstitutionParameters,
        setInstitutionParameters: setInstitutionParameters
      };
    }
  }
)();
