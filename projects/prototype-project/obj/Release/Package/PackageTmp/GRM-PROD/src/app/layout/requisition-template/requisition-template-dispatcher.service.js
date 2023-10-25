(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template')
      .factory('RequisitionTemplateDispatcher', RequisitionTemplateDispatcherFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateDispatcherFactory(
        $log,
        $state,
        $timeout,
        ActionBarConstants,
        InteractionModes,
        RequisitionTemplateBusinessLogic,
        RequisitionTemplateDisplayLogicManager,
        RequisitionTemplateModelManager,
        RequisitionTemplateStateManager,
        RequisitionTemplateItemsActions,
        UrlHelper,
        UserProfileService
      ) {

      // Keep a reference to this
      var self = this;

      // Alias a few service names to allow for less cluttered code
      var actions = ActionBarConstants;
      var businessLogic = RequisitionTemplateBusinessLogic;
      var modelManager = RequisitionTemplateModelManager;
      var stateManager = RequisitionTemplateStateManager;
      var displayLogicManager = RequisitionTemplateDisplayLogicManager;

      // **************
      // Global actions
      //

      // (re) initialize this service to its default state
      self.initialize = function initialize(configParams) {
        var config = _.extend({
          id: undefined,
          iid: undefined
        }, configParams);

        // Init state manager
        stateManager.initialize({
          mode: _.isNil(config.id) ? InteractionModes.New : InteractionModes.Edit
        });

        // Init model manager
        modelManager.initialize({
          //
        });

        // Init business logic manager
        businessLogic.initialize({
          id: config.id,
          iid: config.iid,
          notificationCallback: self.notify
        });

        // Init display logic manager
        displayLogicManager.initialize({
          //
        });
      };

      self.notify = function notify(configObj) {
        if (_.isNil(configObj) || _.isNil(configObj.event)) {
          return;
        }
        var urlParams;
        switch (configObj.event) {
          case RequisitionTemplateBusinessLogic.Events.NEW_REQUISITION_TEMPLATE: {
            $state.go('^.create');
            break;
          }
          case RequisitionTemplateBusinessLogic.Events.SAVE_REQUISITION_TEMPLATE: {
            $state.go('^.update', { id: configObj.params.id });
            break;
          }
          case RequisitionTemplateBusinessLogic.Events.ON_PRODUCT_SEARCH: {
            $state.go('.product-search', configObj.params);
            break;
          }          
        }
      };

      // Return the current profile id
      self.getUserProfileId = function getUserProfileId() {
        return UserProfileService.getCurrentProfile().id;
      };
      // Get the current requisition template label
      self.getRequisitionTemplateLabel = function getRequisitionTemplateLabel() {
        return modelManager.getViewModel().requisitionTemplateLabel;
      };
      // Indicates if the current requisition template is inactive
      self.isRequisitionTemplateInactive = function isRequisitionTemplateInactive() {
        return modelManager.isRequisitionTemplateInactive();
      };
      self.getRequisitionTemplateActionBarStateModel = function getRequisitionTemplateActionBarStateModel() {
        return displayLogicManager.getRequisitionTemplateActionBarStateModel();
      };

      // ********************************************
      // Requisition template header actions handlers
      //
      self.getRequisitionTemplateModel = function getRequisitionTemplateModel() {
        return modelManager.getRequisitionTemplateModel();
      };
      self.onRequisitionTemplateHeaderActionsAction = function onRequisitionTemplateHeaderActionsAction(obj) {
        // $log.log(obj);
      };
      self.onRequisitionTemplateHeaderActionsEdit = function onRequisitionTemplateHeaderActionsEdit(obj) {};
      self.onRequisitionTemplateHeaderActionsCheck = function onRequisitionTemplateHeaderActionsCheck(obj) {};

      // ************************************
      // Requisition template header handlers
      //
      self.getRequisitionTemplateHeaderStateModel = function getRequisitionTemplateHeaderStateModel() {
        return displayLogicManager.getRequisitionTemplateHeaderStateModel();
      };

      self.getRequisitionTemplateHeaderModel = function getRequisitionTemplateHeaderModel() {
        return modelManager.getRequisitionTemplateHeaderModel();
      };
      self.onRequisitionTemplateHeaderAction = function onRequisitionTemplateHeaderAction(obj) {
        //
      };
      self.onRequisitionTemplateHeaderEdit = function onRequisitionTemplateHeaderEdit(obj) {
        // modelManager.synchronizeRequisitionTemplateHeaderModel(obj.model);
        businessLogic.synchronizeRequisitionTemplateHeader(obj);
      };
      self.onRequisitionTemplateHeaderCheck = function onRequisitionTemplateHeaderCheck(obj) {
        // $log.log(obj);
      };

      // ************************************
      // Requisition template actions handler
      //

      // Action bar action handler (complete, save, cancel, etc...)
      self.onRequisitionTemplateActionsAction = function onRequisitionTemplateActionsAction(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (actions.delete === action) {
            businessLogic.deleteRequisitionTemplate(modelManager.getRequisitionTemplateHeaderModel().id);
          }
          else if (actions.cancel === action) {
            businessLogic.cancelRequisitionTemplate();
          }
          else if (actions.save === action) {
            businessLogic.saveRequisitionTemplate();
          }
          else {
            $log.warn('Unknown action [' + action + ']');
          }
        }
      };

      // Provides the current action state (saving, completing, deleting, etc...)
      self.getCurrentActionState = function getCurrentActionState() {
        return stateManager.getCurrentActionState();
      };

      // ***********************************
      // Requisition template items handlers
      //
      self.getRequisitionTemplateItemsModel = function getRequisitionTemplateItemsModel() {
        return RequisitionTemplateModelManager.getRequisitionTemplateItemsModel();
      };

      self.getRequisitionTemplateItemsStateModel = function getRequisitionTemplateItemsStateModel() {
        return displayLogicManager.getRequisitionTemplateItemsStateModel();
      };
      this.onRequisitionTemplateItemsAction = function onRequisitionTemplateItemsAction(obj) {
        switch (obj.action) {
          case RequisitionTemplateItemsActions.onSearchProducts:
            businessLogic.searchProducts(obj.model);
            break;
          case RequisitionTemplateItemsActions.onSearchProductInfo:
            return RequisitionTemplateBusinessLogic.getProductInfo(obj);
          case RequisitionTemplateItemsActions.onAddRequisitionTemplateItem:
            RequisitionTemplateBusinessLogic.addTemplateItem(obj.model);
            break;
          case RequisitionTemplateItemsActions.onRemoveRequisitionTemplateItem:
            RequisitionTemplateBusinessLogic.removeTemplateItem(obj.model);
            break;
          case RequisitionTemplateItemsActions.onAddRequisitionTemplateItems:
            RequisitionTemplateBusinessLogic.addTemplateItems(obj.model);
            break;
          default:
          return null;
        }
      };
      this.onRequisitionTemplateItemsEdit = function onRequisitionTemplateItemsEdit(obj) {
        RequisitionTemplateBusinessLogic.extendTemplateItemsModel(obj.model);
      };
      this.onRequisitionTemplateItemsCheck = function onRequisitionTemplateItemsCheck(obj) {};

      // Provides the current state of items list (idle, fetching ..)
      self.getCurrentItemsListState = function getCurrentItemsListState() {
        return stateManager.getCurrentItemsListState();
      };

    return this;
  }
}
)();
