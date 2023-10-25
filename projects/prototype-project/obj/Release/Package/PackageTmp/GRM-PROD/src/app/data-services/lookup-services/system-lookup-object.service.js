(
  function() {
    'use strict';

    angular
      .module('app.dataservices.lookupservices')
      .factory('SystemLookupObjectService', SystemLookupObjectService)
    ;

    /* @ngInject */
    function SystemLookupObjectService(Cultures) {

      function toObject(dto) {
        return new SystemCatalog(dto);
      }

      // LookupTableCatalog contstructor
      function SystemCatalog(dto) {

        var that = _.extend({
          accountAccessTypes: undefined,
          productTypeUsages: undefined,
          requisitionManagementScopes: undefined,
          requisitionAuthorizationLevels: undefined,
          languages: undefined,
          requisitionTemplateAutoGenerationFrequencies: undefined,
          requisitionFollowupsStatusGroups: undefined,
          productSources: undefined
        }, dto);

        // Declare lookups
        this.accountAccessTypes = that.accountAccessTypes;
        this.productTypeUsages = that.productTypeUsages;
        this.requisitionManagementScopes = that.requisitionManagementScopes;
        this.requisitionAuthorizationLevels = that.requisitionAuthorizationLevels;
        this.languages = that.languages;
        this.requisitionTemplateAutoGenerationFrequencies = that.requisitionTemplateAutoGenerationFrequencies;
        this.requisitionFollowupsStatusGroups = that.requisitionFollowupsStatusGroups;
        this.productSources = that.productSources;

        // Inject enumeration-like properties
        injectNamedIdsInto(this.accountAccessTypes);
        injectNamedIdsInto(this.productTypeUsages);
        injectNamedIdsInto(this.requisitionManagementScopes);
        injectNamedIdsInto(this.requisitionAuthorizationLevels);
        injectNamedIdsInto(this.requisitionTemplateAutoGenerationFrequencies);
        injectNamedIdsInto(this.requisitionFollowupsStatusGroups);
        injectNamedIdsInto(this.productSources);

        injectSearchMethodsInto(this.accountAccessTypes);
        injectSearchMethodsInto(this.productTypeUsages);
        injectSearchMethodsInto(this.requisitionManagementScopes);
        injectSearchMethodsInto(this.requisitionAuthorizationLevels);
        injectSearchMethodsInto(this.requisitionTemplateAutoGenerationFrequencies);
        injectSearchMethodsInto(this.requisitionFollowupsStatusGroups);
        injectSearchMethodsInto(this.productSources);

        // TODO: Add properties for languages ?
      }

      /**
       * Injects properties to be used as enumartion from ids
       *
       * @param {any} targetObject
       */
      function injectNamedIdsInto(targetObject) {
        _.forEach(targetObject, function onLookup(item) {
          Object.defineProperty(targetObject, item.code + 'Code', {
            value: item.code
          });
          Object.defineProperty(targetObject, item.code + 'Id', {
            value: item.id
          });
        });
      }

      /**
       * Injects methods to search for descriptions by element code or by element id.
       *
       * @param {any} targetObject
       */
      function injectSearchMethodsInto(targetObject) {
        Object.defineProperty(targetObject, 'getDescriptionById', {
          value: function(id) {
            var element = _.find(targetObject, function onElement(element) {
              return element.id === id;
            });

            if (!_.isNil(element)) {
              return element.localizedDescriptions[Cultures.getCurrentCultureLanguageId()];
            }
            return null;
          }
        });

        enableConstantStyleUsage(targetObject);
      }

      function enableConstantStyleUsage(targetObject) {
        _.forEach(targetObject, function iteratee(item) {
          if (!item.code) {
            return;
          }

          Object.defineProperty(targetObject, item.code, {
            value: item
          });
        });
      }

      return {
        toObject: toObject
      };
    }
  }
)();
