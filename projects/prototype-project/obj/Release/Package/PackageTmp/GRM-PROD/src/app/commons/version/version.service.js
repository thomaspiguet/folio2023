;(
  function() {
    'use strict';

    angular
      .module('app.commons.version')
      .provider('VersionService', VersionServiceProvider)
    ;

    /* @ngInject */
    function VersionServiceProvider() {
      var provider = this;

      var versionInfo = {
        apiVersion: undefined,
        databaseVersion: undefined,
        databaseFixNumber: undefined,
        databaseName: undefined,
        webApplicationVersion: undefined
      };

      provider.setApiVersion = function setApiVersion(value) {
        versionInfo.apiVersion = value;
      };

      provider.setDatabaseVersion = function setDatabaseVersion(value) {
        versionInfo.databaseVersion = value;
      };

      provider.setDatabaseFixNumber = function setDatabaseFixNumber(value) {
        versionInfo.databaseFixNumber = value;
      };

      provider.setDatabaseName = function setDatabaseName(value) {
        versionInfo.databaseName = value;
      };

      provider.setWebAplicationVersion = function setWebAplicationVersion(value) {
        versionInfo.webApplicationVersion = value;
      };

      /* @ngInject */
      provider.$get = function($q, VersionApiService) {
        var service = {};
        var initialized = false;

        service.initialize = function initialize() {
          var deferred = $q.defer();

          VersionApiService
            .getVersion()
            .then(
              function success(response) {
                provider.setApiVersion(response.data.apiVersion);
                provider.setDatabaseVersion(response.data.databaseVersion);
                provider.setDatabaseFixNumber(response.data.databaseFixNumber);
                provider.setDatabaseName(response.data.databaseName);
                initialized = true;

                deferred.resolve({ initialized: true });
              },
              function onFailure(reason) {
                deferred.reject(reason);
              }
            )
          ;

          return deferred.promise;
        };

        // Define readonly property on the service object
        Object.defineProperty(service, 'versionInformation', {
          get: function () {
            return versionInfo;
          }
        });

        return service;
      };
    }
  }
)();
//
//
//(
//  function() {
//    'use strict';
//
//    angular
//      .module('app.commons.version')
//      .factory('VersionService', VersionService)
//    ;
//
//    /* @ngInject */
//    function VersionService($log, $q, VersionApiService) {
//
//      var initialized = false;
//      var versionInfo = {
//        apiVersion: undefined,
//        masterDatabaseVersion: undefined,
//        webDatabaseVersion: undefined,
//        webApplicationVersion: undefined
//      };
//
//      /**
//       * An initializer method. Fetches version informations.
//       */
//      function initialize() {
//        var deferred = $q.defer();
//
//        VersionApiService
//          .getVersion()
//          .then(
//            function success(response) {
//              versionInfo = response.data;
//              initialized = true;
//
//              deferred.resolve({ initialized: true });
//            },
//            function onFailure(reason) {
//              $log.log(reason);
//              deferred.reject(reason);
//            }
//          )
//        ;
//
//        return deferred.promise;
//      }
//
//      // Define service object
//      var serviceObject = {
//        initialize: initialize
//      };
//
//      // Define readonly property on the service object
//      Object.defineProperty(serviceObject, 'versionInformation', {
//        get: function () {
//          return versionInfo;
//        }
//      });
//
//      return serviceObject;
//    }
//  }
//)();

