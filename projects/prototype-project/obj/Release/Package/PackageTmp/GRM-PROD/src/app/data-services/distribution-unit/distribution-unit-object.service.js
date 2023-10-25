(
  function() {
    'use strict';

    angular
      .module('app.dataservices.distribution-unit')
      .factory('DistributionUnitObjectService', DistributionUnitObjectService)
    ;

    /* @ngInject */
    function DistributionUnitObjectService() {
      return {
        toObject: toObject,
        newInstance: newInstance
      };

      function toObject(dto) {
        return new DistributionUnit(dto);
      }

      function newInstance() {
        return new DistributionUnit();
      }

      // DistributionUnit object constructor
      function DistributionUnit(dto) {
        var that = _.extend({
          id: undefined,          
          code: undefined,
          description: undefined,
          relation: undefined
        }, dto);
        
        this.id = that.id;
        this.code = that.code;
        this.description = that.description;
        this.relation = that.relation;
      }
    }
  }
)();
