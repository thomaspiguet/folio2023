(
   function () {
    'use strict';

    angular
      .module('app.dataservices.lookupservices')
      .factory('DynamicLookupService', DynamicLookupService)
    ;

    /* @ngInject */
    function DynamicLookupService($log, $q, LookupCatalogApiService) {

      var self = this;
      var lookupCollection = {};

      // System lookups collections
      function Lookups()  {
        this.requisitionItemStatuses = undefined;
        this.requisitionStatuses = undefined;
        this.naturesOfAuthorization = undefined;
        this.authorizationStatuses = undefined;
        this.authorizationTypes = undefined;
        this.authorizationTypes = undefined;
        this.authorizationExceptionSources = undefined;
        this.requisitionOriginStatuses = undefined;
        this.requisitionTypes = undefined;
      }

      /**
       * An initializer method. Clears the in-memory cache and fetches all lookup tables.
       */
      function initialize() {
        var deferred = $q.defer();

        lookupCollection = new Lookups();

        LookupCatalogApiService.getTableEntriesCatalog()
          .then(
            function success(dynamicCatalog) {
              // Set lookup tables...
              lookupCollection.requisitionItemStatuses = dynamicCatalog.requisitionItemStatuses;
              lookupCollection.requisitionStatuses = dynamicCatalog.requisitionStatuses;
              lookupCollection.naturesOfAuthorization = dynamicCatalog.naturesOfAuthorization;
              lookupCollection.authorizationStatuses = dynamicCatalog.authorizationStatuses;
              lookupCollection.authorizationTypes = dynamicCatalog.authorizationTypes;
              lookupCollection.authorizationExceptionSources = dynamicCatalog.authorizationExceptionSources;
              lookupCollection.requisitionOriginStatuses = dynamicCatalog.requisitionOriginStatuses;
              lookupCollection.requisitionTypes = dynamicCatalog.requisitionTypes;

              deferred.resolve({ initialized: true });
            },
            function onFailure(reason) {
              $log.log(reason);
              deferred.reject(reason);
            }
          )
        ;

        return deferred.promise;
      }

      function getRequisitionStatuses() {
        return lookupCollection.requisitionStatuses;
      }

      function getRequisitionItemStatuses() {
        return lookupCollection.requisitionItemStatuses;
      }

      function getNaturesOfAuthorization() {
        return lookupCollection.naturesOfAuthorization;
      }

      function getAuthorizationStatuses() {
        return lookupCollection.authorizationStatuses;
      }

      function getAuthorizationTypes() {
        return lookupCollection.authorizationTypes;
      }

      function getAuthorizationExceptionSources() {
        return lookupCollection.authorizationExceptionSources;
      }

      function getRequisitionOriginStatuses() {
        return lookupCollection.requisitionOriginStatuses;
      }

      function getRequisitionTypes() {
        return lookupCollection.requisitionTypes;
      }

      function getByName(name) {
        return lookupCollection[_.camelCase(name)];
      }

      return {
        // Initialization function
        initialize: initialize,

        // Public collection(s)
        getByName: getByName,
        getRequisitionStatuses: getRequisitionStatuses,
        getRequisitionItemStatuses: getRequisitionItemStatuses,
        getNaturesOfAuthorization: getNaturesOfAuthorization,
        getAuthorizationExceptionSources: getAuthorizationExceptionSources,
        getAuthorizationStatuses: getAuthorizationStatuses,
        getAuthorizationTypes: getAuthorizationTypes,
        getRequisitionOriginStatuses: getRequisitionOriginStatuses,
        getRequisitionTypes: getRequisitionTypes
      };
    }
  }
)();
