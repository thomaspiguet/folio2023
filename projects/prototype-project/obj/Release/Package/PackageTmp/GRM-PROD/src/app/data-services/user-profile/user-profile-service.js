(
   function () {
    'use strict';

    angular
      .module('app.dataservices.userprofile')
      .factory('UserProfileService', UserProfileService)
    ;

    /* @ngInject */
    function UserProfileService($log, $q, UserProfileApiService) {

      var service = this;
      var userProfile;

      function setUserProfile(profileId) {
        var deferred = $q.defer();
        if (!_.isNil(userProfile) && userProfile.id === profileId) {
          deferred.resolve({ profileSet: true });
        }
        else {
          UserProfileApiService.getCurrentUserProfile(profileId)
            .then(
              function success(response) {
                userProfile = response;
                deferred.resolve({ profileSet: true});
              },
              function failure(reason) {
                //
                // User profile not found - transform into a 401-Unauthorized http error
                //
                if (404 === reason.status) {
                  reason.description = 'userProfileNotConfiguredInThisApplication';
                  reason.status = 401;
                }
                deferred.reject(reason);
              }
            )
          ;
        }
        return deferred.promise;
      }

      function getCurrentProfile() {
        return userProfile;
      }

      return {
        getCurrentProfile: getCurrentProfile,
        setUserProfile: setUserProfile,
      };
    }
  }
)();
