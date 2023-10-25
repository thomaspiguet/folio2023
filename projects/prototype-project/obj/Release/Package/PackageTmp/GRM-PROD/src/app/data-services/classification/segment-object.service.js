(
  function() {
    'use strict';

    angular
      .module('app.dataservices.classification')
      .factory('SegmentObjectService', SegmentObjectService)
    ;

    /* @ngInject */
    function SegmentObjectService(ClassificationObjectService) {
      return {
        toObject : toObject,
        toExpandedObject : toExpandedObject,
        newInstance: newInstance,
        newExpandedInstance: newExpandedInstance
      };

      function toObject(dto) {
        return new Segment(dto);
      }

      function toExpandedObject(dto) {
        return new ExpandedSegment(dto);
      }

      function newInstance() {
        return new Segment();
      }

      function newExpandedInstance() {
         return new ExpandedSegment();
      }

      // Segment object constructor
      function Segment(dto) {
        var that = _.extend(ClassificationObjectService.newInstance(), dto);

        this.id = that.id;
        this.code = that.code;
        this.description = that.description;
        this.defaultNonCataloguedBuyerCode = that.defaultNonCataloguedBuyerCode;
        this.defaultSecondaryCode = that.defaultSecondaryCode;
      }

      function ExpandedSegment(dto) {
          var that = _.extend(_.extend(
            newInstance(), {
              isNonCatalogued: undefined
            }), dto);

          this.id = that.id;
          this.code = that.code;
          this.description = that.description;
          this.defaultNonCataloguedBuyerCode = that.defaultNonCataloguedBuyerCode;
          this.defaultSecondaryCode = that.defaultSecondaryCode;
          this.isNonCatalogued = that.isNonCatalogued;
      }
    }
  }
)();
