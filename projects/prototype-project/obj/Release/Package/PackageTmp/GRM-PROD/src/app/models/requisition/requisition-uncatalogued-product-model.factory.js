(
  function() {
    'use strict';

    angular
        .module('app.models.requisition')
        .factory('RequisitionUncataloguedProductModel', RequisitionUncataloguedProductModelFactory);

    /* @ngInject */
    function RequisitionUncataloguedProductModelFactory() {
      return RequisitionUncataloguedProductModel;

      function RequisitionUncataloguedProductModel(obj) {
        var that = _.extend({
          account: undefined,
          buyer: undefined,
          buyerComplementaryDescription: undefined,
          buyerNote: undefined,
          class: undefined,
          cost: undefined,
          description: undefined,
          distributionUnit: undefined,
          family: undefined,
          id: undefined,
          noteToBuyer: undefined,
          notifyBuyerToCreateProduct: undefined,
          productId: undefined,
          projectActivity: undefined,
          quantity: undefined,
          secondaryCode: undefined,
          segment: undefined,
          statisticalUnit: undefined,
          taxScheme: undefined,
          unspscClassification: undefined,
          uuid: undefined,
          vendor: undefined,
          vendorItemCode: undefined
          },
        obj);

        this.account = that.account;
        this.buyer = that.buyer;
        this.buyerComplementaryDescription = that.buyerComplementaryDescription;
        this.buyerNote = that.buyerNote;
        this.class = that.class;
        this.cost = that.cost;
        this.description = that.description;
        this.distributionUnit = that.distributionUnit;
        this.family = that.family;
        this.id = that.id;
        this.noteForBuyer = that.noteForBuyer;
        this.notifyBuyerToCreateProduct = that.notifyBuyerToCreateProduct;
        this.productId = that.productId;
        this.projectActivity = that.projectActivity;
        this.quantity = that.quantity;
        this.secondaryCode = that.secondaryCode;
        this.segment = that.segment;
        this.statisticalUnit = that.statisticalUnit;
        this.taxScheme = that.taxScheme;
        this.unspscClassification = that.unspscClassification;
        this.uuid = that.uuid;
        this.vendor = that.vendor;
        this.vendorItemCode = that.vendorItemCode;

        this.clone = function clone() {
          return new RequisitionUncataloguedProductModel(this);
        };
      }
    }
  }
)();
