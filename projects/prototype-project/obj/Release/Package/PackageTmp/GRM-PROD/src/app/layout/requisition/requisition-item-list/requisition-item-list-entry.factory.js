(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-item-list')
      .factory('RequisitionItemListEntry', RequisitionItemListEntryFactory)
    ;

    /* @ngInject */
    function RequisitionItemListEntryFactory() {
      return RequisitionItemListEntry;
    }

    function RequisitionItemListEntry(obj) {
      var that = _.extend({
        id: undefined, 
        isUncataloguedProduct: undefined,       
        code: undefined,
        statusDescription : undefined,
        status : undefined,
        dueDate : undefined,
        price : undefined,
        type : undefined,
        description : undefined,
        formatDescription : undefined,
        quantity : undefined,
        quantityAwaiting : undefined,
        distributionUnitQtyInAlert: undefined,
        note: undefined,
        multiple: undefined,
        uuid: undefined
      }, obj);

      this.id = that.id;
      this.isUncataloguedProduct = that.isUncataloguedProduct;
      this.code = that.code;
      this.statusDescription = that.statusDescription;
      this.status = that.status;
      this.dueDate = that.dueDate;
      this.price = that.price;
      this.type = that.type;
      this.description = that.description;
      this.formatDescription = that.formatDescription;
      this.quantity = that.quantity;
      this.quantityAwaiting = that.quantityAwaiting;
      this.distributionUnitQtyInAlert = that.distributionUnitQtyInAlert;
      this.note = that.note;
      this.multiple = that.multiple;
      this.uuid = that.uuid;

      this.computeSubTotal = function computeSubTotal() {
        if (this.quantity && this.price) {
          return this.quantity * this.price;
        }
        return 0;
      };

      this.reset = function reset() {
        this.id = undefined;
        this.isUncataloguedProduct = undefined;
        this.code = undefined;
        this.statusDescription = undefined;
        this.status = undefined;
        this.dueDate = undefined;
        this.price = undefined;
        this.type = undefined;
        this.description = undefined;
        this.formatDescription = undefined;
        this.quantity = undefined;
        this.quantityAwaiting = undefined;
        this.distributionUnitQtyInAlert = undefined;
        this.note = undefined;
        // this.uuid = that.uuid; // Keep the uuid in case of a reset
      };
    }
  }
)();
