(
   function () {
    'use strict';

    angular
      .module('app.dataservices.lookupservices')
      .factory('SystemLookupService', SystemLookupService)
    ;

    /* @ngInject */
    function SystemLookupService($log, $q, LookupCatalogApiService) {

      var service = this;
      var initialized = false;

      // System lookups collections
      var accountAccessTypes;
      var productTypeUsages;
      var requisitionManagementScopes;
      var requisitionAuthorizationLevels;
      var languages;
      var requisitionTemplateAutoGenerationFrequencies;
      var requisitionFollowupsStatusGroups;
      var productSources;

      function clearCaches() {
        accountAccessTypes = {};
        productTypeUsages = {};
        requisitionManagementScopes = {};
        requisitionAuthorizationLevels = {};
        languages = {};
        requisitionTemplateAutoGenerationFrequencies = {};
        requisitionFollowupsStatusGroups = {};
        productSources = {};
      }

      function getAccountAccessTypes() {
        return accountAccessTypes;
      }

      function getProductTypeUsages() {
        return productTypeUsages;
      }

      function getRequisitionManagementScopes() {
        return requisitionManagementScopes;
      }

      function getRequisitionAuthorizationLevels() {
        return requisitionAuthorizationLevels;
      }

      function getLanguages() {
        return languages;
      }

      function getRequisitionTemplateAutoGenerationFrequencies() {
        return requisitionTemplateAutoGenerationFrequencies;
      }

      function getRequisitionFollowupsStatusGroups() {
        return requisitionFollowupsStatusGroups;
      }

      function getProductSources() {
        return productSources;
      }

      /**
       * An initializer method. Clears the in-memory cache and fetches all lookups.
       */
      function initialize() {
        var deferred = $q.defer();

        clearCaches();

        LookupCatalogApiService.getSystemEntriesCatalog()
          .then(
            function success(systemCatalog) {
              // Set lookups...
              accountAccessTypes = systemCatalog.accountAccessTypes;
              productTypeUsages = systemCatalog.productTypeUsages;
              requisitionManagementScopes = systemCatalog.requisitionManagementScopes;
              requisitionAuthorizationLevels = systemCatalog.requisitionAuthorizationLevels;
              languages = systemCatalog.languages;
              requisitionTemplateAutoGenerationFrequencies = systemCatalog.requisitionTemplateAutoGenerationFrequencies;
              requisitionFollowupsStatusGroups = systemCatalog.requisitionFollowupsStatusGroups;
              productSources = systemCatalog.productSources;

              initialized = true;

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

      // Creates a readonly property on the specified object
      function addCatalogElement(obj, elementName, getter) {
        // Define readonly properties on the service object
        Object.defineProperty(obj, elementName, {
          get: getter
        });
      }

      // Define service object
      var serviceObject = {
        initialize: initialize
      };

      // Here, add readonly properties for external access of catalog collections
      addCatalogElement(serviceObject, 'accountAccessTypes', getAccountAccessTypes);
      addCatalogElement(serviceObject, 'productTypeUsages', getProductTypeUsages);
      addCatalogElement(serviceObject, 'requisitionManagementScopes', getRequisitionManagementScopes);
      addCatalogElement(serviceObject, 'requisitionAuthorizationLevels', getRequisitionAuthorizationLevels);
      addCatalogElement(serviceObject, 'languages', getLanguages);
      addCatalogElement(serviceObject, 'requisitionTemplateAutoGenerationFrequencies', getRequisitionTemplateAutoGenerationFrequencies);
      addCatalogElement(serviceObject, 'requisitionFollowupsStatusGroups', getRequisitionFollowupsStatusGroups);
      addCatalogElement(serviceObject, 'productSources', getProductSources);

      return serviceObject;
    }
  }
)();
