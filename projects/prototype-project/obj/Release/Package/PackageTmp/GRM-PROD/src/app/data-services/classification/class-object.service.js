(
  function() {
    'use strict';

    angular
      .module('app.dataservices.classification')
      .factory('ClassObjectService', ClassObjectService)
    ;

    /* @ngInject */
    function ClassObjectService(ClassificationObjectService) {
      return {
        toObject : toObject,
        toExpandedObject : toExpandedObject,
        newInstance: newInstance,
        newExpandedInstance: newExpandedInstance
      };

      function toObject(dto) {
        return new Class(dto);
      }

      function toExpandedObject(dto) {
        return new ExpandedClass(dto);
      }

      function newInstance() {
        return new Class();
      }

      function newExpandedInstance() {
         return new ExpandedClass();
      }

      // Class object constructor
      function Class(dto) {
        var that = _.extend(ClassificationObjectService.newInstance(), dto);
          this.id = that.id;
          this.code = that.code;
          this.description = that.description;
          this.defaultNonCataloguedBuyerCode = that.defaultNonCataloguedBuyerCode;
          this.defaultSecondaryCode = that.defaultSecondaryCode;
      }

      function ExpandedClass(dto) {
          var that = _.extend(_.extend(
            newInstance(), {
              segmentCode: undefined,
              familyCode: undefined
            }), dto);
          this.id = that.id;
          this.code = that.code;
          this.description = that.description;
          this.defaultNonCataloguedBuyerCode = that.defaultNonCataloguedBuyerCode;
          this.defaultSecondaryCode = that.defaultSecondaryCode;
          this.segmentCode = that.segmentCode;
          this.familyCode = that.familyCode;
      }
    }
  }
)();
