(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition')
      .factory('RequisitionItemObjectService', RequisitionItemObjectService);

    /* @ngInject */
    function RequisitionItemObjectService(DynamicLookupService) {
      return {
        assign: _assign,
        copy: copy,
        newInstance: newInstance,
        toDto: toDto,
        toObject: toObject
      };

      function _assign(target, source) {
        // TODO safety attempt - review this
        if (_.isNil(target) && _.isNil(source)) {
          return new RequisitionItem();
        }
        else if (_.isNil(source)) {
          return target;
        }
        else if (_.isNil(target)) {
          return source;
        }

        // target.uuid = source.uuid;
        target.account = source.account;
        target.acquisitionReason = source.acquisitionReason;
        target.acquisitionType = source.acquisitionType;
        target.buyer = source.buyer;
        target.buyerName = source.buyerName;
        target.buyerComplementaryDescription = source.buyerComplementaryDescription;
        target.buyerNote = source.buyerNote;
        target.catalogId = source.catalogId;
        target.cgrNumber = source.cgrNumber;
        target.code = source.code;
        target.complementaryDescription = source.complementaryDescription;
        target.contractItemId = source.contractItemId;
        target.crossDockingId = source.crossDockingId;
        target.daysLate = source.daysLate;
        target.deliveredQuantity = source.deliveredQuantity;
        target.deliveryDate = source.deliveryDate;
        target.description = source.description;
        target.deviation = source.deviation;
        target.distributionCenterEdiFormatId = source.distributionCenterEdiFormatId;
        target.distributionCenterId = source.distributionCenterId;
        target.distributionUnitQtyInAlert = source.distributionUnitQtyInAlert;
        target.dueDate = _.isNil(source.dueDate) ? undefined : source.dueDate; // transform null => undefined
        target.formatCode = source.formatCode;
        target.formatDescription = source.formatDescription;
        target.formatId = source.formatId;
        target.formatRelation = source.formatRelation;
        target.id = source.id;
        target.initialFormatDescription = source.initialFormatDescription;
        target.initialFormatId = source.initialFormatId;
        target.initialPrice = source.initialPrice;
        target.initialQuantity = source.initialQuantity;
        target.initialRelation = source.initialRelation;
        target.isImmobilizedProduct = source.isImmobilizedProduct;
        target.isMsiProduct = source.isMsiProduct;
        target.isMultipleCatalog = source.isMultipleCatalog;
        target.isMultipleContract = source.isMultipleContract;
        target.isMultipleFormat = source.isMultipleFormat;
        target.isMultipleStore = source.isMultipleStore;
        target.isUncataloguedProduct = source.isUncataloguedProduct;
        target.itemCode = source.itemCode;
        target.manufacturer = source.manufacturer;
        target.modelNumber = source.modelNumber;
        target.modifiedBy = source.modifiedBy;
        target.modifiedOn = source.modifiedOn;
        target.multiple = source.multiple;
        target.note = source.note;
        target.noteForBuyer = source.noteForBuyer;
        target.notifyBuyerToCreateProduct = source.notifyBuyerToCreateProduct;
        target.orderId = source.orderId;
        target.originalAccount = source.originalAccount;
        target.originalBuyer = source.originalBuyer;
        target.originalClass = source.originalClass;
        target.originalDistributionUnit = source.originalDistributionUnit;
        target.originalFamily = source.originalFamily;
        target.originalFormatRelationId = source.originalFormatRelationId;
        target.originalPrice = source.originalPrice;
        target.originalProductId = source.originalProductId;
        target.originalProjectActivity = source.originalProjectActivity;
        target.originalQty = source.originalQty;
        target.originalSecondaryCode = source.originalSecondaryCode;
        target.originalSegment = source.originalSegment;
        target.originalTaxId = source.originalTaxId;
        target.originalTaxUnit = source.originalTaxUnit;
        target.originalUnspscClassification = source.originalUnspscClassification;
        target.originalVendor = source.originalVendor;
        target.originalVendorItemCode = source.originalVendorItemCode;
        target.price = source.price;
        target.productId = source.productId;
        target.projectActivity = source.projectActivity;
        target.quantity = source.quantity;
        target.quantityAwaiting = source.quantityAwaiting;
        target.quantityToReceive = source.quantityToReceive;
        target.requestedQty = source.requestedQty;
        target.requisitionId = source.requisitionId;
        target.site = source.site;
        target.statisticalUnit = source.statisticalUnit;
        target.status = source.status;
        target.statusDescription = source.statusDescription;
        target.store = source.store;
        target.suggestedPurchaseProcess = source.suggestedPurchaseProcess;
        target.traceabilityStatus = source.traceabilityStatus;
        target.type = source.type;
        target.usedPurchaseProcess = source.usedPurchaseProcess;
        target.vendor = source.vendor;

        return target;
      }

      function copy(that) {
        var requisitionItem = new RequisitionItem();
        return _assign(requisitionItem, that);
      }

      function newInstance() {
        return new RequisitionItem();
      }

      function toDto(obj) {

        function resolveImmoCategory(obj) {
          var result;
          if (obj.account) {
            if (obj.account.subSubCategory) {
              result = obj.account.subSubCategory.id;
            }
            else if (obj.account.subCategory) {
              result = obj.account.subCategory.id;
            }
            else if (obj.account.category) {
              result = obj.account.category.id;
            }
          }
          else if (obj.originalAccount) {
            if (obj.originalAccount.subSubCategory) {
              result = obj.originalAccount.subSubCategory.id;
            }
            else if (obj.originalAccount.subCategory) {
              result = obj.originalAccount.subCategory.id;
            }
            else if (obj.originalAccount.category) {
              result = obj.originalAccount.category.id;
            }            
          }
          return result;
        }

        var result = {
          accountId: obj.account ? obj.account.id : undefined,
          acquisitionTypeId: obj.acquisitionType ? obj.acquisitionType.id : undefined,
          acquisitionReasonId: obj.acquisitionReason ? obj.acquisitionReason.id : undefined,
          buyerComplementaryDescription: obj.buyerComplementaryDescription,
          buyerNote: obj.buyerNote,
          catalogId: obj.catalogId,
          cgrNumberId: obj.cgrNumber ? obj.cgrNumber.id : undefined,
          complementaryDescription: obj.complementaryDescription,
          contractItemId: obj.contractItemId,
          crossDockingId: obj.crossDockingId,
          deliveredQty: obj.deliveredQuantity,
          deviationId: obj.deviation ? obj.deviation.id : undefined,
          distributionCenterEdiFormatId: obj.distributionCenterEdiFormatId,
          distributionCenterId: obj.distributionCenterId,
          dueDate: _.isNil(obj.dueDate) ? undefined : obj.dueDate, // transform null => undefined
          formatId: obj.formatId,
          formatRelation: obj.formatRelation,
          id: obj.id,
          immoCategoryId: resolveImmoCategory(obj),
          initialFormatId: obj.initialFormatId,
          initialPrice: obj.initialPrice,
          initialQty: obj.initialQuantity,
          initialRelation: obj.initialRelation,
          isUncataloguedProduct: obj.isUncataloguedProduct,
          manufacturerId: obj.manufacturer ? obj.manufacturer.id : undefined,
          modelNumber: obj.modelNumber,
          modifiedBy: obj.modifiedBy,
          modifiedOn: obj.modifiedOn,
          multiple : obj.multiple,
          note: obj.note,
          noteForBuyer : obj.noteForBuyer,
          notifyBuyerToCreateProduct : obj.notifyBuyerToCreateProduct,
          orderId: obj.orderId,
          originalAccountId: obj.originalAccount ? obj.originalAccount.id : undefined,
          originalBuyerId: obj.originalBuyer ? obj.originalBuyer.id : undefined,
          originalClassCode: obj.originalClass ? obj.originalClass.code : undefined,
          originalDistributionUnitId: obj.originalDistributionUnit ? obj.originalDistributionUnit.id : undefined,
          originalFamilyCode: obj.originalFamily ? obj.originalFamily.code : undefined,
          originalFormatRelationId: obj.originalFormatRelationId,
          originalPrice : obj.originalPrice,
          originalProductId: obj.originalProductId,
          originalProjectActivityId: obj.originalProjectActivity ? obj.originalProjectActivity.id : undefined,
          originalQty : obj.originalQty,
          originalSecondaryCodeId: obj.originalSecondaryCode ? obj.originalSecondaryCode.id : undefined,
          originalSegmentCode: obj.originalSegment ? obj.originalSegment.code : undefined,
          originalTaxId : (obj.originalTaxId || obj.originalTaxUnit) ? obj.originalTaxId || obj.originalTaxUnit.id : undefined,
          originalUnspscClassificationId: obj.originalUnspscClassification ?  obj.originalUnspscClassification.id : undefined,
          originalVendorId : obj.originalVendor ? obj.originalVendor.id ? obj.originalVendor.code : undefined : undefined,
          originalVendorItemCode: obj.originalVendorItemCode,
          originalVendorName : obj.originalVendor ? obj.originalVendor.id ? undefined : obj.originalVendor.description : undefined,
          price: obj.price,
          productId: obj.productId,
          projectActivityId: obj.projectActivity ? obj.projectActivity.id : undefined,
          qtyToReceive: obj.quantityToReceive,
          requestedQty: obj.quantity,
          requisitionId: obj.requisitionId,
          statisticalUnitId: obj.statisticalUnit ? obj.statisticalUnit.id : undefined,
          status: obj.status,
          storeId: obj.store ? obj.store.id : undefined,
          suggestedPurchaseProcessId: obj.suggestedPurchaseProcess ? obj.suggestedPurchaseProcess.id : undefined,
          type: obj.type,
          usedPurchaseProcessId: obj.usedPurchaseProcess ? obj.usedPurchaseProcess.id : undefined,
          vendorId: obj.vendor ? obj.vendor.id : undefined
        };

        return result;
      }

      function toObject(dto) {
        return new RequisitionItem(dto);
      }
      // Requisition item object constructor
      function RequisitionItem(dto) {
        var that = _.extend({
            account: undefined,
            acquistionReason: undefined,
            acquisitionType: undefined,
            buyer: undefined,
            buyerComplementaryDescription: undefined,
            buyerName: undefined,
            buyerNote: undefined,
            catalogId: undefined,
            cgrNumber: undefined,
            complementaryDescription: undefined,
            contractItemId: undefined,
            crossDockingId: undefined,
            daysLate: undefined,
            deliveredQty: undefined,
            deliveryDate: undefined,
            deviation: undefined,
            distributionCenterId: undefined,
            distributionCenterEdiFormatId: undefined,
            distributionUnitQtyInAlert: undefined,
            dueDate: undefined,
            formatCode: undefined,
            formatDescription: undefined,
            formatId: undefined,
            formatRelation: undefined,
            id: undefined,
            initialFormatDescription: undefined,
            initialFormatId: undefined,
            initialPrice: undefined,
            initialQty: undefined,
            initialRelation: undefined,
            isImmobilizedProduct: undefined,
            isMsiProduct: undefined,
            isMultipleCatalog: undefined,
            isMultipleContract: undefined,
            isMultipleFormat: undefined,
            isMultipleStore: undefined,
            isUncataloguedProduct: undefined,
            itemCode: undefined,
            manufacturer: undefined,
            modelNumber: undefined,
            modifiedBy: undefined,
            modifiedOn: undefined,
            multiple: undefined,
            note: undefined,
            noteForBuyer: undefined,
            notifyBuyerToCreateProduct: undefined,
            orderId: undefined,
            originalAccount: undefined,
            originalBuyer: undefined,
            originalClass: undefined,
            originalDistributionUnit: undefined,
            originalFamily: undefined,
            originalFormatRelationId: undefined,
            originalPrice: undefined,
            originalProductId: undefined,
            originalProjectActivity: undefined,
            originalQty: undefined,
            originalSecondaryCode: undefined,
            originalSegment: undefined,
            originalTaxId: undefined,
            originalTaxUnit: undefined,
            originalUnspscClassification: undefined,
            originalVendor: undefined,
            originalVendorItemCode: undefined,
            price: undefined,
            productCode: undefined,
            productDescription: undefined,
            productId: undefined,
            projectActivity: undefined,
            qtyToReceive: undefined,
            quantity: undefined,
            quantityAwaiting: undefined,
            requestedQty: undefined,
            requisitionId: undefined,
            site: undefined,
            statisticalUnit: undefined,
            status: undefined,
            store: undefined,
            suggestedPurchaseProcess: undefined,
            traceabilityStatus: undefined,
            type: undefined,
            usedPurchaseProcess: undefined,
            vendor: undefined
          },
          dto);

        this.account = that.account;
        this.acquisitionReason = that.acquisitionReason;
        this.acquisitionType = that.acquisitionType;
        this.buyer = that.buyer;
        this.buyerComplementaryDescription = that.buyerComplementaryDescription;
        this.buyerName = that.buyerName;
        this.buyerNote = that.buyerNote;
        this.catalogId = that.catalogId;
        this.cgrNumber = that.cgrNumber;
        this.code = that.productCode;
        this.complementaryDescription = that.complementaryDescription;
        this.contractItemId = that.contractItemId;
        this.crossDockingId = that.crossDockingId;
        this.daysLate = that.daysLate;
        this.deliveredQuantity = that.deliveredQty;
        this.deliveryDate = that.deliveryDate;
        this.description = that.productDescription;
        this.deviation = that.deviation;
        this.distributionCenterEdiFormatId = that.distributionCenterEdiFormatId;
        this.distributionCenterId = that.distributionCenterId;
        this.distributionUnitQtyInAlert = that.distributionUnitQtyInAlert;
        this.dueDate = _.isNil(that.dueDate) ? undefined : that.dueDate; // transform null => undefined
        this.formatCode = that.formatCode;
        this.formatDescription = that.formatDescription;
        this.formatId = that.formatId;
        this.formatRelation = that.formatRelation;
        this.id = that.id;
        this.initialFormatDescription = that.initialFormatDescription;
        this.initialFormatId = that.initialFormatId;
        this.initialPrice = that.initialPrice;
        this.initialQuantity = that.initialQty;
        this.initialRelation = that.initialRelation;
        this.isImmobilizedProduct = that.isImmobilizedProduct;
        this.isMsiProduct = that.isMsiProduct;
        this.isMultipleCatalog = that.isMultipleCatalog;
        this.isMultipleContract = that.isMultipleContract;
        this.isMultipleFormat = that.isMultipleFormat;
        this.isMultipleStore = that.isMultipleStore;
        this.isUncataloguedProduct = that.isUncataloguedProduct;
        this.itemCode = that.itemCode;
        this.manufacturer = that.manufacturer;
        this.modelNumber = that.modelNumber;
        this.modifiedBy = that.modifiedBy;
        this.modifiedOn = that.modifiedOn;
        this.multiple = that.multiple;
        this.note = that.note;
        this.noteForBuyer = that.noteForBuyer;
        this.notifyBuyerToCreateProduct = that.notifyBuyerToCreateProduct;
        this.orderId = that.orderId;
        this.originalAccount = that.originalAccount;
        this.originalBuyer = that.originalBuyer;
        this.originalClass = that.originalClass;
        this.originalDistributionUnit = that.originalDistributionUnit;
        this.originalFamily = that.originalFamily;
        this.originalFormatRelationId = that.originalFormatRelationId;
        this.originalPrice = that.originalPrice;
        this.originalProductId = that.originalProductId;
        this.originalProjectActivity = that.originalProjectActivity;
        this.originalQty = that.originalQty;
        this.originalSecondaryCode = that.originalSecondaryCode;
        this.originalSegment = that.originalSegment;
        this.originalTaxId = that.originalTaxId;
        this.originalTaxUnit = that.originalTaxUnit;
        this.originalUnspscClassification = that.originalUnspscClassification;
        this.originalVendor = that.originalVendor;
        this.originalVendorItemCode = that.originalVendorItemCode;
        this.price = that.price;
        this.productId = that.productId;
        this.projectActivity = that.projectActivity;
        this.quantity = that.requestedQty;
        this.quantityAwaiting = that.quantityAwaiting;
        this.quantityToReceive = that.qtyToReceive;
        this.requisitionId = that.requisitionId;
        this.site = that.site;
        this.statisticalUnit = that.statisticalUnit;
        this.status = _.isNil(that.status) ? '1' : that.status; //Default value always
        this.statusDescription = DynamicLookupService.getRequisitionItemStatuses().getDescriptionByCode(this.status);
        this.store = that.store;
        this.suggestedPurchaseProcess = that.suggestedPurchaseProcess;
        this.traceabilityStatus = that.traceabilityStatus;
        this.type = that.type;
        this.usedPurchaseProcess = that.usedPurchaseProcess;
        this.vendor = that.vendor;
      }
    }
  }
)();
