(
  function() {
    'use strict';

    angular
      .module('app.dataservices.project-activity')
      .factory('ProjectActivityApiService', ProjectActivityApiService);

    /* @ngInject */
    function ProjectActivityApiService($http, $q, Paths, ProjectActivityObjectService) {
      return {
        getProjectsActivitiesForAccount: getProjectsActivitiesForAccount,
        getDefaultProjectActivityForAccount: getDefaultProjectActivityForAccount
      };
      function getProjectsActivitiesForAccount(accountId, params) {
        return fetch('accounts/' + accountId + '/projects-activities', params);
      }
      function getDefaultProjectActivityForAccount(accountId) {
        return fetchOne('accounts/' + accountId + '/projects-activities?defaultValueOnly=true');
      }

      function fetchOne(path) {
        var deferred = $q.defer();
        $http.get(Paths.getApiPath() + path).then(
          function success(response) {
            deferred.resolve(!_.isNil(response.data[0]) ? ProjectActivityObjectService.toObject(response.data[0]) : undefined);
          },
          function failure(reason) {
            deferred.reject(reason);
          }
        );
        return deferred.promise;
      }

      function fetch(path, params) {
        var deferred = $q.defer();

        var cfg = {};
        if (!_.isNil(params)) {
          cfg.params = params;
          cfg.paramSerializer = '$httpParamSerializerJQLike';
        }

        $http
          .get(Paths.getApiPath() + path, cfg)
          .then(
            function success(response) {
              var lookupList = [];

              //Get data from response
              var responseData = response.data;

              _.forEach(responseData, function iterator(dto) {
                lookupList.push(ProjectActivityObjectService.toObject(dto));
              }, this);

              deferred.resolve({
                data : lookupList,
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
    }
  }
)();
