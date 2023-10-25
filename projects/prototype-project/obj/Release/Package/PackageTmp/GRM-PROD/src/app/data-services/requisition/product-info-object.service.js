(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition')
      .factory('ProductInfoObjectService', ProductInfoObjectService);

    /* @ngInject */
    function ProductInfoObjectService(RequisitionItemObjectService) {
      return {
        toObject: toObject,
        toDto: toDto,
        newInstance: newInstance
      };

      function toObject(dto) {
        return new ProductInfo(dto);
      }

      function toDto(object) {
        return object; // TODO - see if this will ever be needed
      }

      function newInstance() {
        return new ProductInfo();
      }

      // ProductInfo object constructor
      function ProductInfo(dto) {
        angular.extend(this,RequisitionItemObjectService.toObject(dto));
        if (!_.isNil(dto)) {
          this.warningMessage = dto.warningMessage;
        }
      }
    }
  }
)();
