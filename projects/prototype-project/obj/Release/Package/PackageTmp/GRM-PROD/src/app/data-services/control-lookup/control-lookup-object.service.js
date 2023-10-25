(
  function() {
    'use strict';

    angular
      .module('app.dataservices.controllookup')
      .factory('ControlLookupObjectService', ControlLookupObjectService)
    ;

    /* @ngInject */
    function ControlLookupObjectService() {
      return {
        toObject: toObject,
        newInstance: newInstance
      };

      function toObject(dto) {
        return new ControlLookup(dto);
      }

      function newInstance() {
        return new ControlLookup();
      }

      // DistributionUnit object constructor
      function ControlLookup(dto) {
        var that = _.extend({
          id: undefined,          
          code: undefined,
          description: undefined
        }, dto);
        
        this.id = that.id;
        this.code = that.code;
        this.description = that.description;
      }
    }
  }
)();
