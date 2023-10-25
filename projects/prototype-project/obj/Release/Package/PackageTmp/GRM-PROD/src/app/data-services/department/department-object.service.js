(
  function() {
    'use strict';

    angular
      .module('app.dataservices.department')
      .factory('DepartmentObjectService',DepartmentObjectService);

    /* @ngInject */
    function DepartmentObjectService(ControlLookupObjectService) {
      return {
        newInstance: newInstance,
        toObject: toObject
      };

      function newInstance() {
        return new Department();
      }

      function toObject(dto) {
        return new Department(dto);
      }

      function Department(dto) {
        var that = _.extend({
          address: undefined,
          id: undefined,
          isExternalSales: undefined,
          code: undefined,
          description: undefined,
          establishmentId: undefined,
          primaryCode: undefined,
          site: undefined
        }, dto);

        this.address = ControlLookupObjectService.toObject(that.address);
        this.id = that.id;
        this.isExternalSales = that.isExternalSales;
        this.code = that.code;
        this.description = that.description;
        this.establishmentId = that.establishmentId;
        this.primaryCode = that.primaryCode;
        this.site = ControlLookupObjectService.toObject(that.site);
      }
    }
  }
)();
