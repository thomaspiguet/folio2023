(
  function() {
    'use strict';

    angular
      .module('app.business-logic.product')
      .factory('ProductDisplayLogicManager', ProductDisplayLogicManager)
    ;

    /* @ngInject */
    function ProductDisplayLogicManager(
      $mdSidenav,
      ProductCartStateModel,
      ProductFilterStateModel,
      ProductFilterStates,
      ProductListStateModel,
      ProductModelManager,
      ProductStateManager,
      SystemLookupService
    ) {

      var self = this;
      var productFilterStateModel;
      var productListStateModel;
      var productCartStateModel;

      self.initialize = function initialize(config) {
        self.reset();
        self.synchronize();

        // This... is very bad - please review me
        productCartStateModel.showAddToRequisition = config.parentView === 'Requisition';
        productCartStateModel.showAddToRequisitionTemplate = config.parentView === 'RequisitionTemplate';
      };

      self.reset = function reset() {
        productFilterStateModel = new ProductFilterStateModel();
        productListStateModel = new ProductListStateModel();
        productCartStateModel = new ProductCartStateModel();
      };

      self.synchronize = function synchronize() {
        computeProductFilterState();
        computeProductListState();
      };

      self.toggleRightPanel = function toggleRightPanel() {
        $mdSidenav('right-side-menu').toggle();
      };

      self.getProductFilterStateModel = function getProductFilterStateModel() {
        return productFilterStateModel;
      };

      self.getProductListStateModel = function getProductListStateModel() {
        return productListStateModel;
      };

      self.getProductCartStateModel = function getProductCartStateModel() {
        return productCartStateModel;
      };

      function computeProductFilterState() {
        var newStateModel = new ProductFilterStateModel();
        var productParamModel = ProductModelManager.getProductParamModel();
        var productFilterModel = ProductModelManager.getProductFilterModel();

        // Determine which product sources are available
        if (productParamModel.department && productParamModel.department.isExternalSales) {
          newStateModel.productSource.showProducts = false;
          newStateModel.productSource.showCatalogs = false;
        }
        else {
          newStateModel.productSource.showExternalSales = false;
        }

        // Hide external sales section if selected department isn't external sales
        newStateModel.externalSales.hidden = productParamModel.department ? !productParamModel.department.isExternalSales : true;
        
        // Catalog section
        newStateModel.catalog.hidden =
          SystemLookupService.productSources.catalogs.code !== productFilterModel.productSourceCode ||
          (productParamModel.department ? productParamModel.department.isExternalSales : false);
        
        // Hide product description if searching catalogs
        newStateModel.name.hidden = SystemLookupService.productSources.catalogs.code === productFilterModel.productSourceCode;
        
        // Buttons state
        newStateModel.search.running = ProductStateManager.getCurrentProductFilterState() === ProductFilterStates.searching;
        newStateModel.search.completed = ProductStateManager.getCurrentProductFilterState() === ProductFilterStates.searched;
        newStateModel.search.disabled = newStateModel.search.running || newStateModel.search.completed;
        newStateModel.clear.disabled = productFilterModel.isEqual(ProductModelManager.getPristineProductFilterModel());
        
        // Reassign
        productFilterStateModel = newStateModel;
      }

      function computeProductListState() {
        var aModel = productListStateModel.clone();

        // Determine product list display mode: products of catalogs - default is products
        aModel.showProductsList = true;
        aModel.showCatalogsList = false;
        if (SystemLookupService.productSources.catalogs.code === ProductModelManager.getProductFilterModel().productSourceCode) {
          aModel.showProductsList = false;
          aModel.showCatalogsList = true;
        }

        productListStateModel = aModel;
      }

      return this;
    }
  }
)();
