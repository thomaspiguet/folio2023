(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition-template')
      .factory('RequisitionTemplateItemObjectService', RequisitionTemplateItemObjectService);

    /* @ngInject */
    function RequisitionTemplateItemObjectService(DynamicLookupService) {
      return {
        newInstance: newInstance,
        toDto: toDto,
        toObject: toObject
      };

      function newInstance() {
        return new RequisitionTemplateItem();
      }

      function toDto(obj) {
        var result = {
          id: obj.id,
          requisitionTemplateId: obj.requisitionTemplateId,
          productId: obj.productId,
          invalidityReason: obj.invalidityReason,
          quantity: obj.quantity,
          lineNumber: obj.lineNumber,                    
          frequencyId: obj.frequencyId,
          monday: obj.monday,
          tuesday: obj.tuesday,
          wednesday: obj.wednesday,
          thursday: obj.thursday,
          friday: obj.friday,
          saturday: obj.saturday,
          sunday: obj.sunday,          
          storeId: obj.store ? obj.store.id : null,
          modifiedBy: obj.modifiedBy,
          modifiedOn: obj.modifiedOn
        };

        return result;
      }

      function toObject(dto) {
        return new RequisitionTemplateItem(dto);
      }

      // RequisitionTemplate item object constructor
      function RequisitionTemplateItem(dto) {
        var that = _.extend({
          id: undefined,
          requisitionTemplateId: undefined,
          productId: undefined,
          lineNumber: undefined,
          code: undefined,
          productDescription: undefined,
          invalidityReason: undefined,
          quantity: undefined,          
          frequencyId: 1,
          monday: undefined,
          tuesday: undefined,
          wednesday: undefined,
          thursday: undefined,
          friday: undefined,
          saturday: undefined,
          sunday: undefined,          
          modifiedBy: undefined,
          modifiedByCode: undefined,
          modifiedByDesc: undefined,
          modifiedOn: undefined,
          productType: undefined,
          isMsiProduct: undefined,
          store: undefined,
          multiple: undefined,
          site: undefined,
          buyer: undefined,
          isExternallySellable: undefined,
          isMultipleStore: undefined,
          formatCode: undefined,
          formatDescription: undefined,
          formatRelation: undefined,
          isMultipleCatalog: undefined,
          isMultipleContract: undefined,
          isMultipleFormat: undefined,
          vendorCode: undefined,
          vendorDescription: undefined,
          itemCode: undefined,
          distributionUnitQtyInAlert: undefined,
          crossDockingId: undefined,
          distributionCenterId: undefined
        }, dto);
        
        this.id = that.id;
        this.requisitionTemplateId = that.requisitionTemplateId;
        this.lineNumber = that.lineNumber;
        this.productId = that.productId;
        this.code = that.productCode;
        this.productDescription = that.productDescription;
        this.invalidityReason = that.invalidityReason;
        this.quantity = that.quantity;
        this.frequencyId = that.frequencyId;
        this.monday = that.monday;
        this.tuesday = that.tuesday;
        this.wednesday = that.wednesday;
        this.thursday = that.thursday;
        this.friday = that.friday;
        this.saturday = that.saturday;
        this.sunday = that.sunday;
        this.modifiedBy = that.modifiedBy;
        this.modifiedByCode = that.modifiedByCode;
        this.modifiedByDesc = that.modifiedByDesc;
        this.modifiedOn = that.modifiedOn;
        this.productType = that.productType;
        this.isMsiProduct = that.isMsiProduct;
        this.store = that.store;
        this.storeDB = that.store;//Used to keep original database value.        
        this.multiple = that.multiple;
        this.site = that.site;
        this.buyer = that.buyer;
        this.isMultipleStore = that.isMultipleStore;
        this.formatCode = that.formatCode;
        this.formatDescription = that.formatDescription;
        this.formatRelation = that.formatRelation;
        this.isExternallySellable = that.isExternallySellable;
        this.isMultipleCatalog = that.isMultipleCatalog;
        this.isMultipleContract = that.isMultipleContract;
        this.isMultipleFormat = that.isMultipleFormat;
        this.vendorCode = that.vendorCode;
        this.vendorDescription = that.vendorDescription;
        this.itemCode = that.itemCode;
        this.distributionUnitQtyInAlert = that.distributionUnitQtyInAlert;
        this.crossDockingId = that.crossDockingId;
        this.distributionCenterId = that.distributionCenterId;
      }
    }
  }
)();
