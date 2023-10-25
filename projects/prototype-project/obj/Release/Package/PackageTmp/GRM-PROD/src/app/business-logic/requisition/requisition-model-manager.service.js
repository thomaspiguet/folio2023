(
  function() {
    'use strict';

    /**
     * The model manager for the requisition application facet. This service is in charge of
     * handling all requisition related model manipulations (creation, udpates, etc).
     */
    angular
      .module('app.business-logic.requisition')
      .factory('RequisitionModelManager', RequisitionModelManagerFactory)
    ;

    /**
     * The RequisitionModelManager factory function
     */
    /* @ngInject */
    function RequisitionModelManagerFactory(
        $filter,
        DynamicLookupService,
        InstitutionParameterService,
        RequisitionHeaderModel,
        RequisitionItemListEntry,
        RequisitionItemListModel,
        RequisitionItemObjectService,
        RequisitionItemTabsModel,
        RequisitionObjectService,
        RequisitionProgressModel,
        RequisitionUncataloguedProductModel,
        RequisitionAuthorizerManagementModel,
        RequisitionViewModel,
        uuid4
      ) {

      // A reference to this
      var self = this;

      // A reference to the translate filter. This is used to
      // set the requisition identifier in a localized fashion
      var translator = $filter('translate');

      // The requistion identifier key for a new requisition
      var newRequisitionLabel = 'newFeminine';

      // The requisition data models
      var requisitionHeaderModel;
      var requisitionItemListModel;
      var requisitionItemTabsModel;
      var requisitionProgressModel;
      var requisitionUncataloguedProductModel;
      var requisitionAuthorizerManagementModel;
      var requisitionViewModel;

      // If an existing requisition object is fetched, we'll keep trace of it, in a pristine state
      var pristineRequisitionObject;

      // A requisition item aggregate collection
      var requisitionItemAggregates;

      /**
       * Initialize this model manager. All managed component models are properly initialized when this exits.
       */
      self.initialize = function initialize(obj) {
        // Until we get to ES6 with default parameter values, let's assume an empty object...
        if (_.isNil(obj)) {
          obj = {};
        }

        pristineRequisitionObject = undefined;
        requisitionItemAggregates = [];

        requisitionHeaderModel = new RequisitionHeaderModel();
        requisitionProgressModel = new RequisitionProgressModel();
        requisitionItemListModel = new RequisitionItemListModel();
        requisitionItemTabsModel = new RequisitionItemTabsModel();
        requisitionUncataloguedProductModel = new RequisitionUncataloguedProductModel();
        requisitionAuthorizerManagementModel = new RequisitionAuthorizerManagementModel();
        requisitionViewModel = new RequisitionViewModel({
          requisitionLabel: translator(newRequisitionLabel),
          uncataloguedProductSavedValues: obj.uncataloguedProductSavedValues
        });

      };

      /**
       * Synchronize all of this manager's models
       *
       * @param {RequisitionAggregateObject} obj - The source object used to synchronize the models
       * @see {@link RequisitionObjectService}
       */
      self.synchronizeAllModels = function synchronizeAllModels(obj, stampDataAsIs) {
        if (!_.isNil(obj) && !_.isNil(obj.requisition)) {
          // If given param is defined, keep a reference to it in a pristine state
          pristineRequisitionObject = obj.requisition;
        }

        // Default to false...
        if (_.isNil(stampDataAsIs)) {
          stampDataAsIs = false;
        }

        // Initialize a default list of requisition items
        var requisition = obj.requisition;
        var requisitionItems = [];
        if (requisition && !_.isNil(requisition.requisitionItems) && _.isArray(requisition.requisitionItems)) {
          requisitionItems = requisition.requisitionItems;
        }

        // Compute the requisition item aggregates from the given list of (pure) requisition items
        self.initializeRequisitionItemAggregates(requisitionItems);
        var targetUuid;
        if (requisitionItemAggregates.length > 0) {
          if (!_.isNil(obj.itemId)) {
            var aggregate = _.find(requisitionItemAggregates, function iterator(ria) {
              return String(ria.id) === obj.itemId;
            });
            if (!_.isNil(aggregate)) {
              targetUuid = aggregate.uuid;
            }
          }
          if (_.isNil(targetUuid)) {
            targetUuid = requisitionItemAggregates[0].uuid;
          }
        }

        // Sync all models
        self.synchronizeRequisitionHeaderModel(requisition, stampDataAsIs);
        self.synchronizeRequisitionProgressModel(requisition);
        self.synchronizeRequisitionItemListModel({
          uuid: targetUuid
        });
        self.synchronizeRequisitionItemTabsModel({
          uuid: targetUuid
        });

        var uncataloguedProductSavedValues = requisitionViewModel.uncataloguedProductSavedValues;
        self.synchronizeRequisitionViewModel({
          requisitionId: requisition ? requisition.id : undefined,
          uncataloguedProductSavedValues: uncataloguedProductSavedValues
        });
      };

      /**
       * Synchronize the requisition header model
       *
       * @param {object} obj - The source object used to synchronize the models
       */
      self.synchronizeRequisitionHeaderModel = function synchronizeRequisitionHeaderModel(obj, stampDataAsIs) {

        // Change detection - check if requisition type has changed
        var recomputeTabsModel = requisitionHeaderModel.type !== obj.type;

        var rhm = new RequisitionHeaderModel();
        rhm.address = obj.address;
        rhm.client = obj.client;
        rhm.completedBy = obj.completedBy;
        rhm.completedOn = obj.completedOn;
        rhm.createdOn = new Date(obj.createdOn);
        rhm.deliveryLocation = obj.deliveryLocation;
        rhm.department = obj.department;
        rhm.id = obj.id;
        rhm.interface = obj.interface;
        rhm.installationSite = obj.installationSite;
        rhm.isWeeklyConsommationDisplayed = obj.isWeeklyConsommationDisplayed;
        rhm.modifiedOn = obj.modifiedOn;
        rhm.modifiedByUsername = obj.modifiedByUsername;
        rhm.requesterNote = obj.requesterNote;
        rhm.originStatusCode = obj.originStatusCode;
        rhm.originStatusDescription = obj.originStatusDescription;
        rhm.phoneExtension = obj.phoneExtension;
        rhm.repetitiveContractNumber = obj.repetitiveContractNumber;
        rhm.requester = obj.requester;
        rhm.requiredOn = new Date(obj.requiredOn);
        rhm.requisitionTemplate = obj.requisitionTemplate;
        rhm.site = obj.site;
        rhm.splitOnUniqueOrder = obj.splitOnUniqueOrder;
        rhm.status = obj.status;
        rhm.type = obj.type;
        rhm.wmsLastShipmentDate = obj.wmsLastShipmentDate;
        rhm.wmsLocked = obj.wmsLocked;

        if (!stampDataAsIs) {
          if (!_.isNil(obj.department)) {
            // Use site/address from selected department
            if (obj.department !== requisitionHeaderModel.department) {
              if (!_.isNil(obj.department.site)) {
                rhm.site = obj.department.site;
              }
              if (!_.isNil(obj.department.address)) {
                rhm.address = obj.department.address;
              }
            }
          }

          // We reset client systematically on department change...
          if (obj.department !== requisitionHeaderModel.department) {
            rhm.client = undefined;
          }

          if (obj.client !== requisitionHeaderModel.client) {
            rhm.requisitionTemplate = undefined;
          }

          // Force requisition type to regular if selected department is external sales
          if (rhm.department && rhm.department.isExternalSales) {
            rhm.type = DynamicLookupService.getRequisitionTypes()._1.code;
          }

          // Null out installation site if requisition type is regular
          if (_.isNil(rhm.type) || DynamicLookupService.getRequisitionTypes()._1.code === rhm.type) {
            rhm.installationSite = undefined;
          }

          rhm.phoneExtension = obj.requester ? (!_.isNil(obj.phoneExtension) ? obj.phoneExtension : obj.requester.phoneExtension) : undefined;
        }

        requisitionHeaderModel = rhm;

        // Change detection - sync tabs model
        if (recomputeTabsModel) {
          self.synchronizeRequisitionItemTabsModel(requisitionItemTabsModel);
          self.synchronizeRequisitionItemAggregateFromRequisitionItemTabsModel(requisitionItemTabsModel);
        }
      };

      /**
       * Synchronize the requisition progress data model
       *
       * @param {object} obj - The source object used to synchronize the model
       */
      self.synchronizeRequisitionProgressModel = function synchronizeRequisitionProgressModel(obj) {
        var rpm = new RequisitionProgressModel();
        rpm.status = obj.status;
        requisitionProgressModel = rpm;
      };

      /**
       * Synchronize the requisition item list data model
       *
       * @param {object} obj - An object containing the following attributes:
       *  - uuid: the currently selected requisition item uuid (optional)
       */
      self.synchronizeRequisitionItemListModel = function synchronizeRequisitionItemListModel(obj) {
        var rilm = requisitionItemListModel.clone();
        rilm.requisitionMinimumDueDate = new Date(requisitionHeaderModel.requiredOn);
        // Loop over aggregates object array...
        _.forEach(requisitionItemAggregates, function iter(ria) {

          // find list item which corresponds to current aggregate
          var target = _.find(rilm.requisitionItems, function iterator(ri) { return ri.uuid === ria.uuid; });

          // If not found...
          if (_.isNil(target)) {
            // ... create it
            target = new RequisitionItemListEntry();

            // ... and add it to item list
            rilm.requisitionItems.push(target);
          }

          // Assign props
          target.id = ria.id;
          target.code = ria.code;
          target.statusDescription = ria.statusDescription;
          target.status = ria.status;
          if (_.isNil(ria.dueDate)) {
            target.dueDate = rilm.requisitionMinimumDueDate;
          } else {
            target.dueDate = new Date(ria.dueDate);
          }
          target.price = ria.price;
          target.type = ria.type;

          // Description must come from the backend (always), unless we're creating an all new item
          // from uncatalogued product. In the latter we must use complementaryDescription...
          if (ria.isUncataloguedProduct && _.isNil(ria.id)) {
            target.description = ria.complementaryDescription;
          } else {
            target.description = ria.description;
          }
          target.formatId = ria.formatId;
          target.formatDescription = ria.formatDescription;
          target.quantity = ria.quantity;
          target.quantityAwaiting = ria.quantityAwaiting;
          target.multiple = ria.multiple;
          target.distributionUnitQtyInAlert = ria.distributionUnitQtyInAlert;
          target.note = ria.note;
          target.uuid = ria.uuid;
          target.isUncataloguedProduct = ria.isUncataloguedProduct;
        });

        // Remove un-needed items
        var removed = _.remove(rilm.requisitionItems, function itemsIterator(ri) {
          var found = _.find(requisitionItemAggregates, function aggregatesIterator(ria) {
            return ri.uuid === ria.uuid;
          });
          return _.isNil(found);
        });

        // if a requisition uuid is provided, select corresponding requisition item, otherwise select first item in list
        if (!_.isNil(obj) && !_.isNil(obj.uuid)) {
          if (!_.some(removed, function iterator(ri) { return obj.uuid === ri.uuid; })) {
            rilm.requisitionItemUuid = obj.uuid;
          }
        }
        // Otherwise, if the currently selected item is being removed, select first item in list, if any
        //
        // TODO (bb): why do this only if an item is being removed, and not always...? comment condition for the moment
        else /*if (_.some(removed, function iterator(ri) { return ri.uuid === rilm.requisitionItemUuid; }))*/ {
          rilm.requisitionItemUuid = rilm.requisitionItems.length > 0 ? rilm.requisitionItems[0].uuid : undefined;
        }

        // Reassign model
        requisitionItemListModel = rilm;
      };

      /**
       * Synchronize one requisition item using given obj parameter.
       *
       * IMPORTANT: this targets and alters the in-memory RequisitionItemListEntry instance
       * corresponding to the given obj's uuid attribute in the requisition list model.
       *
       * @param {object} obj - The source object used to perform the synchronization
       */
      self.synchronizeOneRequisitionItem = function synchronizeOneRequisitionItem(obj, isPreserveQuantity) {
        var rilm = requisitionItemListModel;
        var target = _.find(rilm.requisitionItems, function iterator(ri) {
          return ri.uuid === obj.uuid;
        });

        var productInfo = obj.productInfo;
        if (!_.isNil(target)) {
          // if (_.isNil(target.id) || target.id === 0) {
          //   target.id = productInfo.id;
          // }
          target.code = productInfo.code;
          target.statusDescription = productInfo.statusDescription;
          target.status = productInfo.status;
          target.dueDate = new Date(productInfo.dueDate);
          target.price = productInfo.price;
          target.type = productInfo.type;
          target.description = productInfo.description;
          target.formatId = productInfo.formatId;
          target.formatDescription = productInfo.formatDescription;
          target.formatRelation = productInfo.formatRelation;
          if (!isPreserveQuantity) {
            target.quantity = productInfo.quantity;
          }
          target.quantityAwaiting = productInfo.quantityAwaiting;
          target.distributionUnitQtyInAlert = productInfo.distributionUnitQtyInAlert;
          target.note = productInfo.note;
          target.multiple = productInfo.multiple;
        }
      };

      /**
       * Initialize requisition item aggregates
       *
       * @param {array} requisitionItemAggregatesArr - The initial requisition item aggregate objects array
       */
      self.initializeRequisitionItemAggregates = function initializeRequisitionItemAggregates(requisitionItemAggregatesArr) {
        _.forEach(requisitionItemAggregatesArr, function iterator(ria) {

          // create new object instance
          var requisitionItemAggregate = RequisitionItemObjectService.copy(ria);

          // Assign it a uuid if needed
          requisitionItemAggregate.uuid = _.isNil(ria.uuid) ? uuid4.generate() : ria.uuid;

          // push in collection
          requisitionItemAggregates.push(requisitionItemAggregate);
        });
      };

      /**
       * Synchronize one RequisitionItemAggregate instance using a given ProductInfo instance.
       *
       * @param {object} obj - The source object used to synchronize the aggregate, using the following object structure:
       *  - obj.productInfo: the ProductInfo instance used to synchronize
       *  - obj.uuid: used to identify the targeted aggregate to synchronize
       */
      self.synchronizeRequisitionItemAggregateWithProductInfo = function synchronizeRequisitionItemAggregateWithProductInfo(obj) {
        var productInfo = obj.productInfo;
        var target = _.find(requisitionItemAggregates, function iterator(ria) { return ria.uuid === obj.uuid; });
        if (!_.isNil(target)) {

          // Assign all properties from given product info instance to target requisition item aggregate instance
          target = RequisitionItemObjectService.assign(target, productInfo);
        }
      };

      /**
       * Synchronize all requisition item aggregates instances using a given RequisitionItemListModel instance
       *
       * @param {RequisitionItemListModel} requisitionItemListModel - The source model used to synchronize
       *
       * @see {@link RequisitionItemListModel}
       */
      self.synchronizeRequisitionItemAggregatesFromRequisitionItemListModel = function synchronizeRequisitionItemAggregatesFromRequisitionItemListModel(requisitionItemListModel) {
        var result = {
          quantityGreaterThanAlertedQuantity: [],
          quantityGreaterThanPermittedQuantity: []
        };
        _.forEach(requisitionItemListModel.requisitionItems, function forEachIterator(ri) {
          var targetAggregate = _.find(requisitionItemAggregates, function findIterator(aggregate) {
            return aggregate.uuid === ri.uuid;
          });
          if (!_.isNil(targetAggregate)) {
            targetAggregate.quantity = ri.quantity;
            targetAggregate.dueDate = ri.dueDate;

            // Don't forget to update "special" quantities for an uncatalogued product...
            // TODO fabien: Check wether we must update those quantities or if we must take status into account...
            if (targetAggregate.isUncataloguedProduct) {
              targetAggregate.originalQty = targetAggregate.requestedQty = ri.quantity;
            }

            // If fixed assets requisition type
            if (DynamicLookupService.getRequisitionTypes()._1.code !== requisitionHeaderModel.type) {

              // Validate alerted quantity
              if (!validateAlertedQuantity(targetAggregate)) {
                result.quantityGreaterThanAlertedQuantity.push(targetAggregate.code);
              }
              else if (!validatePermittedQuantity(targetAggregate)) {
                result.quantityGreaterThanPermittedQuantity.push(targetAggregate.code);
              }
            }
          }
        });
        return result;
      };

      /**
       * Sychronize one requisition item aggregate instance using a given RequisitionItemTabsModel instance
       *
       * @param {RequisitionItemTabsModel} requisitionItemTabsModel - The source model used to synchronize
       *
       * @see {@link RequisitionItemTabsModel}
       */
      self.synchronizeRequisitionItemAggregateFromRequisitionItemTabsModel = function synchronizeRequisitionItemAggregateFromRequisitionItemTabsModel(requisitionItemTabsModel) {
        var result = {
          quantityGreaterThanAlertedQuantity: [],
          quantityGreaterThanPermittedQuantity: []
        };

        var targetAggregate = _.find(requisitionItemAggregates, function iterator(aggregate) {
          return aggregate.uuid === requisitionItemTabsModel.uuid;
        });
        if (!_.isNil(targetAggregate)) {

          // product information
          targetAggregate.vendor = requisitionItemTabsModel.vendor;
          targetAggregate.account = requisitionItemTabsModel.account;
          targetAggregate.projectActivity = requisitionItemTabsModel.projectActivity;
          targetAggregate.itemCode = requisitionItemTabsModel.itemCode;
          targetAggregate.buyer = requisitionItemTabsModel.buyer;
          targetAggregate.orderId = requisitionItemTabsModel.orderId;
          targetAggregate.store = requisitionItemTabsModel.store;
          targetAggregate.site = requisitionItemTabsModel.storeSite;
          targetAggregate.itemId = requisitionItemTabsModel.id;
          targetAggregate.description = requisitionItemTabsModel.description;
          targetAggregate.note = requisitionItemTabsModel.note;
          targetAggregate.isMsiProduct = requisitionItemTabsModel.isMsiProduct;
          targetAggregate.traceabilityStatus = requisitionItemTabsModel.traceabilityStatus;
          targetAggregate.distributionCenterId = requisitionItemTabsModel.distributionCenterId;
          targetAggregate.crossDockingId = requisitionItemTabsModel.crossDockingId;
          targetAggregate.isMultipleStore = requisitionItemTabsModel.isMultipleStore;
          targetAggregate.isMultipleFormat = requisitionItemTabsModel.isMultipleFormat;
          targetAggregate.isMultipleContract = requisitionItemTabsModel.isMultipleContract;
          targetAggregate.isMultipleCatalog = requisitionItemTabsModel.isMultipleCatalog;
          targetAggregate.code = requisitionItemTabsModel.code;

          // Quantities informations
          targetAggregate.currentFormatDescription = requisitionItemTabsModel.formatDescription;
          targetAggregate.currentPrice = requisitionItemTabsModel.price;
          targetAggregate.currentQuantity = requisitionItemTabsModel.quantity;
          targetAggregate.deliveredQuantity = requisitionItemTabsModel.deliveredQuantity;
          targetAggregate.initialFormatDescription = requisitionItemTabsModel.initialFormatDescription;
          targetAggregate.initialPrice = requisitionItemTabsModel.initialPrice;
          targetAggregate.initialQuantity = requisitionItemTabsModel.initialQuantity;
          targetAggregate.quantityAwaiting = requisitionItemTabsModel.quantityAwaiting;
          targetAggregate.quantityToReceive = requisitionItemTabsModel.quantityToReceive;

          // Purchase process
          targetAggregate.suggestedPurchaseProcess = requisitionItemTabsModel.suggestedPurchaseProcess;
          targetAggregate.usedPurchaseProcess = requisitionItemTabsModel.usedPurchaseProcess;
          targetAggregate.deviation = requisitionItemTabsModel.deviation;
          targetAggregate.cgrNumber = requisitionItemTabsModel.cgrNumber;

          // Fixed assets
          targetAggregate.acquisitionReason = requisitionItemTabsModel.acquisitionReason;
          targetAggregate.acquisitionType = requisitionItemTabsModel.acquisitionType;
          targetAggregate.modelNumber = requisitionItemTabsModel.modelNumber;

          // If fixed assets requisition type
          if (DynamicLookupService.getRequisitionTypes()._1.code !== requisitionHeaderModel.type) {

            // Validate alerted quantity
            if (!validateAlertedQuantity(targetAggregate)) {
              result.quantityGreaterThanAlertedQuantity.push(targetAggregate.code);
            }
            else if (!validatePermittedQuantity(targetAggregate)) {
              result.quantityGreaterThanPermittedQuantity.push(targetAggregate.code);
            }
          }
        }
        return result;
      };

      /**
       * Synchronize the requisition item tabs model
       *
       * @param {object} obj - An object exposing the following attributes:
       *  - uuid: the target requisition item aggregate uuid (facultative)
       */
      self.synchronizeRequisitionItemTabsModel = function synchronizeRequisitionItemTabsModel(obj) {
        var ritm = new RequisitionItemTabsModel();

        var targetUuid;
        if (obj && !_.isNil(obj.uuid)) {
          targetUuid = obj.uuid;
        }
        else if (requisitionItemAggregates.length > 0) {
          targetUuid = requisitionItemAggregates[0].uuid;
        }

        if (!_.isNil(targetUuid)) {
          var source = _.find(requisitionItemAggregates, function iterator(ria) { return ria.uuid === targetUuid; });
          if (!_.isNil(source)) {
            // global information
            ritm.productId = source.code;
            ritm.productType = source.type;
            ritm.requesterId = requisitionHeaderModel.requester.id;
            ritm.requisitionStatus = requisitionProgressModel.status;
            ritm.requisitionTypeCode = requisitionHeaderModel.type;
            ritm.uuid = source.uuid;

            // product information
            ritm.vendor = source.vendor;
            ritm.account = source.account;
            ritm.projectActivity = source.projectActivity;
            ritm.itemCode = source.itemCode;
            ritm.buyer = source.buyer;
            ritm.orderId = source.orderId;
            ritm.store = source.store;
            ritm.itemId = source.id;
            ritm.headerDepartmentId = requisitionHeaderModel.department.id;
            ritm.headerSiteId = requisitionHeaderModel.site.id;
            ritm.storeSite = source.site;
            ritm.distributionUnitQtyInAlert = source.distributionUnitQtyInAlert;

            ritm.description = source.isUncataloguedProduct ? source.complementaryDescription : source.description;
            ritm.note = source.note;
            ritm.isMsiProduct = source.isMsiProduct;
            ritm.traceabilityStatus = source.traceabilityStatus;
            ritm.distributionCenterId = source.distributionCenterId;
            ritm.crossDockingId = source.crossDockingId;
            ritm.isMultipleStore = source.isMultipleStore;
            ritm.isMultipleFormat = source.isMultipleFormat;
            ritm.isMultipleContract = source.isMultipleContract;
            ritm.isMultipleCatalog = source.isMultipleCatalog;
            ritm.isUncataloguedProduct = source.isUncataloguedProduct;
            ritm.code = source.code;

            // Quantities informations
            ritm.currentFormatDescription = source.formatDescription;
            ritm.currentPrice = source.price;
            ritm.currentQuantity = source.quantity;
            ritm.deliveredQuantity = source.deliveredQuantity;
            ritm.initialFormatDescription = source.initialFormatDescription;
            ritm.initialPrice = source.initialPrice;
            ritm.initialQuantity = source.initialQuantity;
            ritm.quantityAwaiting = source.quantityAwaiting;
            ritm.quantityToReceive = source.quantityToReceive;
            ritm.multiple = source.multiple;

            // Purchase process
            var ppHasData = !_.isNil(source.suggestedPurchaseProcess) || !_.isNil(source.usedPurchaseProcess) || !_.isNil(source.deviation) || !_.isNil(source.cgrNumber);
            ritm.isPurchaseProcessActive = (requisitionHeaderModel.status > 1) && ppHasData && (InstitutionParameterService.getInstitutionParameters().isPurchaseProcessActive === true);//Si les procédés achats sont activé (date activation) et seulement lors de la complétion.
            ritm.suggestedPurchaseProcess = source.suggestedPurchaseProcess;
            ritm.usedPurchaseProcess = source.usedPurchaseProcess;
            ritm.deviation = source.deviation;
            ritm.cgrNumber = source.cgrNumber;

            // Fixed assets - TODO: review the following assignments
            var clearFixedAssetsValues = DynamicLookupService.getRequisitionTypes()._1.code === requisitionHeaderModel.type;
            ritm.acquisitionReason = clearFixedAssetsValues ? undefined : source.acquisitionReason;
            ritm.acquisitionType = clearFixedAssetsValues ? undefined : source.acquisitionType;
            ritm.originalAccount = clearFixedAssetsValues ? undefined : source.originalAccount;
            ritm.manufacturer = clearFixedAssetsValues ? undefined : source.manufacturer;
            ritm.modelNumber = clearFixedAssetsValues ? undefined : source.modelNumber;
          }
        }

        ritm.authorizations = (obj && obj.authorizations) || [];

        requisitionItemTabsModel = ritm;
      };

      /**
       * Compute the requisition uncatalogued product model based on current data context (requisition, current item)
       *
       */
      self.computeRequisitionUncataloguedProductModel = function computeRequisitionUncataloguedProductModel(isNewItem, uuid) {
        var model = new RequisitionUncataloguedProductModel();

        if (!_.isNil(requisitionHeaderModel)) {
          if (isNewItem) {
            // Since model is empty (new item), set some default values
            model.uuid = uuid4.generate();
            model.quantity = 1;
            model.cost = 0;
            model.statisticalUnit = InstitutionParameterService.getInstitutionParameters().defaultStatisticalUnit;
            model.distributionUnit = InstitutionParameterService.getInstitutionParameters().defaultDistributionUnit;
            model.taxScheme = InstitutionParameterService.getInstitutionParameters().defaultTaxScheme;
            model.isUncataloguedProduct = true;
          } else {

            var currentItemUuid = _.isNil(uuid) ? requisitionItemListModel.selectedRequisitionItem().uuid : uuid;
            var ria = _.find(requisitionItemAggregates, function iterator(ria) { return ria.uuid === currentItemUuid; });

            if (!_.isNil(ria)) {
              model.account = ria.originalAccount;
              model.buyer = ria.originalBuyer;
              model.cost = ria.originalPrice;
              model.description = ria.complementaryDescription;
              model.distributionUnit = ria.originalDistributionUnit;
              if (!_.isNil(model.distributionUnit) && _.isNil(model.distributionUnit.relation)) {
                model.distributionUnit.relation = ria.originalFormatRelationId;
              }
              model.id = ria.id;
              model.isUncataloguedProduct = ria.isUncataloguedProduct; // should always be true...
              model.productId = ria.productId;
              model.projectActivity = ria.originalProjectActivity;
              model.quantity = ria.originalQty;
              model.secondaryCode = ria.originalSecondaryCode;
              model.statisticalUnit = ria.statisticalUnit;
              model.taxScheme = ria.originalTaxUnit;
              model.unspscClassification = ria.originalUnspscClassification;
              model.segment = ria.originalSegment;
              model.family = ria.originalFamily;
              model.class = ria.originalClass;
              model.uuid = ria.uuid;

              //Information entered by the buyer
              model.buyerNote = ria.buyerNote;
              model.buyerComplementaryDescription = ria.buyerComplementaryDescription;

              model.notifyBuyerToCreateProduct = ria.notifyBuyerToCreateProduct;
              model.noteForBuyer = ria.noteForBuyer;
              model.vendor = ria.originalVendor;
              model.vendorItemCode = ria.originalVendorItemCode;
            }
          }
          requisitionUncataloguedProductModel = model;
        }
      };

      /**
       * Synchronize the requisition view model
       *
       * @param {object} obj - The source object used to synchronize the model
       */
      self.synchronizeRequisitionViewModel = function synchronizeRequisitionViewModel(obj) {
        var vm = new RequisitionViewModel();
        vm.requisitionLabel = _.isNil(obj.requisitionId) ? translator(newRequisitionLabel) : obj.requisitionId;
        vm.uncataloguedProductSavedValues = obj.uncataloguedProductSavedValues;
        requisitionViewModel = vm;
      };

      self.getRequisitionObject = function getRequisitionObject() {
        var obj = RequisitionObjectService.newInstance();

        obj.address = requisitionHeaderModel.address;
        obj.completedBy = requisitionHeaderModel.completedBy;
        // obj.completedOn = requisitionHeaderModel.completedOn; // omit
        obj.client = requisitionHeaderModel.client;
        obj.createdOn = requisitionHeaderModel.createdOn;
        obj.deliveryLocation = requisitionHeaderModel.deliveryLocation;
        obj.department = requisitionHeaderModel.department;
        obj.id = requisitionHeaderModel.id;
        obj.installationSite = requisitionHeaderModel.installationSite;
        obj.interface = requisitionHeaderModel.interface;
        obj.modifiedBy = requisitionHeaderModel.modifiedBy;
        obj.modifiedByUsername = requisitionHeaderModel.modifiedByUsername;
        obj.modifiedOn = requisitionHeaderModel.modifiedOn;
        obj.originStatusCode = requisitionHeaderModel.originStatusCode;
        obj.repetitiveContractNumber = requisitionHeaderModel.repetitiveContractNumber;
        obj.requester = requisitionHeaderModel.requester;
        obj.requesterNote = requisitionHeaderModel.requesterNote;
        obj.phoneExtension = requisitionHeaderModel.phoneExtension;
        obj.requiredOn = requisitionHeaderModel.requiredOn;
        obj.requisitionTemplate = requisitionHeaderModel.requisitionTemplate;
        obj.site = requisitionHeaderModel.site;
        obj.splitOnUniqueOrder = requisitionHeaderModel.splitOnUniqueOrder;
        obj.status = requisitionHeaderModel.status;
        obj.type = requisitionHeaderModel.type;
        obj.wmsLastShipmentDate = requisitionHeaderModel.wmsLastShipmentDate;
        obj.wmsLocked = requisitionHeaderModel.wmsLocked;

        _.forEach(requisitionItemAggregates, function iterator(ria) {
          // Requires a code or an uncatalogued product
          if (!_.isNil(ria.code) || ria.isUncataloguedProduct) {
            obj.requisitionItems.push(ria);
          }
        });

        return obj;
      };

      self.getRequisitionItemAggregate = function getRequisitionItemAggregate(uuid) {
        return _.find(requisitionItemAggregates, function iterator(ria) {
          return ria.uuid === uuid;
        });
      };

      //
      // Global view
      //
      self.getRequisitionViewModel = function getRequisitionViewModel() {
        return requisitionViewModel;
      };

      //
      // Header
      //
      self.getRequisitionHeaderModel = function getRequisitionHeaderModel() {
        return requisitionHeaderModel;
      };

      /**
       * Preset some values in the requisition header model instance. This is the quick entry header use case.
       *
       * @param {object} obj - An object exposing the properties to assign
       */
      self.presetRequisitionHeaderModel = function presetRequisitionHeaderModel(obj) {
        var aModel = requisitionHeaderModel.clone();

        // Empty client whenever department changes
        if (requisitionHeaderModel.department !== obj.department) {
          aModel.client = null;
        }

        aModel.address = obj.address;
        aModel.deliveryLocation = obj.deliveryLocation;
        aModel.department = obj.department;
        aModel.phoneExtension = obj.requester.phoneExtension;
        aModel.requester = obj.requester;
        aModel.site = obj.site;
        aModel.splitOnUniqueOrder = obj.splitOnUniqueOrder;

        requisitionHeaderModel = aModel;
      };

      //
      // Progress
      //
      self.getRequisitionProgressModel = function getRequisitionProgressModel() {
        return requisitionProgressModel;
      };

      //
      // Item list
      //
      self.getRequisitionItemListModel = function getRequisitionItemListModel() {
        return requisitionItemListModel;
      };

      // Get all id's of a product list
      self.getRequisitionItemsIds = function getRequisitionItemsIds() {
        var result = [];
        _.forEach(requisitionItemAggregates, function iterator(ria) {
          result.push(ria.productId);
        });

        return result;
      };

      self.synchronizeSelectedRequisitionItem = function synchronizeSelectedRequisitionItem(obj) {
        var rilm = requisitionItemListModel.clone();
        rilm.requisitionItemUuid = obj.requisitionItemUuid;
        requisitionItemListModel = rilm;

        self.synchronizeRequisitionItemTabsModel({
          uuid: obj.requisitionItemUuid,
          authorizations: obj.authorizations
        });
      };

      /**
       * Add a new/empty requisition item to the current requisition object. This generates
       * a new RequisitionItem instance in the requisitionItemAggregates collection.
       */
      self.addRequisitionItem = function addRequisitionItem() {
        var requisitionItemAggregate = RequisitionItemObjectService.newInstance();

        // Generate a uuid
        var uuid = uuid4.generate();

        // Assign uuid
        requisitionItemAggregate.uuid = uuid;

        requisitionItemAggregates.push(requisitionItemAggregate);

        // Sync item list model
        self.synchronizeRequisitionItemListModel({
          uuid: uuid
        });

        // Sync tabs model
        self.synchronizeRequisitionItemTabsModel({
          uuid: uuid
        });
      };

      /**
       * Add the given requisition items to the current requisition object.
       *
       * @param {array} productInfos - An array of ProductInfo instances
       *
       * @see {@link ProductInfo}
       */
      self.addRequisitionItems = function addRequisitionItems(productInfos) {

        var dueDate = requisitionHeaderModel.requiredOn || new Date();
        var status = _.isNil(requisitionHeaderModel.status) ? '1' : String(requisitionHeaderModel.status);
        var statusDescription = DynamicLookupService.getRequisitionItemStatuses().getDescriptionByCode(status);

        // Clone model
        var model = requisitionItemListModel.clone();

        _.forEach(productInfos, function iterator(productInfo) {
          // Check if product already exists
          var exists = _.some(requisitionItemAggregates, function (ria) {
            return ria.productId === productInfo.productId;
          });

          //Add product if it does not already exist
          if (!exists) {
            productInfo.dueDate = dueDate;
            productInfo.status = status;
            productInfo.statusDescription = statusDescription;

            var requisitionItemAggregate = RequisitionItemObjectService.newInstance();

            // Assign uuid
            requisitionItemAggregate.uuid = uuid4.generate();

            requisitionItemAggregates.push(requisitionItemAggregate);

            // Sync requisition item aggregate
            self.synchronizeRequisitionItemAggregateWithProductInfo({
              productInfo: productInfo,
              uuid: requisitionItemAggregate.uuid
            });
          }
        });

        var lastAggregate = requisitionItemAggregates[requisitionItemAggregates.length - 1];
        if (!_.isNil(lastAggregate)) {
          self.synchronizeRequisitionItemListModel({
            uuid: lastAggregate.uuid
          });
          self.synchronizeRequisitionItemTabsModel({
            uuid: lastAggregate.uuid
          });
        }
      };

      self.removeRequisitionItem = function removeRequisitionItem(uuidToRemove) {

        // Filter out targeted element - this yields to
        // a new collection of requisition item aggregates.
        // As well, calculate the next element to be selected
        var indexOfNextItemToSelect = 0;
        requisitionItemAggregates =
          _.filter(requisitionItemAggregates, function filter(ria) {
              if (ria.uuid !== uuidToRemove) {
                ++indexOfNextItemToSelect;
                return true;
              }
              --indexOfNextItemToSelect;
              return false;
            }
          );

        var targetUuid = uuidToRemove;
        var rilm = requisitionItemListModel;

        // If resulting aggregate list is not empty...
        if (requisitionItemAggregates.length > 0) {
          // If currently selected item is the item to be removed, select the one after if any
          if (rilm.requisitionItemUuid === uuidToRemove) {
            targetUuid = requisitionItemAggregates[indexOfNextItemToSelect].uuid;
          // Otherwize, keep selection on the same current item
          } else {
            targetUuid = rilm.requisitionItemUuid;
          }
        }
        else {
          // No more requistion items in list, clear selected item uuid
          targetUuid = undefined;
        }

        self.synchronizeRequisitionItemListModel({ uuid: targetUuid });
        self.synchronizeRequisitionItemTabsModel({ uuid: targetUuid });
      };

      self.assignProductInfo = function assignProductInfo(params, isPreserveQuantity) {

        // Assign some additional product info attributes
        var product = params.product;
        // TODO GRMWEB-1373: Warning, make sure dueDate is always null in that situation, otherwise,
        // it will be kept as-is because of this condition...
        if (_.isNil(product.dueDate)) {
          product.dueDate = new Date(requisitionHeaderModel.requiredOn) || new Date();
        }
        product.status = _.isNil(requisitionHeaderModel.status) ? '1' : String(requisitionHeaderModel.status);
        product.statusDescription = DynamicLookupService.getRequisitionItemStatuses().getDescriptionByCode(product.status);

        // Sync requisition item aggregate
        self.synchronizeRequisitionItemAggregateWithProductInfo({
          productInfo: product,
          uuid: params.requisitionItemUuid
        });

        self.synchronizeOneRequisitionItem({
          productInfo: product,
          uuid: params.requisitionItemUuid
        }, isPreserveQuantity);

        // Sync tabs model
        self.synchronizeRequisitionItemTabsModel({
          uuid: params.requisitionItemUuid
        });
      };

      self.assignUncataloguedProduct = function assignUncataloguedProduct(uncataloguedProductModel, isNewItem) {

        // If it's a new item, add it to the internal aggregates main collection
        if (isNewItem) {
          // create/add one requisition item aggregate
          var requisitionItemAggregate = RequisitionItemObjectService.newInstance();

          // Assign uuid - assuming given model has a uuid attribute
          requisitionItemAggregate.uuid = uncataloguedProductModel.uuid;

          // push to collection
          requisitionItemAggregates.push(requisitionItemAggregate);
        }

        // synchronize the new aggregate with given model
        self.synchronizeRequisitionItemAggregateWithUncataloguedProduct(uncataloguedProductModel, isNewItem);

        // Sync item list model
        self.synchronizeRequisitionItemListModel({
          uuid: uncataloguedProductModel.uuid
        });

        // Sync tabs model
        self.synchronizeRequisitionItemTabsModel({
          uuid: uncataloguedProductModel.uuid
        });
      };

      self.clearProductInfo = function clearProductInfo(params) {
        // Clone model
        var rilm = requisitionItemListModel.clone();

        var requisitionItem = _.find(rilm.requisitionItems, function finder(item) { return item.uuid === params.requisitionItemUuid; });
        if (!_.isNil(requisitionItem)) {
          requisitionItem.reset();
        }

        requisitionItemListModel = rilm;
      };

      self.selectPreviousItem = function selectPreviousItem() {
        var targetItem;
        var currentItem = requisitionItemListModel.selectedRequisitionItem();
        if (!_.isNil(currentItem)) {
          var index = requisitionItemListModel.requisitionItems.indexOf(currentItem);
          if (index > 0) {
            targetItem = requisitionItemListModel.requisitionItems[index - 1];
            var rilm = requisitionItemListModel.clone();
            rilm.requisitionItemUuid = targetItem.uuid;
            requisitionItemListModel = rilm;
          }
        }
        return targetItem; // target may be undefined
      };

      self.selectNextItem = function selectNextItem() {
        var targetItem;
        var currentItem = requisitionItemListModel.selectedRequisitionItem();
        if (!_.isNil(currentItem)) {
          var index = requisitionItemListModel.requisitionItems.indexOf(currentItem);
          if (index < requisitionItemListModel.requisitionItems.length - 1) {
            targetItem = requisitionItemListModel.requisitionItems[index + 1];
            var rilm = requisitionItemListModel.clone();
            rilm.requisitionItemUuid = targetItem.uuid;
            requisitionItemListModel = rilm;
          }
        }
        return targetItem; // target may be undefined
      };

      //
      // Tabs
      //
      self.getRequisitionItemTabsModel = function getRequisitionItemTabsModel() {
        return requisitionItemTabsModel;
      };

      self.synchronizeRequisitionItemTabsModelAuthorizations = function synchronizeRequisitionItemTabsModelAuthorizations(authorizations) {

      };

      //
      // Uncatalogued product
      //
      self.getRequisitionUncataloguedProductModel = function getRequisitionUncataloguedProductModel() {
        return requisitionUncataloguedProductModel;
      };

      self.synchronizeRequisitionItemAggregateWithUncataloguedProduct = function synchronizeRequisitionItemAggregateWithUncataloguedProduct(uncataloguedProductModel, isNewItem) {
        var target = _.find(requisitionItemAggregates, function iterator(ria) { return ria.uuid === uncataloguedProductModel.uuid; });
        if (!_.isNil(target)) {
          target.buyer = target.originalBuyer = uncataloguedProductModel.buyer;
          target.complementaryDescription = target.description = uncataloguedProductModel.description;
          target.distributionUnit = target.originalDistributionUnit = uncataloguedProductModel.distributionUnit;
          target.noteForBuyer = uncataloguedProductModel.noteForBuyer;
          target.originalVendor = uncataloguedProductModel.vendor;
          target.originalVendorItemCode = uncataloguedProductModel.vendorItemCode;
          target.isUncataloguedProduct = true;
          target.originalAccount = uncataloguedProductModel.account;
          target.originalFormatRelationId = uncataloguedProductModel.distributionUnit.relation;
          target.originalProductId = 0;
          target.originalUnspscClassification = uncataloguedProductModel.unspscClassification;
          target.originalSegment = uncataloguedProductModel.segment;
          target.originalFamily = uncataloguedProductModel.family;
          target.originalClass = uncataloguedProductModel.class;
          target.projectActivity = target.originalProjectActivity = uncataloguedProductModel.projectActivity;
          target.secondaryCode = target.originalSecondaryCode = uncataloguedProductModel.secondaryCode;
          target.originalTaxUnit = uncataloguedProductModel.taxScheme;
          target.price = target.originalPrice = uncataloguedProductModel.cost;
          target.productId = uncataloguedProductModel.productId;
          target.quantity = target.originalQty = target.requestedQty = uncataloguedProductModel.quantity;
          target.statisticalUnit = uncataloguedProductModel.statisticalUnit;
          target.uuid = uncataloguedProductModel.uuid;

          // Pair values necessary to a requisition item that are not explicitly in the Uncatalogued Product model
          target.formatRelation = uncataloguedProductModel.distributionUnit.relation;
          target.formatCode = uncataloguedProductModel.distributionUnit.code;
          target.formatDescription = uncataloguedProductModel.distributionUnit.description;
          target.formatId = uncataloguedProductModel.distributionUnit.id;
          target.notifyBuyerToCreateProduct = uncataloguedProductModel.notifyBuyerToCreateProduct;

          //Those values will be set/initialized only when non catalogues item is created, never when modified.
          if (isNewItem) {
            var status = _.isNil(requisitionHeaderModel.status) || requisitionHeaderModel.status === 1 ? '1' : '2A';
            var statusDescription = DynamicLookupService.getRequisitionItemStatuses().getDescriptionByCode(status);
            target.quantityToReceive = target.quantity;
            target.dueDate = new Date(requisitionHeaderModel.requiredOn);
            target.id = 0;
            target.productId = 0;
            target.requisitionId = requisitionHeaderModel.id;
            target.catalogId = -1;
            target.code = null;
            target.type = 'D'; // Direct Purchase
            // Now, inject null values for properties that have nothing to see with uncatalogued product
            // but that are necessary for the backend to deserialize requisitionItem payload...
            //
            // Those values should be initialized with kind of a getDefaultRequisitionItemFromFactory
            // that would return an empty object but with some default values necessary for the backend
            // but about which THIS model doesn't care much...
            target.account = null;
            target.buyerName = null;
            target.catalogId = null;
            target.cgrNumber = null;
            target.contractItemId = null;
            target.crossDockingId = null;
            target.daysLate = null;
            target.deliveredQuantity = 0;
            target.deliveryDate = null;
            target.deviation = null;
            target.distributionCenterId = null;
            target.distributionUnitQtyInAlert = null;
            target.initialFormatDescription = '';
            target.isMsiProduct = false;
            target.isMultipleCatalog = false;
            target.isMultipleContract = false;
            target.isMultipleFormat = false;
            target.isMultipleStore = false;
            target.itemCode = '';
            target.modelId = null;
            target.note = null;
            target.orderId = null;
            target.projectActivity = null;
            target.quantityAwaiting = 0;
            target.store = null;
            target.site = null;
            target.status = status;
            target.statusDescription = statusDescription;
            target.suggestedPurchaseProcess = null;
            target.traceabilityStatus = null;
            target.usedPurchaseProcess = null;
            target.vendor = null;
          }
        }
      };

      //
      // Authorizer management
      //
      self.getRequisitionAuthorizerManagementModel = function getRequisitionAuthorizerManagementModel() {
        return requisitionAuthorizerManagementModel;
      };

      // /////
      // Utils
      //

      // GRMWEB-1378: Valider qu'à la modification de la quantité, en présence d'un compte, l'utilisateur soit alerté
      // si la quantité en unité statistique dépasse la quantité en alerte de la catégorie du compte (option de menu 784).
      //
      // Validate alerted quantity for one aggregate
      function validateAlertedQuantity(aggregate) {
        if (!_.isNil(aggregate.account) && aggregate.account.alertQuantity) {
          if (aggregate.quantity * aggregate.formatRelation > aggregate.account.alertQuantity) {
            return false;
          }
        }
        else if (!_.isNil(aggregate.originalAccount) && aggregate.originalAccount.alertQuantity) {
          if (aggregate.quantity * aggregate.formatRelation > aggregate.originalAccount.alertQuantity) {
            return false;
          }
        }
        return true;
      }

      // GRMWEB-1378: Valider que la quantité en unité statistique ne dépasse pas le maximum permis (valeur dans l'option de menu 941 ou une
      // qté de 2000 si non défini). L'utilisateur doit être prévenu de la raison du refus de la quantité si elle dépasse le maximum permis.
      //
      // Validate permitted quantity for one aggregate
      function validatePermittedQuantity(aggregate) {
        if (aggregate.quantity * aggregate.formatRelation > InstitutionParameterService.getInstitutionParameters().maximumRequestedQuantityForFixedAsset) {
          return false;
        }
        return true;
      }

      return this;
    }
  }
)();
