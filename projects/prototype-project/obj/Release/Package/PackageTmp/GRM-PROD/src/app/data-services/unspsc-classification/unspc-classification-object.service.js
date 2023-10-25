(
  function() {
    'use strict';

    angular
      .module('app.dataservices.unspsc-classification')
      .factory('UnspscClassificationObjectService', UnspscClassificationObjectService)
    ;

    /* @ngInject */
    function UnspscClassificationObjectService() {
      return {
        toObject : toObject,
        toExpandedObject : toExpandedObject,
        newInstance: newInstance,
        newExpandedInstance: newExpandedInstance
      };

      function toObject(dto) {
        return new UnspscClassification(dto);
      }

      function toExpandedObject(dto) {
        return new ExpandedUnspscClassification(dto);
      }

      function newInstance() {
        return new UnspscClassification();
      }

      function newExpandedInstance() {
         return new ExpandedUnspscClassification();
      }

      // UnspscClassification object constructor
      function UnspscClassification(dto) {
        var that = _.extend({
          id: undefined,
          code: undefined,
          shortCode: undefined,          
          description: undefined,
          additionalDescription: undefined
        }, dto);
       
        this.id = that.id;
        this.code = that.code;
        this.shortCode = that.shortCode;
        this.description = that.description;
        this.additionalDescription = that.additionalDescription;
      }

      function ExpandedUnspscClassification(dto) {
          var that = _.extend(_.extend(
            newInstance(), {
              segment: undefined,
              family: undefined,
              class: undefined,
              identifier: undefined
            }), dto);

          this.id = that.id;
          this.code = that.code;
          this.shortCode = that.shortCode;
          this.description = that.description;
          this.additionalDescription = that.additionalDescription;
          this.segment = that.segment;
          this.family = that.family;
          this.class = that.class;
          this.identifier = that.identifier;
      }
    }
  }
)();
