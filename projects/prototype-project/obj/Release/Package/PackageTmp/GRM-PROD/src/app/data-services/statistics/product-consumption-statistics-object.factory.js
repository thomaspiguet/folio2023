(
  function() {
    'use strict';

    angular
      .module('app.dataservices')
      .factory('ProductConsumptionStatisticsObjectService', ProductConsumptionStatisticsObjectServiceFactory)
    ;

    /* @ngInject */
    function ProductConsumptionStatisticsObjectServiceFactory() {
      return {
        newInstance: newInstance,
        toObject: toObject
      };

      function newInstance() {
        return new ProductionConsumptionStatistics();
      }

      function toObject(dto) {
        return new ProductionConsumptionStatistics(dto);
      }

      function ProductionConsumptionStatistics(dto) {
        this.currentYear = _.extend(new ProductionConsumptionStatisticsInstance(), dto ? dto.currentYear : {});
        this.previousYear = _.extend(new ProductionConsumptionStatisticsInstance(), dto ? dto.previousYear : {});
      }

      function ProductionConsumptionStatisticsInstance() {
        this.quantities = [];
        this.values = [];
      }
    }
  }
)();
