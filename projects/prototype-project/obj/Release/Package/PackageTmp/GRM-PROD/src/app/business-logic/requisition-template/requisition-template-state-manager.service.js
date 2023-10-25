(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-template')
      .factory('RequisitionTemplateStateManager', RequisitionTemplateStateManagerFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateStateManagerFactory(ActionBarConstants, RequisitionTemplateItemsStates, InteractionModes) {
      var self = this;

      // action state (idle, cancelling, completing, deleting, saving, fetching)
      var actionState;
     // items list state (idle, fetching)
      var itemsListState;

      // edit, read, etc... see InteractionModes
      var mode;

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          actionState: ActionBarConstants.idle,
          itemsListState: RequisitionTemplateItemsStates.idle,
          mode: InteractionModes.New
        }, configParams);

        actionState = config.actionState;
        itemsListState = config.itemsListState;
        mode = config.mode;
      };

      // action state
      self.setCurrentActionState = function setCurrentActionState(value) {
        actionState = value;
      };
      self.getCurrentActionState = function getCurrentActionState() {
        return actionState;
      };
      // item list state
      self.setCurrentItemsListState = function setCurrentItemsListState(value) {
        itemsListState = value;
      };
      self.getCurrentItemsListState = function getCurrentItemsListState() {
        return itemsListState;
      };

      // mode (see InteractionModes)
      self.setMode = function setMode(value) {
        mode = value;
      };
      self.getMode = function getMode() {
        return mode;
      };
      self.setNewMode = function setNewMode() {
        mode = InteractionModes.New;
      };
      self.setEditMode = function setEditMode() {
        mode = InteractionModes.Edit;
      };
      self.setReadOnlyMode = function setReadOnlyMode() {
        mode = InteractionModes.ReadOnly;
      };

      return self;
    }
  }
)();
