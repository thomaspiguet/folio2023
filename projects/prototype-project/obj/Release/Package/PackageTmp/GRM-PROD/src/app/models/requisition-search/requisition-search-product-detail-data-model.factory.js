(
  function() {
    'use strict';

    angular
      .module('app.models')
      .factory('RequisitionSearchProductDetailDataModel', RequisitionSearchProductDetailDataModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchProductDetailDataModelFactory() {
      return RequisitionSearchProductDetailDataModel;
    }

    //obj.requisition
    //obj.requisitionItem
    function RequisitionSearchProductDetailDataModel(obj) {
      // Header parts
      var thatRequisition = _.extend({
        client: undefined,
        deliveryLocation: undefined,
        department: undefined,
        requester: undefined,
        site: undefined,
        externalReferenceNumber: undefined,
      }, _.isNil(obj) || _.isNil(obj.requisition) ? obj : obj.requisition);

      // Item parts
      var thatRequisitionItem = _.extend({
        buyer: undefined,
        description: undefined,
        deviation: undefined,
        formatDescription: undefined,
        id: undefined,
        note: undefined,
        orderId: undefined,
        projectActivity: undefined,
        store: undefined,
        suggestedPurchaseProcess: undefined,
        usedPurchaseProcess: undefined,
        vendor: undefined
      }, _.isNil(obj) || _.isNil(obj.requisitionItem) ? obj : obj.requisitionItem);

      this.buyer = thatRequisitionItem.buyer;
      this.client = thatRequisition.client;
      this.deliveryLocation = thatRequisition.deliveryLocation;
      this.department = thatRequisition.department;
      this.description = thatRequisitionItem.description;
      this.deviation = thatRequisitionItem.deviation;
      this.externalReferenceNumber = thatRequisition.externalReferenceNumber;
      this.formatDescription = thatRequisitionItem.formatDescription;
      this.id = thatRequisitionItem.id;
      this.note = thatRequisitionItem.note;
      this.orderId = thatRequisitionItem.orderId;
      this.projectActivity = thatRequisitionItem.projectActivity;
      this.requester = thatRequisition.requester;
      this.site = thatRequisition.site;
      this.store = thatRequisitionItem.store;
      this.suggestedPurchaseProcess = thatRequisitionItem.suggestedPurchaseProcess;
      this.usedPurchaseProcess = thatRequisitionItem.usedPurchaseProcess;
      this.vendor = thatRequisitionItem.vendor;

      this.clone = function clone() {
        return new RequisitionSearchProductDetailDataModel(this);
      };

    }
  }
)();
