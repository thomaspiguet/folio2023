(
  function() {
    'use strict';

    angular
      .module('app.business-logic.product')
      .factory('ProductBusinessLogic', ProductBusinessLogicFactory)
    ;

    /* @ngInject */
    function ProductBusinessLogicFactory(
        $q,
        $log,
        $timeout,
        NotificationHandler,
        NotificationService,
        ProductFilterStates,
        ProductListStates,
        ProductDisplayLogicManager,
        ProductModelManager,
        ProductStateManager,
        ProductApiService,
        SystemLookupService
      ) {
      var self = this;

      var modelManager = ProductModelManager;
      var displayLogicManager = ProductDisplayLogicManager;
      var stateManager = ProductStateManager;

      Object.defineProperty(this, 'Events', {
        value: {
          CRITERIAS_CLEARED: 'CRITERIAS_CLEARED',
        }
      });

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          id: undefined,
          notificationCallback: function noop() { /*Do nothing*/ } // TODO : use this where appropriate
        }, configParams);

        self.notificationCallback = config.notify;
      };

      function search(searchConfig) {
        beforeSearch(searchConfig.fetchMode);
        if (true === searchConfig.clearResults) {
          modelManager.clearProductListModel();
          displayLogicManager.synchronize();
        }

        var criteriaModel = modelManager.getProductFilterModel();
        var viewModel = modelManager.getViewModel();
        var productParamModel = modelManager.getProductParamModel();

        var cfg = {
          criteria: _.extend({}, {
            brand: criteriaModel.brand,
            buyerId: !_.isNil(criteriaModel.buyer) ? criteriaModel.buyer.id : undefined,
            catalogDescription: criteriaModel.vendorProductDescription,
            clientId: productParamModel.client ? productParamModel.client.id : undefined,
            contractNumber: criteriaModel.contractNumber,
            deliveryLocationId: productParamModel.deliveryLocation ? productParamModel.deliveryLocation.id : undefined,
            departmentId: productParamModel.department ? productParamModel.department.id : undefined,
            gtinCode: criteriaModel.gtinCode,
            homologationClass: criteriaModel.homologationClass,
            homologationNumber: criteriaModel.homologationNumber,
            manufacturerId: !_.isNil(criteriaModel.manufacturer) ? criteriaModel.manufacturer.id : undefined,
            manufacturerItemCode: criteriaModel.manufacturerProductCode,
            productCode: criteriaModel.productNumber,
            productDescription: criteriaModel.name,
            productSource: criteriaModel.productSource,
            requesterId: productParamModel.requester ? productParamModel.requester.id : undefined,
            siteId: productParamModel.site ? productParamModel.site.id : undefined,
            unspscClassificationCode: !_.isNil(criteriaModel.unspscClassification) ? criteriaModel.unspscClassification.code : undefined,
            unspscClassificationId: !_.isNil(criteriaModel.unspscClassification) ? criteriaModel.unspscClassification.id : undefined,
            vendorId: criteriaModel.vendor ? criteriaModel.vendor.code : undefined,
            vendorItemCode: criteriaModel.vendorProductCode,
            vendorProductDescription: criteriaModel.vendorProductDescription
          }),
          paging: viewModel.paging,
          sorting: viewModel.sorting,
          config: {
            blockUI: true,
            showSpinner: true
          }
        };

        var promise = ProductApiService.searchProducts;
        if (SystemLookupService.productSources.catalogs.code === criteriaModel.productSourceCode) {
          promise = ProductApiService.searchCatalogs;
        }

        promise(cfg)
          .then(
            function success(response) {
              modelManager.synchronizeProductListModel(response.data);
              modelManager.synchronizeViewModel(response.data);
              displayLogicManager.synchronize();

              // Display notification whenever search returns no results...
              if (response.data.items.length === 0) {
                NotificationService.warn({ messageOrKey: 'searchResultsEmpty', translate: true });
              }
            },
            function failure(reason) {
              if (reason.status === 413) { // Request Entity Too Large
                NotificationService.error({ messageOrKey: 'needMoreCriteria', translate: true });
              }
              else {
                NotificationService.error({ messageOrKey: reason.description, translate: false });
              }
            }
          )
          .finally(function onFinally() {
            afterSearch(searchConfig.fetchMode);
          })
        ;
      }

      self.onSearch = function onSearch(searchConfig) {
        modelManager.synchronizeViewModelPaging(searchConfig);
        search(searchConfig);
      };

      self.onListSort = function onListSort(searchConfig) {
        modelManager.synchronizeViewModelSorting(searchConfig);
        search(searchConfig);
      };

      self.onListPage = function onListPage(searchConfig) {
        modelManager.synchronizeViewModelPaging(searchConfig);
        search(searchConfig);
      };

      self.synchronizeProductFilter = function synchronizeProductFilter(obj) {
        modelManager.synchronizeProductFilterModel(obj.model);
        displayLogicManager.synchronize();
      };

      self.clearProductFilterModel = function clearProductFilterModel() {
        modelManager.clearProductFilterModel();
        displayLogicManager.synchronize();
        self.notificationCallback({
          event: self.Events.CRITERIAS_CLEARED
        });
      };

      self.addOrRemoveProductCartItem = function addOrRemoveProductCartItem(item) {
        modelManager.addOrRemoveProductCartItem(item);
      };

      self.removeProductCartItem = function removeProductCartItem(item) {
        modelManager.removeProductCartItem(item);
      };

      self.clearProductCart = function clearProductCart() {
        modelManager.clearProductCart();
      };

      function beforeSearch(fetchMode) {
        if (fetchMode === 'global') {
          modelManager.clearProductListModel();
          stateManager.setCurrentProductFilterState(ProductFilterStates.searching);
        }
        stateManager.setCurrentProductListState(ProductListStates.fetching);
        displayLogicManager.getProductListStateModel().hidden = false;
        displayLogicManager.synchronize();
      }

      function afterSearch(fetchMode) {
        if (fetchMode === 'global') {
          modelManager.saveProductFilterModel();
          stateManager.setCurrentProductFilterState(ProductFilterStates.searched);
          if (!displayLogicManager.getProductListStateModel().isInitialized) {
            displayLogicManager.getProductListStateModel().isInitialized = true;
          }
        }
        stateManager.setCurrentProductListState(ProductListStates.idle);
        displayLogicManager.synchronize();
        $timeout(function onTimeout() {
          stateManager.setCurrentProductFilterState(ProductFilterStates.idle);
          displayLogicManager.synchronize();
        }, 500);
      }

      return this;
    }
  }
)();
