(
  function() {
    'use strict';

    angular
      .module('app')
      .factory('Initializer', Initializer)
    ;

    /* @ngInject */
    function Initializer($q,
      $rootScope,
      $timeout,
      ApplicationParameters,
      Cultures,
      DateboxInitializer,
      DynamicLookupService,
      InstitutionParameterService,
      tmhDynamicLocale,
      Translate,
      SystemLookupService,
      UserProfileService,
      VersionService
    ) {

      var service = this;
      service.initialized = false;

      function isInitialized() {
        return service.initialized;
      }

      function initialize(localeId) {
        var deferred = $q.defer();
        var resolveDelay = 500;

        //
        // Need to sequence promises execution - organize in groups
        //
        // Each instance in the promises object definition contains the actual
        // promise definition and an optional set of parameters
        //
        var configPromises = {
          locale: { promise: Cultures.ensureLocale, params: localeId },
          dynamicLocale : { promise: tmhDynamicLocale.set, params: localeId },
          translation: { promise: Translate.use, params: localeId },
          dateBoxConfig: { promise: DateboxInitializer.initialize },
        };

        var userProfilePromises = {
          userProfile: { promise: UserProfileService.setUserProfile, params: 1 },
        };

        var dataPromises = {
          systemLookup: { promise: SystemLookupService.initialize },
          dynamicLookup: { promise: DynamicLookupService.initialize },
          version: { promise: VersionService.initialize },
          institutionParameters: { promise: InstitutionParameterService.setInstitutionParameters },
          applicationParameters: { promise: ApplicationParameters.initialize }
        };

        //
        // Compute length variables
        //
        var configLength = _.keys(configPromises).length;
        var userProfileLength =  _.keys(userProfilePromises).length;
        var dataLength = _.keys(dataPromises).length;
        var countPromises = configLength + userProfileLength + dataLength;

        //
        // Broadcast start event
        //
        $rootScope.$broadcast('appInitializationStarted', { blockUI: true });

        //
        // Rollout promises, by groups
        //
        execPromises(configPromises, countPromises, 0)
          .then(
            function success(response) {
              return execPromises(userProfilePromises, countPromises, configLength);
            }
          )
          .then(
            function success(response) {
              return execPromises(dataPromises, countPromises, configLength + userProfileLength);
            }
          )
          .then(
            function success(response) {
              $timeout(function () {
                // Service is successfully initialized
                service.initialized = true;

                // Broadcast finished event
                $rootScope.$broadcast('appInitializationFinished', { blockUI: true, initialized: true });

                // Resolve
                deferred.resolve();
              }, resolveDelay);
            },
            function failure(reason) {
              // Service is not properly initialized
              service.initialized = false;

              // Broadcast finished event
              $rootScope.$broadcast('appInitializationFinished', { blockUI: true, initialized: false });

              // Reject
              deferred.reject(reason);
            }
          )
        ;

        return deferred.promise;
      }

      /**
       * Exeecute the given set of promises
       *
       * @param {object} promises - The promises config object to execute
       * @param {number} countPromises - The total number of promises - used for overall increment
       * @param {number} startAt - The progress start for this invokation
       *
       * @returns {promise} - A promise object
       */
      function execPromises(promises, countPromises, startAt) {
        var deferred = $q.defer();
        var chain = $q.when();
        var progress = startAt;

        _.forOwn(promises, function(promiseConfigObj) {

          var next;
          if (_.isNil(promiseConfigObj.params)) {
            next = promiseConfigObj.promise();
          }
          else {
            next = promiseConfigObj.promise(promiseConfigObj.params);
          }

          chain = next.then(function() {
            progress = progress + 1 ;
            $rootScope.$broadcast('appInitializationProgress', { value : progress / countPromises * 100 });
            return promiseConfigObj.promise;
          });
        });

        chain.then(
          function success(response) {
            deferred.resolve(response);
          },
          function failure(reason) {
            deferred.reject(reason);
          }
        );

        return deferred.promise;
      }

      return {
        isInitialized: isInitialized,
        initialize: initialize
      };
    }
  }
)();
