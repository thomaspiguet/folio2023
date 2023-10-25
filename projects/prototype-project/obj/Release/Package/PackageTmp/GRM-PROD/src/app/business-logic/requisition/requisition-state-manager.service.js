(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition')
      .factory('RequisitionStateManager', RequisitionStateManagerFactory)
    ;

    /* @ngInject */
    function RequisitionStateManagerFactory(ActionBarConstants, InteractionModes) {
      var self = this;

      // edit, read, etc... see InteractionModes
      var mode;

      // fetching, saving, etc... see ApplicationActions
      var globalState;

      // saving, completing, cancelling, deleting, etc... see ActionBarConstants
      var actionBarState;

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          actionBarState: ActionBarConstants.idle,
          mode: InteractionModes.New
        }, configParams);

        actionBarState = config.actionBarState;
        mode = config.mode;
      };

      // TODO this may not be needed - to review
      // global application state
      self.setCurrentState = function setCurrentState(value) {
        globalState = value;
      };
      self.getCurrentState = function getCurrentState() {
        return globalState;
      };

      // action bar state
      self.setCurrentActionBarState = function setCurrentActionBarState(value) {
        actionBarState = value;
      };
      self.getCurrentActionBarState = function getCurrentActionBarState() {
        return actionBarState;
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
      self.isNewMode = function isNewMode() {
        return InteractionModes.New === mode;
      };
      self.setEditMode = function setEditMode() {
        mode = InteractionModes.Edit;
      };
      self.isEditMode = function isEditMode() {
        return InteractionModes.Edit === mode;
      };
      self.setReadOnlyMode = function setReadOnlyMode() {
        mode = InteractionModes.ReadOnly;
      };

      return self;
    }
  }
)();
