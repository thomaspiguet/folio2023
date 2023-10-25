(
  function () {
    'use strict';

    angular
      .module('app.business-logic.requisition')
      .factory('RequisitionDisplayLogicManager', RequisitionDisplayLogicManager)
      ;

    /* @ngInject */
    function RequisitionDisplayLogicManager(
      $log,
      $mdSidenav,
      FormService,
      ApplicationActions,
      DynamicLookupService,
      InstitutionParameterService,
      InteractionModes,
      RequisitionActionBarStateModel,
      RequisitionHeaderActionsStateModel,
      RequisitionHeaderStateModel,
      RequisitionItemListStateModel,
      RequisitionItemTabsStateModel,
      RequisitionItemNavigatorStateModel,
      RequisitionUncataloguedProductStateModel,
      RequisitionAuthorizerManagementStateModel,
      RequisitionModelManager,
      RequisitionStateManager,
      SystemLookupService,
      UserProfileService
    ) {

      var self = this;
      var requisitionActionBarStateModel;
      var requisitionHeaderActionsStateModel;
      var requisitionHeaderStateModel;
      var requisitionItemListStateModel;
      var requisitionItemTabsStateModel;
      var requisitionItemNavigatorStateModel;
      var requisitionUncataloguedProductStateModel;
      var requisitionAuthorizerManagementStateModel;
      var modelManager = RequisitionModelManager;
      var stateManager = RequisitionStateManager;

      self.initialize = function initialize(configParams) {
        requisitionActionBarStateModel = new RequisitionActionBarStateModel();
        requisitionHeaderActionsStateModel = new RequisitionHeaderActionsStateModel();
        requisitionHeaderStateModel = new RequisitionHeaderStateModel();
        requisitionItemListStateModel = new RequisitionItemListStateModel();
        requisitionItemTabsStateModel = new RequisitionItemTabsStateModel();
        requisitionItemNavigatorStateModel = new RequisitionItemNavigatorStateModel();
        requisitionUncataloguedProductStateModel = new RequisitionUncataloguedProductStateModel();
        requisitionAuthorizerManagementStateModel = new RequisitionAuthorizerManagementStateModel();

        self.synchronize();
      };

      self.synchronize = function synchronize() {
        computeRequisitionActionBarStateModel();
        computeRequisitionHeaderActionsStateModel();
        computeRequisitionHeaderStateModel();
        computeRequisitionItemListStateModel();
        computeRequisitionItemTabsStateModel();
        computeRequisitionItemNavigatorStateModel();
        //computeRequisitionUncataloguedProductStateModel(); //Computed on demand, not always.
      };

      self.toggleRightPanel = function toggleRightPanel() {
        $mdSidenav('right-side-menu').toggle();
      };

      self.toggleRequisitionTemplate = function toggleRequisitionTemplate() {
        computeRequisitionHeaderActionsStateModel();
        requisitionHeaderStateModel.template.hidden = !requisitionHeaderStateModel.template.hidden;
      };

      // //////////////////////
      // Model getter functions
      self.getRequisitionHeaderActionsStateModel = function getRequisitionHeaderActionsStateModel() {
        return requisitionHeaderActionsStateModel;
      };

      self.getRequisitionHeaderStateModel = function getRequisitionHeaderStateModel() {
        return requisitionHeaderStateModel;
      };

      self.getRequisitionActionBarStateModel = function getRequisitionActionBarStateModel() {
        return requisitionActionBarStateModel;
      };

      self.getRequisitionUncataloguedProductStateModel = function getRequisitionUncataloguedProductStateModel(isNewItem) {
        computeRequisitionUncataloguedProductStateModel(isNewItem); //TODO: Compute on-demand, refactoring/reingeenring needed for uncatalogued display logic
        return requisitionUncataloguedProductStateModel;
      };

      self.getRequisitionAuthorizerManagementStateModel = function getRequisitionAuthorizerManagementStateModel() {
        return requisitionAuthorizerManagementStateModel;
      };

      self.getRequisitionItemNavigatorStateModel = function getRequisitionItemNavigatorStateModel() {
        return requisitionItemNavigatorStateModel;
      };

      self.getRequisitionItemListStateModel = function getRequisitionItemListStateModel() {
        return requisitionItemListStateModel;
      };

      self.getRequisitionItemTabsStateModel = function getRequisitionItemTabsStateModel() {
        return requisitionItemTabsStateModel;
      };

      // ///////////////////////
      // Model compute functions
      function computeRequisitionActionBarStateModel() {
        var aModel = new RequisitionActionBarStateModel();
        var mode = stateManager.getMode();
        var headerModel = modelManager.getRequisitionHeaderModel();

        // TODO implement correct conditions
        aModel.cancel.disabled = true;
        aModel.cancel.hidden = false;

        // complete action
        aModel.complete.disabled = !(!_.isNil(headerModel.department) &&
          !_.isNil(headerModel.address) &&
          !_.isNil(headerModel.site) &&
          !_.isNil(headerModel.requester) &&
          isClientValid() &&
          !(_.isNil(headerModel.deliveryLocation) && InstitutionParameterService.getInstitutionParameters().isDeliveryLocationMandatory) &&
          isRequisitionItemTabValid() &&
          headerModel.status === 1)
          ;
        // TODO implement correct condition
        aModel.complete.hidden = headerModel.status > 1;

        // delete action
        aModel.delete.disabled = !(!_.isNil(headerModel.id) && headerModel.status === 1);
        aModel.delete.hidden = !(!_.isNil(headerModel.id) && headerModel.status === 1);

        // save action
        aModel.save.disabled = !(!_.isNil(headerModel.department) &&
          !_.isNil(headerModel.address) &&
          !_.isNil(headerModel.site) &&
          !_.isNil(headerModel.requester) &&
          isClientValid() &&
          !(_.isNil(headerModel.deliveryLocation) && InstitutionParameterService.getInstitutionParameters().isDeliveryLocationMandatory) &&
          isRequisitionItemTabValid() &&
          FormService.isDirty())
        ;
        // TODO implement correct condition
        aModel.save.hidden = false;

        requisitionActionBarStateModel = aModel;
      }

      function computeRequisitionHeaderActionsStateModel() {
        var aModel = new RequisitionHeaderActionsStateModel();
        var mode = stateManager.getMode();
        var headerModel = modelManager.getRequisitionHeaderModel();
        var itemListModel = modelManager.getRequisitionItemListModel();

        function isAnyItemToAuthorize() {
          if (_.findIndex(itemListModel.requisitionItems, function(obj) {
            return obj.status === '2' /*To authorize*/ ||
                obj.status === '2F'   /*To authorize (technical)*/ ||
                obj.status === '2X';  /*Authorizer to determinate*/
          }) === -1) {
            return false;
          } else {
            return true;
          }
        }

        function isAnyItemWithAuthorizerToSet() {
          //2X = Authorizer to set
          if (_.findIndex(itemListModel.requisitionItems, function(obj) { return obj.status === '2X'; }) === -1) {
            return false;
          } else {
            return true;
          }
        }

        // TODO same logic for both new/edit modes? maybe this needs a review
        if (InteractionModes.New === mode || InteractionModes.Edit === mode) {
          // disable quick header entry action if there are any requisition items
          aModel.quickHeaderEntry.hidden = modelManager.getRequisitionItemListModel().requisitionItems.length > 0;
          //
          aModel.requisitionTemplate.disabled = _.isNil(headerModel.department) || _.isNil(headerModel.site) || _.isNil(headerModel.requester);
          if (InteractionModes.Edit === mode) {
            aModel.requisitionTemplate.disabled = _.isNil(headerModel.requisitionTemplate);
            aModel.requisitionTemplate.hidden = _.isNil(headerModel.requisitionTemplate);
            var userProfile = UserProfileService.getCurrentProfile();
            aModel.moreActions.manageAuthorizers.add.hidden = !isAnyItemWithAuthorizerToSet() ||
                 (userProfile.settings.requisitionSpecific.requisitionManagementScopeId !== 3 && //Illimited management scope
                 !userProfile.permissions.requisitionSpecific.canAlterAuthorizerList);
            aModel.moreActions.manageAuthorizers.replace.hidden = !isAnyItemToAuthorize() ||
                 (userProfile.settings.requisitionSpecific.requisitionManagementScopeId !== 3 && //Illimited management scope
                 !userProfile.permissions.requisitionSpecific.canAlterAuthorizerList);
          } else {
            aModel.moreActions.manageAuthorizers.add.hidden = true;
            aModel.moreActions.manageAuthorizers.replace.hidden = true;
          }
          //If all sub actions are hidden, hide "moreActions". (GRMWEB-1505)
          aModel.moreActions.hidden = aModel.moreActions.manageAuthorizers.add.hidden && aModel.moreActions.manageAuthorizers.replace.hidden;
        }
        else {
          // TODO: raise error?
          $log.warn('Unknown InteractionMode [' + mode + ']');
        }

        requisitionHeaderActionsStateModel = aModel;
      }

      function computeRequisitionHeaderStateModel() {
        var aModel = new RequisitionHeaderStateModel();
        var mode = stateManager.getMode();
        var headerModel = modelManager.getRequisitionHeaderModel();
        var itemListModel = modelManager.getRequisitionItemListModel();

        // TODO same logic for both new/edit modes? maybe this needs a review
        if (InteractionModes.New === mode || InteractionModes.Edit === mode) {
          // disable template control if there are any requisition items
          aModel.template.disabled = /*!_.isNil(headerModel.requisitionTemplate) ||*/
            itemListModel.requisitionItems.length > 0 ||
            _.isNil(headerModel.department) ||
            _.isNil(headerModel.site) ||
            _.isNil(headerModel.requester)
          ;
          aModel.template.hidden = requisitionHeaderStateModel.template.hidden;
          if (_.isNil(headerModel.department) || _.isNil(headerModel.site) || _.isNil(headerModel.requester)) {
            aModel.template.hidden = true;
          }
          aModel.department.disabled = itemListModel.requisitionItems.length > 0;
          aModel.deliveryLocation.disabled = aModel.createDeliveryLocation.hidden = _.isNil(headerModel.department) ||
            itemListModel.requisitionItems.length > 0;
          aModel.deliveryLocation.required = InstitutionParameterService.getInstitutionParameters().isDeliveryLocationMandatory;
          aModel.site.disabled = _.isNil(headerModel.department) || itemListModel.requisitionItems.length > 0;
          aModel.address.disabled = _.isNil(headerModel.site) || itemListModel.requisitionItems.length > 0;
          aModel.requester.disabled = _.isNil(headerModel.department) || itemListModel.requisitionItems.length > 0;
          aModel.phone.hidden = _.isNil(headerModel.requester);

          // Client selection
          aModel.client.disabled = _.isNil(headerModel.department) ||
            !headerModel.department.isExternalSales ||
            !UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canDoExternalSaleRequisition ||
            headerModel.status > 1 ||
            itemListModel.requisitionItems.length > 0
          ;

          // Override when edit mode
          if (InteractionModes.Edit === mode) {
            aModel.template.disabled = true;
            aModel.template.hidden = _.isNil(headerModel.requisitionTemplate);
            aModel.address.disabled = true;
            aModel.deliveryLocation.disabled =
              aModel.deliveryLocation.disabled ||
              (UserProfileService.getCurrentProfile().settings.requisitionSpecific.requisitionManagementScopeId === 1 &&
              !_.isNil(headerModel.deliveryLocation)) ||
              headerModel.status === 0 || headerModel.status >= 6
            ;

            // TODO: manage correctly
            aModel.createDeliveryLocation.hidden = true;

            aModel.phone.disabled = headerModel.status === 0 || headerModel.status >= 6;
            aModel.requiredOn.disabled = headerModel.status === 0 || headerModel.status >= 3;
            // aModel.type.disabled = headerModel.status === 0 || headerModel.status >= 3;
            aModel.splitOnUniqueOrder.disabled = headerModel.status === 0 || headerModel.status >= 3;
            aModel.weeklyConsommationDisplayed.disabled = headerModel.status === 0 || headerModel.status >= 3;
          }

          // If client is enabled, it is required as well
          aModel.client.required = !aModel.client.disabled;

          // Compute requisition type field status
          aModel.type.disabled = computeRequisitionHeaderTypeDisabledStatus();

          // Hide installation site if requisition type is "regular"
          aModel.installationSite.hidden = DynamicLookupService.getRequisitionTypes()._1.code === headerModel.type;
          // Disable installation site as long as department remains undefined or if there are product lines on requisition
          aModel.installationSite.disabled = _.isNil(headerModel.department) || headerModel.status === 0 || headerModel.status >= 5;
        }
        else {
          // TODO: raise error?
          $log.warn('Unknown InteractionMode [' + mode + ']');
        }

        requisitionHeaderStateModel = aModel;
      }

      function computeRequisitionItemListStateModel() {
        var headerModel = modelManager.getRequisitionHeaderModel();
        var itemListModel = modelManager.getRequisitionItemListModel();
        var progressModel = modelManager.getRequisitionProgressModel();
        var aModel = new RequisitionItemListStateModel();
        var mode = stateManager.getMode();

        _.forEach(itemListModel.requisitionItems, function iterator(ri) {

          // These have to be dynamically generated/computed as the list is not fixed
          var requisitionItemStateModel = {
            delete: { disabled: false, hidden: false },
            code: {
              disabled: false,
              hidden: false,
              required: true,
              validations: {
                alreadyEntered: 'validations.productCodeAlreadyEntered'
              }
            },
            quantity: { disabled: false, hidden: false, required: true },
            stats: { hidden: false},
            subTotal: {  hidden: false},
            status: { hidden: false},
            dueDate: {
              disabled: false,
              hidden: false,
              required: true,
              validations: {
                mindate: 'validations.requisition.minDate',
                valid: 'validations.invalidDate'
              }
            }
          };

          if (InteractionModes.New === mode || InteractionModes.Edit === mode) {

            // requisitionItemStateModel.code.disabled = (ApplicationActions.searching === stateManager.getCurrentState());
            requisitionItemStateModel.quantity.hidden =
                requisitionItemStateModel.stats.hidden =
                    requisitionItemStateModel.subTotal.hidden =
                        requisitionItemStateModel.status.hidden =
                            requisitionItemStateModel.dueDate.hidden = !ri.type;

            if (InteractionModes.Edit === mode) {
              var lowestStatus = ri.status.replace(/\D/g,'');//Ex: 2A = 2
              requisitionItemStateModel.code.disabled = requisitionItemStateModel.code.disabled || ri.isUncataloguedProduct || (ri.id !== 0 && !_.isNil(ri.id));
              requisitionItemStateModel.delete.hidden = !(ri.id === 0 || _.isNil(ri.id) || (progressModel.status < 3 && lowestStatus < '3' && lowestStatus > '0'));
              requisitionItemStateModel.quantity.disabled = !isQuantityEditable(ri);
              requisitionItemStateModel.dueDate.disabled = !canChangeProductDueDate(ri.status);
            } else {
              requisitionItemStateModel.code.disabled = ri.isUncataloguedProduct;
            }
          }
          aModel.requisitionItemStates.push(requisitionItemStateModel);
        });

        // aModel.addAction = {
        //   disabled: ApplicationActions.searching === stateManager.getCurrentState(),
        //   hidden: !(!_.isNil(headerModel.department) &&
        //     !_.isNil(headerModel.address) &&
        //     !_.isNil(headerModel.site) &&
        //     !_.isNil(headerModel.requester) &&
        //     isClientValid() &&
        //     !(_.isNil(headerModel.deliveryLocation) && InstitutionParameterService.getInstitutionParameters().isDeliveryLocationMandatory) &&
        //     headerModel.status <= 2)
        // };
        aModel.addAction.hidden =
          !(!_.isNil(headerModel.department) &&
            !_.isNil(headerModel.address) &&
            !_.isNil(headerModel.site) &&
            !_.isNil(headerModel.requester) &&
            isClientValid() &&
            !(_.isNil(headerModel.deliveryLocation) && InstitutionParameterService.getInstitutionParameters().isDeliveryLocationMandatory) &&
            headerModel.status <= 2)
        ;

        var productTypeUsageId = UserProfileService.getCurrentProfile().settings.requisitionSpecific.productTypeUsageId;
        var canCreateUncataloguedProduct = productTypeUsageId === SystemLookupService.productTypeUsages.uncataloguedId ||
          productTypeUsageId === SystemLookupService.productTypeUsages.templatedAndUncataloguedId;

        // Here, disable uncatalogued product whenever we're on an external sale requisition...
        canCreateUncataloguedProduct = canCreateUncataloguedProduct && _.isNil(headerModel.client) && isClientValid();

        aModel.addUncataloguedProductAction = {
          disabled: !canCreateUncataloguedProduct,
          hidden: false
        };

        requisitionItemListStateModel = aModel;
      }

      function computeRequisitionItemNavigatorStateModel() {
        var aModel = new RequisitionItemNavigatorStateModel();

        var itemListModel = modelManager.getRequisitionItemListModel();
        if (itemListModel.requisitionItems.length > 0) {
          if (itemListModel.requisitionItemUuid === itemListModel.requisitionItems[0].uuid) {
            aModel.previous.disabled = true;
          }
          if (itemListModel.requisitionItemUuid === itemListModel.requisitionItems[itemListModel.requisitionItems.length - 1].uuid) {
            aModel.next.disabled = true;
          }
        }

        requisitionItemNavigatorStateModel = aModel;
      }

      function computeRequisitionItemTabsStateModel() {
        var aModel = new RequisitionItemTabsStateModel();
        var itemListModel = modelManager.getRequisitionItemListModel();
        var headerModel = modelManager.getRequisitionHeaderModel();
        var tabsModel = modelManager.getRequisitionItemTabsModel();
        var mode = stateManager.getMode();

        if (InteractionModes.New === mode || InteractionModes.Edit === mode) {
          var selectedRequisitionItem = itemListModel.selectedRequisitionItem();
          aModel.store.disabled = true;

          if (!_.isNil(selectedRequisitionItem)) {

            // Setup tabs visiblity
            aModel.tabs.product.hidden = false;
            aModel.tabs.quantities.hidden = false === tabsModel.requisitionStatus > 1;
            aModel.tabs.purchaseProcess.hidden = false === tabsModel.isPurchaseProcessActive;
            aModel.tabs.fixedAssets.hidden = DynamicLookupService.getRequisitionTypes()._1.code === headerModel.type;
            aModel.tabs.authorizations.hidden = false === tabsModel.requisitionStatus > 1;

            aModel.account.required = true;
            aModel.account.disabled = selectedRequisitionItem.type === 'I';

            // Disable account and note for uncatalogued products
            if (selectedRequisitionItem.isUncataloguedProduct) {
              // aModel.account.required = false;
              aModel.account.disabled = true;
              aModel.note.disabled = true;
            }
            else if (InteractionModes.Edit === mode) {
              var requisitionCancelledOrProcessed = headerModel.status === 0 || headerModel.status >= 3;
              aModel.account.disabled = aModel.account.disabled || requisitionCancelledOrProcessed;
              aModel.note.disabled = requisitionCancelledOrProcessed;
            }

            // Setup store availability
            if (UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canModifyItemStore) {
              // Exclude uncatalogued products
              if (!selectedRequisitionItem.isUncataloguedProduct) {
                if (isProductStatusEditable(selectedRequisitionItem) &&
                  headerModel.department.primaryCode !== '0' &&
                  selectedRequisitionItem.type === 'I') {
                  aModel.store.disabled = false;
                  aModel.store.required = selectedRequisitionItem.type === 'I';
                }
              }
            }

            // GRMWEB-1378
            // Valider que le type d'acquisition, la raison d'acquisition et le no de modèle ne sont pas modifiables
            // si un des articles d'immobilisation relié à la ligne de réquisition est immobilisé dans GRF
            var aggregate = modelManager.getRequisitionItemAggregate(selectedRequisitionItem.uuid);
            if (aggregate) {
              aModel.acquisitionType.disabled =
                aModel.acquisitionReason.disabled =
                aModel.modelNumber.disabled = aggregate.isImmobilizedProduct;
            }
          }
        }
        else {
          aModel.account.disabled = true;
          aModel.note.disabled = true;
          aModel.store.disabled = true;
        }

        requisitionItemTabsStateModel = aModel;
      }

      function computeRequisitionUncataloguedProductStateModel(isNewItem) {
        var stateModel = new RequisitionUncataloguedProductStateModel();
        var ncUserSettings = UserProfileService.getCurrentProfile().settings.requisitionSpecific.nonCataloguedSpecific;
        var mode = stateManager.getMode();

        // ...State model property structure...
        // stateModel.myProperty: {
        //   disabled: false,
        //   hidden: false,
        //   required: false
        // },

        // Manage readonly mode (all fields disabled)
        if (InteractionModes.ReadOnly === mode) {
          stateModel.isUpdateable = false;
          stateModel.interactionMode = InteractionModes.ReadOnly;
          stateModel.notifyBuyerToCreateProduct.disabled = true;
          stateModel.noteForBuyer.disabled = true;
          stateModel.productId.disabled = true;
          stateModel.projectActivity.disabled = true;
          stateModel.secondaryCode.disabled = true;
          stateModel.vendor.disabled = true;
          stateModel.vendorItemCode.disabled = true;
          stateModel.unspscClassification.disabled = true;
          stateModel.description.disabled = true;
          stateModel.quantity.disabled = true;
          stateModel.cost.disabled = true;
          stateModel.taxScheme.disabled = true;
          stateModel.buyer.disabled = true;
          stateModel.account.disabled = true;
          stateModel.statisticalUnit.disabled = true;
          stateModel.statisticalUnit.required = false;
          stateModel.distributionUnit.disabled = true;
          stateModel.distributionUnit.required = false;
          stateModel.classification.segment.disabled = true;
          stateModel.classification.segment.required = false;
          stateModel.classification.family.disabled = true;
          stateModel.classification.family.required = false;
          stateModel.classification.class.disabled = true;
          stateModel.classification.class.required = false;
        } else {
          var isUpdateable = isUncataloguedProductUpdateable(isNewItem);
          stateModel.isUpdateable = isUpdateable;
          stateModel.interactionMode = computeNonCataloguedInteractionMode(isNewItem, isUpdateable);
          stateModel.description.required = true; // at least one character
          stateModel.quantity.required = true;
          stateModel.cost.required = true;
          stateModel.taxScheme.required = true;
          stateModel.buyer.required = ncUserSettings.isBuyerMandatory;
          stateModel.account.required = DynamicLookupService.getRequisitionTypes()._1.code !== modelManager.getRequisitionHeaderModel().type ? true : ncUserSettings.isAccountMandatory;
          stateModel.statisticalUnit.required = ncUserSettings.isFormatDisplayed;
          stateModel.statisticalUnit.hidden = !ncUserSettings.isFormatDisplayed;
          stateModel.distributionUnit.hidden = !ncUserSettings.isFormatDisplayed;
          stateModel.distributionUnit.required = ncUserSettings.isFormatDisplayed;
          stateModel.vendor.matchRequired = ncUserSettings.isValidVendorMandatory;
          stateModel.unspscClassification.active = InstitutionParameterService.getInstitutionParameters().isUnspscClassificationActive;
          stateModel.unspscClassification.required = stateModel.unspscClassification.active && ncUserSettings.isSegmentMandatory;
          stateModel.classification.segment.required = !stateModel.unspscClassification.active && ncUserSettings.isSegmentMandatory;
          stateModel.classification.hidden = stateModel.unspscClassification.active;
        }

        requisitionUncataloguedProductStateModel = stateModel;
      }

      // ////////////////
      // Helper functions
      function isUncataloguedProductUpdateable(isNewItem) {
        var isUpdateable = isNewItem;
        if (!isNewItem) {
          var itemStatus = modelManager.getRequisitionItemListModel().selectedRequisitionItem().status;

          if (itemStatus === '1' ||
              itemStatus === '2' ||
              itemStatus === '2A' ||
              itemStatus === '2B' ||
              itemStatus === '2C' ||
              itemStatus === '2F' ||
              itemStatus === '2X' ||
              itemStatus === '2R') {
            isUpdateable = true;
          }
        }
        return isUpdateable;
      }

      function computeNonCataloguedInteractionMode(isNewItem, isUpdateable) {
        // Compute interactionMode
        if (InteractionModes.ReadOnly === stateManager.getMode() || !isUpdateable) {
          return InteractionModes.ReadOnly;
        }
        if (isNewItem) {
          return InteractionModes.New;
        }
        return InteractionModes.Edit;
      }

      // Indicate if given requisition item's quantity field should be editable
      function isQuantityEditable(item) {
        switch (item.status) {
          case '0':  // Cancelled
          case '2D': // CGR in progress
          case '2E': // Completed CGR
          case '3C': // Call for tenders/RFQ
          case '4':  // Order to be approved
          case '4A': // Approved order
          case '6':  // Full delivery
            return false;
          case '5':  // Partial delivery
            if (item.type === 'D') {
              return false;
            }
            return true;
          default:
            return true;
        }
      }

      function isClientValid() {
        var headerModel = modelManager.getRequisitionHeaderModel();

        // Both department and client are empty OR client is not null
        // when department is of kind External Sales
        return (_.isNil(headerModel.department) && _.isNil(headerModel.client)) ||
          (headerModel.department.isExternalSales && !_.isNil(headerModel.client) ||
          (!headerModel.department.isExternalSales && _.isNil(headerModel.client)));
      }

      function isRequisitionItemTabValid() {
        var tabsModel = modelManager.getRequisitionItemTabsModel();
        var valid = true;
        if (requisitionItemTabsStateModel.store.required) {
          valid = valid && !_.isNil(tabsModel.store);
        }
        // if (requisitionItemTabsStateModel.account.required) {
        //    valid = valid && !_.isNil(tabsModel.account);
        // }
        return valid;
      }

      // Indicate if given requisition item can have its store editable
      function isProductStatusEditable(item) {
        switch (item.status) {
          case '1':
          case '2':
          case '2F':
          case '2X':
          case '2R':
            return true;
          default:
            return false;
        }
      }

      function canChangeProductDueDate(itemStatus) {
        switch (itemStatus) {
          case undefined:
          case null:
          case '0':
          case '1':
          case '2':
          case '2A':
          case '2B':
          case '2C':
          case '2F':
          case '2R':
          case '2X':
          case '3':
          case '3A':
          case '3B':
          case '3E':
            return true;
          default:
            return false;
        }
      }

      function computeRequisitionHeaderTypeDisabledStatus() {

        // default disabled status value to false (not disabled)
        var requisitionTypeDisabledStatus = false;
        var headerModel = modelManager.getRequisitionHeaderModel();
        var institutionParams = InstitutionParameterService.getInstitutionParameters();
        var currentProfile = UserProfileService.getCurrentProfile();

        requisitionTypeDisabledStatus =

          // requisition cancelled
          headerModel.status === 0 ||

          // requisition status is awaiting generation, on order, partial or fully delivery
          headerModel.status >= 3 ||

          // selected department is external sales
          (!_.isNil(headerModel.department) && headerModel.department.isExternalSales) ||

          // fixed assets module is not activated
          !institutionParams.isFixedAssetActive ||

          // no requester in charge of fixed assets is defined
          _.isNil(institutionParams.requesterInChargeForFixedAsset) ||

          // not everyone can create a fixed asset requisition and current user does not have a permission to create fixed asset requisition
          (institutionParams.typeOfPersmissionForFixedAsset === 2 && !currentProfile.permissions.requisitionSpecific.canDoFixedAssetRequisition)

        ;
        return requisitionTypeDisabledStatus;
      }

      return this;
    }

  }
)();
