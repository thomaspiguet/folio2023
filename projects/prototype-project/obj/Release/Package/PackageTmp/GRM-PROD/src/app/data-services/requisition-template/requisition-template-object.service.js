(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition-template')
      .factory('RequisitionTemplateObjectService', RequisitionTemplateObjectService);

    /* @ngInject */
    function RequisitionTemplateObjectService(RequisitionTemplateItemObjectService) {
      return {
        newInstance: newInstance,
        toObject: toObject,
        toDto: toDto
      };

      function newInstance() {
        return new RequisitionTemplateAggregateObject();
      }

      function toObject(dto) {
        return new RequisitionTemplateAggregateObject(dto);
      }

      function toDto(obj) {
        var result = {
          id: obj.id,
          name: obj.name,
          isActive: obj.isActive,
          isAutomaticGeneration:obj.isAutomaticGeneration,
          siteId: obj.site ? obj.site.id : undefined,
          departmentId: obj.department ? obj.department.id : undefined,          
          addressId: obj.address ? obj.address.id : undefined,
          clientId: obj.client ? obj.client.id : undefined,
          deliveryLocationId: obj.deliveryLocation ? obj.deliveryLocation.id : undefined,
          requesterId: obj.requester ? obj.requester.id : undefined,
          modifiedBy: obj.modifiedBy,
          modifiedOn: obj.modifiedOn,
          requisitionTemplateItems: []         
        };

        _.forEach(obj.requisitionTemplateItems, function onRequisitionTemplateItems(item) {
          result.requisitionTemplateItems.push(RequisitionTemplateItemObjectService.toDto(item));
        });

        return result;
      }

      function RequisitionTemplateAggregateObject(dto) {
        var that = _.extend({
          id: undefined,
          name: undefined,
          isActive: undefined,          
          isAutomaticGeneration: undefined,
          site: undefined,
          department: undefined,
          address: undefined,
          client: undefined,
          deliveryLocation: undefined,
          requester: undefined,
          modifiedByCode: undefined,
          modifiedByDesc: undefined,
          modifiedOn: undefined
        }, dto);
       
        this.id = that.id;
        this.name = that.name;
        this.isActive = that.isActive;
        this.isAutomaticGeneration = that.isAutomaticGeneration;
        this.site = that.site;
        this.department = that.department;
        this.address = that.address;
        this.client = that.client;
        this.deliveryLocation = that.deliveryLocation;
        this.requester = that.requester;
        this.modifiedByCode = that.modifiedByCode;
        this.modifiedByDesc = that.modifiedByDesc;
        this.modifiedOn = that.modifiedOn;
        
        var requisitionTemplateItems = this.requisitionTemplateItems = [];

        if (!_.isNil(dto)) {
          _.forEach(dto.requisitionTemplateItems, function onRequisitionTemplateItems(item) {
            requisitionTemplateItems.push(RequisitionTemplateItemObjectService.toObject(item));
          });
        }
      }
    }
  }
)();
