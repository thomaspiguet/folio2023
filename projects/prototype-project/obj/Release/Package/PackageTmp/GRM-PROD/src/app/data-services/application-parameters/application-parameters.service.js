;(
  function() {
    'use strict';

    angular
      .module('app.dataservices.application-parameters')
      .factory('ApplicationParameters', ApplicationParametersFactory)
    ;

    /* @ngInject */
    function ApplicationParametersFactory(
      $http, 
      $log, 
      $q, 
      ApplicationParametersApi, 
      Cultures
    ) {
      var applicationParameters;

      function initialize() {
        var deferred = $q.defer();

        applicationParameters = {};

        ApplicationParametersApi
          .getApplicationParameters()
          .then(
            function success(response) {
              applicationParameters = response;
              
              _.forEach(applicationParameters.requisitionParameters.followupsStatusGroups, function onStatusGroups(statusGroup) {
                if (statusGroup.localizedDescriptions) {
                  Object.defineProperty(statusGroup, 'description', {
                    value: statusGroup.localizedDescriptions[Cultures.getCurrentCultureLanguageId()]
                  });
                }
                
                if (statusGroup.statuses) {
                  _.forEach(statusGroup.statuses, function onStatuses(status) {
                    if (status.localizedDescriptions) {
                      Object.defineProperty(status, 'description', {
                        value: status.localizedDescriptions[Cultures.getCurrentCultureLanguageId()]
                      });
                    }                      
                  });
                }
              });
              
              deferred.resolve(applicationParameters);
            },
            function failure(reason) {
              $log.error(reason);
              deferred.reject(reason);
            }
          )
        ;

        return deferred.promise;        
      }
      
      function getApplicationParameters() {
        return applicationParameters;
      }

      return {
        getApplicationParameters: getApplicationParameters,
        initialize: initialize
      };
    }
  }
)();
