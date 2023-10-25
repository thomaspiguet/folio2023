(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition-follow-up')
      .factory('RequisitionFollowUpItemObjectService', RequisitionFollowUpItemObjectService);

    /* @ngInject */
    function RequisitionFollowUpItemObjectService(DynamicLookupService) {
      return {
        newInstance: newInstance,
        toObject: toObject
      };

      function newInstance() {
        return new RequisitionFollowUpItem();
      }

      function toObject(dto) {
        return new RequisitionFollowUpItem(dto);
      }

      function RequisitionFollowUpItem(dto) {
        var that = _.extend({
          additionalProductDescription: undefined,
          authorizerInChargeCount: undefined,
          buyerName: undefined,
          buyer: undefined,
          client: undefined,
          deliveryLocation: undefined,
          department: undefined,
          daysLate: undefined,
          deliveredQty: undefined,
          deliveryDate: undefined,
          departmentId: undefined,
          dueDate: undefined,
          formatDescription: undefined,
          id: undefined,
          isOrderWithReceivingWorksheet: undefined,
          note: undefined,
          noteToBuyer: undefined,
          noteToRequester: undefined,
          orderId: undefined,
          personInCharge: undefined,
          personInChargeLastChange: undefined,
          price: undefined,
          productCode: undefined,
          productId: undefined,
          productDescription: undefined,
          qtyToReceive: undefined,
          requestedQuantity: undefined,
          requester: undefined,
          requisitionId: undefined,
          site: undefined,
          status: undefined,
          statusDescription: undefined,
          storeItemLineId: undefined,
          total: undefined,
          vendor: undefined,
          itemCode: undefined,
          contractNumber: undefined,
          cgrNumber: undefined,
          orderItemNote: undefined,
          store: undefined
        }, dto);

        this.additionalProductDescription = that.additionalProductDescription;
        this.authorizerInChargeCount = that.authorizerInChargeCount;
        this.buyerName = that.buyerName;
        this.buyer = that.buyer;
        this.client = that.client;
        this.deliveryLocation = that.deliveryLocation;
        this.department = that.department;
        this.code = that.productCode;
        this.daysLate = that.daysLate;
        this.deliveredQuantity = that.deliveredQty;
        this.deliveryDate = that.deliveryDate;
        this.departmentId = that.departmentId;
        this.description = that.productDescription;
        this.dueDate = _.isNil(that.dueDate) ? undefined : that.dueDate; // transform null => undefined
        this.formatDescription = that.formatDescription;
        this.id = that.id;
        this.isOrderWithReceivingWorksheet = that.isOrderWithReceivingWorksheet;
        this.note = that.note;
        this.noteToBuyer = that.noteToBuyer;
        this.noteToRequester = that.noteToRequester;
        this.orderId = that.orderId;
        this.personInCharge = that.personInCharge;
        this.personInChargeLastChange = that.personInChargeLastChange;
        this.price = that.price;
        this.productId = that.productId;
        this.quantity = that.requestedQuantity;
        this.quantityToReceive = that.qtyToReceive;
        this.requester = that.requester;
        this.requisitionId = that.requisitionId;
        this.site = that.site;
        this.status = _.isNil(that.status) ? '1' : that.status; //Default value always
        this.statusDescription = that.statusDescription;
        this.storeItemLineId = that.storeItemLineId;
        this.total = that.total;
        this.vendor = that.vendor;
        this.itemCode = that.itemCode;
        this.contractNumber = that.contractNumber;
        this.cgrNumber = that.cgrNumber;
        this.orderItemNote = that.orderItemNote;
        this.store = that.store;
      }
    }
  }
)();
