(
  function() {
    'use strict';

    angular
      .module('app.dataservices.classification')
      .factory('ClassificationObjectService', ClassificationObjectService)
    ;

    /* @ngInject */
    function ClassificationObjectService() {
      return {
        newInstance: newInstance
      };

      function newInstance() {
        return new Classification();
      }

      // Class object constructor
      function Classification() {
        var that = {
            id: undefined,
            code: undefined,
            description: undefined,
            defaultNonCataloguedBuyerCode: undefined,
            defaultSecondaryCode: undefined
        };
          this.id = that.id;
          this.code = that.code;
          this.description = that.description;
          this.defaultNonCataloguedBuyerCode = that.defaultNonCataloguedBuyerCode;
          this.defaultSecondaryCode = that.defaultSecondaryCode;
      }
    }
  }
)();
