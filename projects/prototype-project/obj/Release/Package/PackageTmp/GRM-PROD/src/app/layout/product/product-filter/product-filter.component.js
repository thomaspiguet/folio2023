(
  function() {
    'use strict';

    angular
      .module('app.layout.product.product-filter')
      .component('productFilter', productFilter())
    ;

    function productFilter() {
      var cdo = {
        templateUrl: 'product-filter.template.html',
        controller: ProductFilterController,
        bindings: {
          editHandler: '&',
          actionHandler: '&',
          productFilterModel: '<model',
          productFilterStateModel: '<stateModel',
          viewModel: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function ProductFilterController($scope, ProductFilterActions, SystemLookupService) {
      var self = this;
      self.model = undefined;
      self.stateModel = undefined;
      self.productSources = undefined;

      //
      // Life cycle hooks
      //
      self.$onInit = function onInit() {
        // synchronizeModel();
        self.model = self.productFilterModel.clone();
        self.stateModel = self.productFilterStateModel;

        setupProductSources();

        if (_.isNil(self.model.productSourceCode)) {
          self.model.productSourceCode = self.productSources[0].code;
        }
      };

      self.$onChanges = function onChanges(changesObj) {
        // synchronizeModel();
        if (changesObj.productFilterModel && !changesObj.productFilterModel.isFirstChange()) {
          self.model = self.productFilterModel.clone();
        }
        if (changesObj.productFilterStateModel && !changesObj.productFilterStateModel.isFirstChange()) {
          self.stateModel = self.productFilterStateModel;
        }
      };

      self.getProductSourceDescription = function getProductSourceDescription(productSource) {
        return SystemLookupService.productSources.getDescriptionById(productSource.id);
      };

      //
      // Change handlers
      //
      self.onProductSourceChange = function onProductSourceChange() {
        notifyModelChanged();
      };
      self.onProductNumberChange = function onProductNumberChange() {
        notifyModelChanged();
      };
      self.onProductDescriptionChange = function onProductDescriptionChange() {
        notifyModelChanged();
      };
      self.onUnspscClassificationChange = function onUnspscClassificationChange() {
        notifyModelChanged();
      };
      self.onBuyerChange = function onBuyerChange() {
        notifyModelChanged();
      };
      self.onVendorChange = function onVendorChange() {
        notifyModelChanged();
      };
      self.onVendorProductCodeChange = function onVendorProductCodeChange() {
        notifyModelChanged();
      };
      self.onVendorProductDescriptionChange = function onVendorProductDescriptionChange() {
        notifyModelChanged();
      };
      self.onManufacturerChange = function onManufacturerChange() {
        notifyModelChanged();
      };
      self.onManufacturerProductCodeChange = function onManufacturerProductCodeChange() {
        notifyModelChanged();
      };
      self.onGtinCodeChange = function onGtinCodeChange() {
        notifyModelChanged();
      };
      self.onBrandChange = function onBrandChange() {
        notifyModelChanged();
      };
      self.onHomologationClassChange = function onHomologationClassChange() {
        notifyModelChanged();
      };
      self.onHomologationNumberChange = function onHomologationNumberChange() {
        notifyModelChanged();
      };
      self.onContractNumberChange = function onContractNumberChange() {
        notifyModelChanged();
      };

      self.isSearchDisabled = function isSearchDisabled() {
        if (!_.isNil(self.stateModel)) {
          return self.stateModel.search.disabled || $scope.productSearchForm.$invalid;
        }
        return false;
      };

      self.isClearDisabled = function isClearDisabled() {
        if (!_.isNil(self.stateModel)) {
          return (self.stateModel.clear.disabled && $scope.productSearchForm.$valid) ||
                 $scope.productSearchForm.$pristine;
        }
        return false;
      };

      self.onSearch = function onSearch($event) {
        if ($event) {
          $event.preventDefault();
        }
        self.actionHandler({
          obj: {
            action: ProductFilterActions.onSearch,
            model: self.model,
            fetchMode : 'global',
            paging: self.viewModel.paging,
            sorting: self.viewModel.sorting,
            clearResults: true
          }
        });
      };

      self.onClear = function onClear($event) {
        if ($event) {
          $event.preventDefault();
        }
        self.actionHandler({
          obj: {
            action: ProductFilterActions.onClear
          }
        });
      };

      //
      // Helper functions
      //
      function notifyModelChanged() {
        self.editHandler({
          obj: {
            model: self.model
          }
        });
      }

      function synchronizeModel() {
        if (!_.isNil(self.productFilterModel)) {
          self.model = self.productFilterModel.clone();
          if (_.isNil(self.model.productSourceCode)) {
            self.model.productSourceCode = self.productSources[0].code;
          }
        }
        self.stateModel = self.productFilterStateModel;
      }

      function setupProductSources() {
        var productSources = [];
        if (self.stateModel.productSource.showProducts) {
          productSources.push(_.cloneDeep(SystemLookupService.productSources.products));
        }
        if (self.stateModel.productSource.showCatalogs) {
          productSources.push(_.cloneDeep(SystemLookupService.productSources.catalogs));
        }
        if (self.stateModel.productSource.showExternalSales) {
          productSources.push(_.cloneDeep(SystemLookupService.productSources.externalSales));
        }
        // Implement when available from SystemLookupService
        // if (self.stateModel.productSource.showConsumptionStatistics) {
        //   productSources.push(_.cloneDeep(SystemLookupService.productSources[3]));
        // }

        self.productSources = productSources;
      }
    }
  }
)();
