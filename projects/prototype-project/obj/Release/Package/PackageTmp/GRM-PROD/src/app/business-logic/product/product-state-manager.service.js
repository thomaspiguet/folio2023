(
  function() {
    'use strict';

    angular
      .module('app.business-logic.product')
      .factory('ProductStateManager', ProductStateManagerFactory)
    ;

    /* @ngInject */
    function ProductStateManagerFactory(ActionBarConstants, ProductFilterStates, ProductListStates, InteractionModes) {
      var self = this;

      // action state (idle, cancelling, completing, deleting, saving, fetching)
      var actionState;
      var productFilterState;
      var productListState;

      // edit, read, etc... see InteractionModes
      var mode;

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          actionState: ActionBarConstants.idle,
          productListState: ProductListStates.idle,
          productFilterState: ProductFilterStates.idle,
          mode: InteractionModes.New
        }, configParams);

        actionState = config.actionState;
        productListState = config.productListState;
        productFilterState = config.productFilterState;
        mode = config.mode;
      };

      // action state
      self.setCurrentActionState = function setCurrentActionState(value) {
        actionState = value;
      };
      self.getCurrentActionState = function getCurrentActionState() {
        return actionState;
      };

      // product filter state
      self.setCurrentProductFilterState = function setCurrentProductFilterState(value) {
        productFilterState = value;
      };
      self.getCurrentProductFilterState = function getCurrentProductFilterState() {
        return productFilterState;
      };

      // product list state
      self.setCurrentProductListState = function setCurrentProductListState(value) {
        productListState = value;
      };
      self.getCurrentProductListState = function getCurrentProductListState() {
        return productListState;
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
