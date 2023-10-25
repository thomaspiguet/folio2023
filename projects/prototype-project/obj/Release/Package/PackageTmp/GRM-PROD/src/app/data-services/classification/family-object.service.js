(
  function() {
    'use strict';

    angular
      .module('app.dataservices.classification')
      .factory('FamilyObjectService', FamilyObjectService)
    ;

    /* @ngInject */
    function FamilyObjectService(ClassificationObjectService) {
      return {
        toObject : toObject,
        toExpandedObject : toExpandedObject,
        newInstance: newInstance,
        newExpandedInstance: newExpandedInstance
      };

      function toObject(dto) {
        return new Family(dto);
      }

      function toExpandedObject(dto) {
        return new ExpandedFamily(dto);
      }

      function newInstance() {
        return new Family();
      }

      function newExpandedInstance() {
         return new ExpandedFamily();
      }

      function Family(dto) {
          var that = _.extend(ClassificationObjectService.newInstance(), dto);
          this.id = that.id;
          this.code = that.code;
          this.description = that.description;
          this.defaultNonCataloguedBuyerCode = that.defaultNonCataloguedBuyerCode;
          this.defaultSecondaryCode = that.defaultSecondaryCode;
      }

      function ExpandedFamily(dto) {
          var that = _.extend(_.extend(
            newInstance(), {
              segmentCode: undefined,
            }), dto);
          this.id = that.id;
          this.code = that.code;
          this.description = that.description;
          this.defaultNonCataloguedBuyerCode = that.defaultNonCataloguedBuyerCode;
          this.defaultSecondaryCode = that.defaultSecondaryCode;
          this.segmentCode = that.segmentCode;
      }
    }
  }
)();
