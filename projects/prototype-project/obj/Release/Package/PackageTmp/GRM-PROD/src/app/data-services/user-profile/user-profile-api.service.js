(
  function () {
    'use strict';

    angular
      .module('app.dataservices.userprofile')
      .factory('UserProfileApiService', UserProfileApiService);

    /* @ngInject */
    function UserProfileApiService($http, $q, Paths, UserProfileObjectService) {
      return {
        getCurrentUserProfileList: getCurrentUserProfileList,
        getCurrentUserProfile: getCurrentUserProfile
      };

      function getCurrentUserProfileList() {
        var deferred = $q.defer();

        $http
          .get(Paths.getApiPath() + 'users/current/metaProfiles')
          .then(
            function success(response) {
              var userMetaProfiles = [];
              var responseData = response.data;

              _.each(responseData, function iterator(dto) {
                var metaProfileObject = UserProfileObjectService.toMetaObject(dto);
                userMetaProfiles.push(metaProfileObject);
              }, this);

              deferred.resolve(userMetaProfiles);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function getCurrentUserProfile(profileId) {
        var deferred = $q.defer();

        if (_.isNil(profileId)) {
          deferred.reject('Missing mandatory parameter [profileId]');
        }
        else {
          $http
            .get(Paths.getApiPath() + 'users/current/profiles/' + profileId)
            .then(
              function success(response) {
                var userProfile = UserProfileObjectService.toObject(response.data);

                deferred.resolve(userProfile);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }
        return deferred.promise;
      }
    }
  }
)();
