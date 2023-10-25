(
  function() {
    'use strict';

    angular
      .module('app.dataservices.lookupservices')
      .factory('DynamicLookupObjectService', DynamicLookupObjectService)
    ;

    /* @ngInject */
    function DynamicLookupObjectService(Cultures) {

      return {
        toObject: toObject
      };

      function toObject(dto) {
        return new DynamicCatalog(dto);
      }

      // SystemLookupsCatalog contstructor
      function DynamicCatalog(dto) {

        var that = _.extend({
          requisitionStatuses: undefined,
          requisitionItemStatuses: undefined,
          naturesOfAuthorization: undefined,
          authorizationStatuses: undefined,
          authorizationTypes: undefined,
          authorizationExceptionSources: undefined,
          requisitionOriginStatuses: undefined,
          requisitionTypes : undefined
        }, dto);

        this.requisitionStatuses = that.requisitionStatuses;
        this.requisitionItemStatuses = that.requisitionItemStatuses;
        this.naturesOfAuthorization = that.naturesOfAuthorization;
        this.authorizationStatuses = that.authorizationStatuses;
        this.authorizationTypes = that.authorizationTypes;
        this.authorizationExceptionSources = that.authorizationExceptionSources;
        this.requisitionOriginStatuses = that.requisitionOriginStatuses;
        this.requisitionTypes = that.requisitionTypes;

        injectSearchMethodsInto(this.requisitionStatuses);
        injectSearchMethodsInto(this.requisitionItemStatuses);
        injectSearchMethodsInto(this.naturesOfAuthorization);
        injectSearchMethodsInto(this.authorizationStatuses);
        injectSearchMethodsInto(this.authorizationTypes);
        injectSearchMethodsInto(this.authorizationExceptionSources);
        injectSearchMethodsInto(this.requisitionOriginStatuses);
        injectSearchMethodsInto(this.requisitionTypes);
      }

      /**
       * Injects methods to search for descriptions by element code or by element id.
       *
       * @param {any} targetObject
       */
      function injectSearchMethodsInto(targetObject) {
        if (_.isNil(targetObject)) {
          return;
        }

        Object.defineProperty(targetObject, 'getDescriptionByCode', {
          value: function(code) {
            var element = _.find(targetObject, function onElement(element) {
              return element.code === code;
            });

            if (!_.isNil(element)) {
              return element.localizedDescriptions[Cultures.getCurrentCultureLanguageId()];
            }
            return null;
          }
        });

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

        // TEMP!!
        //
        // enable constant style usage
        _.forEach(targetObject, function onLookup(item) {
          Object.defineProperty(targetObject, '_' + item.code, {
            value: item
          });
        });
      }
    }
  }
)();
