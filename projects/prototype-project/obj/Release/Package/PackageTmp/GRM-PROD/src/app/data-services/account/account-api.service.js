(
  function () {
    'use strict';

    angular
      .module('app.dataservices.account')
      .factory('AccountApiService', AccountApiService);

    /* @ngInject */
    function AccountApiService($http, $q, AccountObjectService, Paths, ControlLookupObjectService) {
      return {
        getDefaultProjectActivitiy: getDefaultProjectActivitiy,
        getDefaultAccountForSecondaryCode:getDefaultAccountForSecondaryCode,
        search: search
      };

      function getDefaultProjectActivitiy(id) {
        var deferred = $q.defer();
        if (_.isNil(id)) {
          deferred.reject('Missing mandatory parameter [id]');
        }
        else {
          $http
            .get(Paths.getApiPath() + 'accounts/' + id + '/projects-activities?defaultValueOnly=true')
            .then(
              function success(response) {
                var result = AccountObjectService.toObject(response.data[0]);

                deferred.resolve(result);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            );
        }
        return deferred.promise;
      }

      function getDefaultAccountForSecondaryCode(secondaryCodeId, departmentId) {
        var deferred = $q.defer();
        $http.get(Paths.getApiPath() + 'secondaryCodes/' + secondaryCodeId + '/account?departmentId=' + departmentId) .then(
          function success(response) {
            deferred.resolve(ControlLookupObjectService.toObject(response));
          },
          function failure(reason) {
            deferred.reject(reason);
          }
        );
        return deferred.promise;
      }

      function search(params) {
        var AC_API_PATH = 'accounts';
        var deferred = $q.defer();

        var cfg = {};
        if (!_.isNil(params)) {
          cfg.params = params;
        }

        $http
          .get(Paths.getApiPath() + AC_API_PATH, cfg)
          .then(
            function success(response) {
              var lookupList = [];             
              _.forEach(response.data, function iterator(dto) {
                var item = AccountObjectService.toObject(dto);
                lookupList.push(item);
              });
              deferred.resolve({
                data : lookupList,
                headers : response.headers
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
