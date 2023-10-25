(
  function() {
    'use strict';

    angular
      .module('app.layout.product')
      .factory('ProductDispatcher', ProductDispatcherFactory)
    ;

    /* @ngInject */
    function ProductDispatcherFactory(
        $log,
        InteractionModes,
        ProductBusinessLogic,
        ProductCartActions,
        ProductDisplayLogicManager,
        ProductFilterActions,
        ProductListActionBarActions,
        ProductListActions,
        ProductModelManager,
        ProductStateManager
      ) {

      var self = this;

      var businessLogic = ProductBusinessLogic;
      var displayLogicManager = ProductDisplayLogicManager;
      var modelManager = ProductModelManager;
      var stateManager = ProductStateManager;

      //
      // Initialization
      //
      self.initialize = function initialize(config) {

        // Init state manager
        stateManager.initialize({
          mode: InteractionModes.Edit
        });

        // Init model manager
        modelManager.initialize({
          configParams: config
        });

        // Init business logic manager
        businessLogic.initialize(_.extend({
          notify: self.notificationHandler
        }, config));

        // Init display logic manager
        displayLogicManager.initialize(config);
      };

      //
      // Product filter actions
      //
      self.productFilterActionsActionHandler = function productFilterActionsActionHandler(obj) {
        $log.log(obj);
      };

      self.notificationHandler = function notificationHandler(configObj) {
        if (_.isNil(configObj) || _.isNil(configObj.event)) {
          return;
        }
        switch (configObj.event) {
          case businessLogic.Events.CRITERIAS_CLEARED: {
            self.onClear();
            break;
          }
        }
      };

      //
      // Product filter
      //
      self.getProductFilterModel = function getProductFilterModel() {
        return modelManager.getProductFilterModel();
      };

      self.getProductFilterStateModel = function getProductFilterStateModel() {
        return displayLogicManager.getProductFilterStateModel();
      };

      self.productFilterEditHandler = function productFilterEditHandler(obj) {
        businessLogic.synchronizeProductFilter(obj);
      };

      self.productFilterActionHandler = function productFilterActionHandler(obj) {
        if (!_.isNil(obj.action)) {
          switch (obj.action) {
            case ProductFilterActions.onSearch: {
              // businessLogic.searchProducts(obj);
              businessLogic.onSearch(obj);
              break;
            }
            case ProductFilterActions.onClear: {
              businessLogic.clearProductFilterModel();
              break;
            }
            default: {
              break;
            }
          }
        }
      };

      //
      // Product list actions
      //
      self.productListActionHandler = function productListActionHandler(obj) {
        if (!_.isNil(obj.action)) {
          switch (obj.action) {
            case ProductListActions.onProductItemClick: {
              businessLogic.addOrRemoveProductCartItem(obj.item);
              break;
            }
            case ProductListActions.onSort: {
              businessLogic.onListSort(obj.searchConfiguration);
              break;
            }
            case ProductListActions.onPage: {
              businessLogic.onListPage(obj.searchConfiguration);
              break;
            }
            default: {
              break;
            }
          }
        }
      };

      //
      // Product list action bar actions
      //
      self.productListActionBarActionHandler = function productListActionBarActionHandler(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (ProductListActionBarActions.onViewCart === action) {
            displayLogicManager.toggleRightPanel();
          }
          else {
            $log.warn('Unknown action [' + action + ']');
          }
        }
      };

      //
      // Product cart
      //
      self.getProductCartStateModel = function getProductCartStateModel() {
        return displayLogicManager.getProductCartStateModel();
      };

      self.productCartActionHandler = function productCartActionHandler(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          switch (action) {
            case ProductCartActions.onApplyCart: {
              if (self.onCloseOverlay && _.isFunction(self.onCloseOverlay)) {
                self.onCloseOverlay(undefined, true);
              }
              break;
            }
            case ProductCartActions.onDiscardCart: {
              if (self.onCloseOverlay && _.isFunction(self.onCloseOverlay)) {
                self.onCloseOverlay(undefined, false);
              }
              break;
            }
            case ProductCartActions.onClearCart: {
              businessLogic.clearProductCart();
              break;
            }
            case ProductCartActions.onRemoveCartItem: {
              businessLogic.removeProductCartItem(obj.item);
              break;
            }
            case ProductCartActions.onCloseCart: {
              displayLogicManager.toggleRightPanel();
              break;
            }
            default: {
              break;
            }
          }
        }
      };

      self.getProductCartModel = function getProductCartModel() {
        return modelManager.getProductCartModel();
      };

      self.getProductCartItemsIds = function getProductCartItemsIds() {
        return modelManager.getProductCartItemsIds();
      };

      //
      // Product list
      //
      self.getProductListModel = function getProductListModel() {
        return modelManager.getProductListModel();
      };

      self.getProductListStateModel = function getProductListStateModel() {
        return displayLogicManager.getProductListStateModel();
      };

      // Provides the current state of items list (idle, fetching ..)
      self.getCurrentProductListState = function getCurrentProductListState() {
        return stateManager.getCurrentProductListState();
      };

      //
      // Product view
      //
      self.getProductViewModel = function getProductViewModel() {
        return modelManager.getViewModel();
      };

      return this;
    }
  }
)();
