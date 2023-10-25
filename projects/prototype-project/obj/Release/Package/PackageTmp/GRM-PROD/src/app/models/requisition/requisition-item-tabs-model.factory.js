(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionItemTabsModel', RequisitionItemTabsModelFactory)
    ;

    /* @ngInject */
    function RequisitionItemTabsModelFactory() {
      return RequisitionItemTabsModel;
    }

    function RequisitionItemTabsModel(obj) {
      var that = _.extend({
        account: undefined,
        acquisitionReason: undefined,
        acquisitionType: undefined,
        authorizations: [],
        buyer: undefined,
        category: undefined,
        cgrNumber: undefined,
        code: undefined,
        crossDockingId: undefined,
        currentFormatDescription: undefined,
        currentPrice: undefined,
        currentQuantity: undefined,
        deliveredQuantity: undefined,
        distributionUnitQtyInAlert: undefined,
        headerDepartmentId: undefined,
        headerSiteId: undefined,
        description: undefined,
        deviation: undefined,
        distributionCenterId: undefined,
        initialFormatDescription: undefined,
        initialPrice: undefined,
        initialQuantity: undefined,
        isMsiProduct: false,
        isMultipleCatalog: false,
        isMultipleContract: false,
        isMultipleFormat: false,
        isMultipleStore: false,
        isPurchaseProcessActive: false,
        isUncataloguedProduct: false,
        itemCode: undefined,
        itemId: undefined,
        manufacturer: undefined,
        modelNumber: undefined,
        note: undefined,
        orderId: undefined,
        originalAccount: undefined,
        productId: undefined,
        productType: undefined,
        projectActivity: undefined,
        quantityAwaiting: undefined,
        quantityToReceive: undefined,
        requesterId: undefined,
        requisitionStatus: undefined,
        requisitionTypeCode: undefined,
        status: undefined,
        store: undefined,
        storeSite: undefined,
        subCategory: undefined,
        subSubCategory: undefined,
        suggestedPurchaseProcess: undefined,
        supplier: undefined,
        traceabilityStatus: false,
        usedPurchaseProcess: undefined,
        uuid: undefined,
        vendor: undefined,
      }, obj);

      //
      // global
      //
      this.productId = that.productId;
      this.productType = that.productType;
      this.requesterId = that.requesterId;
      this.requisitionStatus = that.requisitionStatus;
      this.requisitionTypeCode = that.requisitionTypeCode;
      this.uuid = that.uuid;

      //
      // product tab
      //
      this.account = that.account;
      this.buyer = that.buyer;
      this.code = that.code;
      this.description = that.description;
      this.headerDepartmentId = that.headerDepartmentId;
      this.headerSiteId = that.headerSiteId;
      this.itemId = that.itemId;
      this.itemCode = that.itemCode;
      this.note = that.note;
      this.orderId = that.orderId;
      this.projectActivity = that.projectActivity;
      this.store = that.store;
      this.storeSite = that.storeSite;
      this.supplier = that.supplier;
      this.vendor = that.vendor;

      // quantities
      this.currentFormatDescription = that.currentFormatDescription;
      this.currentPrice = that.currentPrice;
      this.currentQuantity = that.currentQuantity;
      this.deliveredQuantity = that.deliveredQuantity;
      this.distributionUnitQtyInAlert = that.distributionUnitQtyInAlert;
      this.initialFormatDescription = that.initialFormatDescription;
      this.initialPrice = that.initialPrice;
      this.initialQuantity = that.initialQuantity;
      this.quantityAwaiting = that.quantityAwaiting;
      this.quantityToReceive = that.quantityToReceive;

      // indicators
      this.crossDockingId = that.crossDockingId;
      this.distributionCenterId = that.distributionCenterId;
      this.isMsiProduct = that.isMsiProduct;
      this.isMultipleCatalog = that.isMultipleCatalog;
      this.isMultipleContract = that.isMultipleContract;
      this.isMultipleFormat = that.isMultipleFormat;
      this.isMultipleStore = that.isMultipleStore;
      this.isUncataloguedProduct = that.isUncataloguedProduct;
      this.traceabilityStatus = that.traceabilityStatus;

      // Purchase process
      this.isPurchaseProcessActive = that.isPurchaseProcessActive;
      this.suggestedPurchaseProcess = that.suggestedPurchaseProcess;
      this.usedPurchaseProcess = that.usedPurchaseProcess;
      this.deviation = that.deviation;
      this.cgrNumber = that.cgrNumber;
      
      //
      // Fixed assets tab
      //
      this.acquisitionReason = that.acquisitionReason;
      this.acquisitionType = that.acquisitionType;
      this.originalAccount = that.originalAccount;
      this.manufacturer = that.manufacturer;
      this.modelNumber = that.modelNumber;

      //
      // authorizations tab
      //
      this.authorizations = that.authorizations;

      this.clone = function clone() {
        return new RequisitionItemTabsModel(this);
      };
    }
  }
)();

