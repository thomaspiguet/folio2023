(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-template')
      .factory('RequisitionTemplateDisplayLogicManager', RequisitionTemplateDisplayLogicManager)
    ;

    /* @ngInject */
    function RequisitionTemplateDisplayLogicManager(
        $log,
        $mdSidenav,
        FormService,
        InteractionModes,
        RequisitionTemplateActionBarStateModel,
        RequisitionTemplateHeaderStateModel,
        RequisitionTemplateItemsStateModel,
        RequisitionTemplateModelManager,
        RequisitionTemplateStateManager,
        UserProfileService,
        InstitutionParameterService
      ) {

      var self = this;
      var requisitionTemplateActionBarStateModel;
      var requisitionTemplateHeaderStateModel;
      var requisitionTemplateItemsStateModel;

      var modelManager = RequisitionTemplateModelManager;
      var stateManager = RequisitionTemplateStateManager;

      self.initialize = function initialize(configParams) {
        requisitionTemplateActionBarStateModel = new RequisitionTemplateActionBarStateModel();
        requisitionTemplateHeaderStateModel = new RequisitionTemplateHeaderStateModel();
        requisitionTemplateItemsStateModel = new RequisitionTemplateItemsStateModel();
        self.synchronize();
      };

      self.synchronize = function synchronize() {
        // action bar state model
        computeActionBarState();
        // header state model
        computeHeaderState();
        // items state model
        computeItemsState();
      };

      self.getRequisitionTemplateActionBarStateModel = function getRequisitionTemplateActionBarStateModel() {
        return requisitionTemplateActionBarStateModel;
      };

      self.getRequisitionTemplateHeaderStateModel = function getRequisitionTemplateHeaderStateModel() {
        return requisitionTemplateHeaderStateModel;
      };

      self.getRequisitionTemplateItemsStateModel = function getRequisitionTemplateItemsStateModel() {
        return requisitionTemplateItemsStateModel;
      };

      self.toggleRightPanel = function toggleRightPanel() {
        $mdSidenav('right-side-menu').toggle();
      };

      function computeActionBarState() {
        // local references
        var mode = stateManager.getMode();
        var dataModel = modelManager.getRequisitionTemplateHeaderModel();
        var stateModel = requisitionTemplateHeaderStateModel;

        // create new state model instance
        var actionBarStateModel = new RequisitionTemplateActionBarStateModel();

        // new/edit state
        if (InteractionModes.New === mode || InteractionModes.Edit === mode) {
          actionBarStateModel.save.disabled =
            (stateModel.name.required ? _.isNil(dataModel.name) : false) ||
            (stateModel.site.required ? _.isNil(dataModel.site) : false) ||
            (stateModel.department.required ? _.isNil(dataModel.department) : false) ||
            (stateModel.address.required ? _.isNil(dataModel.address) : false) ||
            (stateModel.deliveryLocation.required ? _.isNil(dataModel.deliveryLocation) : false) ||
            (stateModel.requester.required ? _.isNil(dataModel.requester) : false)
          ;

          if (InteractionModes.Edit === mode) {
            actionBarStateModel.save.disabled = actionBarStateModel.save.disabled || !FormService.isDirty();
            actionBarStateModel.delete.hidden = false;
            actionBarStateModel.delete.disabled = FormService.isDirty();
          }
          else {
             actionBarStateModel.delete.hidden = true;
          }

          actionBarStateModel.save.disabled = !FormService.isDirty() || !FormService.isValid();
        }
        else if (InteractionModes.ReadOnly === mode) {
          // force disable state if current interaction mode is read only
          actionBarStateModel.save.disabled = true;
          actionBarStateModel.delete.hidden = true;
        }
        else {
          // TODO: raise error?
          $log.warn('Unknown InteractionMode [' + mode + ']');
        }

        // reassign action bar state model
        requisitionTemplateActionBarStateModel = actionBarStateModel;
      }

      function computeHeaderState() {
        var mode = stateManager.getMode();
        var headerDataModel = modelManager.getRequisitionTemplateHeaderModel();
        var itemsDataModel = modelManager.getRequisitionTemplateItemsModel();
        var headerStateModel = new RequisitionTemplateHeaderStateModel();

        // TODO: clean up the following a bit
        if (InteractionModes.New === mode) {
          headerStateModel.address.disabled = !(!_.isNil(headerDataModel.site) && !_.isNil(headerDataModel.department));
          headerStateModel.site.disabled = itemsDataModel.requisitionTemplateItems.length > 0;
          headerStateModel.department.disabled = _.isNil(headerDataModel.site) || itemsDataModel.requisitionTemplateItems.length > 0;
          headerStateModel.department.required = UserProfileService.getCurrentProfile().isDecentralized() ? true : false;
          headerStateModel.deliveryLocation.disabled = headerStateModel.requester.disabled = _.isNil(headerDataModel.department);
          headerStateModel.isAutomaticGeneration.disabled = _.isNil(headerDataModel.department) ||
            (_.isNil(headerDataModel.deliveryLocation) &&
            InstitutionParameterService.getInstitutionParameters().isDeliveryLocationMandatory) ||
            _.isNil(headerDataModel.requester)
          ;

          headerStateModel.client.disabled = _.isNil(headerDataModel.department) ||
            !headerDataModel.department.isExternalSales ||
            !UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canDoExternalSaleRequisition ||
            headerDataModel.status > 1 ||
            itemsDataModel.requisitionTemplateItems.length > 0
          ;
        }
        else if (InteractionModes.Edit === mode) {
          headerStateModel.address.disabled = !(!_.isNil(headerDataModel.site) && !_.isNil(headerDataModel.department));
          headerStateModel.site.disabled = itemsDataModel.requisitionTemplateItems.length > 0;
          headerStateModel.department.disabled = !_.isNil(headerDataModel.site) && itemsDataModel.requisitionTemplateItems.length > 0;
          headerStateModel.department.required = UserProfileService.getCurrentProfile().isDecentralized() ? true : false;
          headerStateModel.deliveryLocation.disabled = headerStateModel.requester.disabled = _.isNil(headerDataModel.department);
          headerStateModel.isAutomaticGeneration.disabled = _.isNil(headerDataModel.department) ||
            (_.isNil(headerDataModel.deliveryLocation) &&
            InstitutionParameterService.getInstitutionParameters().isDeliveryLocationMandatory) ||
            _.isNil(headerDataModel.requester)
          ;

          headerStateModel.client.disabled = _.isNil(headerDataModel.department) ||
            !headerDataModel.department.isExternalSales ||
            !UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canDoExternalSaleRequisition ||
            headerDataModel.status > 1 ||
            itemsDataModel.requisitionTemplateItems.length > 0
          ;
        }
        else if (InteractionModes.ReadOnly === mode) {
          headerStateModel.name.disabled =
            headerStateModel.site.disabled =
            headerStateModel.department.disabled =
            headerStateModel.address.disabled =
            headerStateModel.deliveryLocation.disabled =
            headerStateModel.isAutomaticGeneration.disabled =
            headerStateModel.requester.disabled =
            headerStateModel.client = true
          ;
        }
        else {
          // TODO: raise error?
          $log.warn('Unknown InteractionMode [' + mode + ']');
        }

        // reassign requisition template header state model
        requisitionTemplateHeaderStateModel = headerStateModel;
      }

      function computeItemsState() {
        var mode = stateManager.getMode();
        var headerModel = modelManager.getRequisitionTemplateHeaderModel();
        var itemsStateModel = new RequisitionTemplateItemsStateModel();
        var selectedRequisitionItem = modelManager.getRequisitionTemplateItemsModel().requisitionTemplateItem;
        
        if (InteractionModes.New === mode || InteractionModes.Edit === mode) {
          itemsStateModel.store.disabled = true;

          // Setup store availability
          if (UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canModifyItemStore) {
            if ((_.isNil(headerModel.department) || headerModel.department.primaryCode !== '0') && 
            !_.isNil(selectedRequisitionItem) && selectedRequisitionItem.productType === 'I') {
              itemsStateModel.store.disabled = false;
              itemsStateModel.store.required = selectedRequisitionItem.productType === 'I';
            }
          }

          itemsStateModel.addButton.hidden =
          !Boolean(headerModel.site) || (UserProfileService.getCurrentProfile().isDecentralized() && !Boolean(headerModel.department));

          itemsStateModel.scheduleFrequency.disabled = false;
          itemsStateModel.scheduleDay.disabled = false;
        }
        else if (InteractionModes.ReadOnly === mode) {
          itemsStateModel.addButton.hidden = true;
          itemsStateModel.scheduleFrequency.disabled = true;
          itemsStateModel.scheduleDay.disabled = true;
        }
        else {
          // TODO: raise error?
          $log.warn('Unknown InteractionMode [' + mode + ']');
        }
        requisitionTemplateItemsStateModel = itemsStateModel;
      }

      return this;
    }
  }
)();
