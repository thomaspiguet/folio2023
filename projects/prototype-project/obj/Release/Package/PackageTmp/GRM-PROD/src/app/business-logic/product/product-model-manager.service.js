(
  function() {
    'use strict';

    angular
      .module('app.business-logic.product')
      .factory('ProductModelManager', ProductModelManagerFactory)
    ;

    /* @ngInject */
    function ProductModelManagerFactory(
        $log,
        ProductCartModel,
        ProductFilterModel,
        ProductListModel,
        ProductObjectService,
        ProductViewModel,
        SystemLookupService
      ) {

      var self = this;
      var productCartModel;
      var productFilterModel;
      var productLastFilterModel;
      var productListModel;
      var viewModel;
      var pristineProductFilterModel;
      var productParamModel;

      self.initialize = function initialize(obj) {
        viewModel = new ProductViewModel();
        productFilterModel = new ProductFilterModel();
        pristineProductFilterModel = new ProductFilterModel(productFilterModel);
        productListModel = new ProductListModel();
        productCartModel = new ProductCartModel();

        if (obj && obj.configParams) {
          self.synchronizeProductParamModel(obj.configParams);
        }
      };

      //
      // View model
      //
      self.getViewModel = function getViewModel() {
        return viewModel;
      };

      self.synchronizeViewModel = function synchronizeViewModel(payload) {
        var aModel = viewModel.clone();
        aModel.paging.total = payload.count;
        viewModel = aModel;
      };

      //
      // Product param model
      //
      self.synchronizeProductParamModel = function synchronizeProductParamModel(payload) {
        productParamModel = payload || {};
      };

      self.getProductParamModel = function getProductParamModel() {
        return productParamModel;
      };

      self.synchronizeViewModelSorting = function synchronizeViewModelSorting(searchConfig) {
        if (!searchConfig.sorting) {
          return;
        }

        var aModel = viewModel.clone();
        aModel.sorting.by = searchConfig.sorting.by;
        aModel.sorting.descending = searchConfig.sorting.descending;

        if (searchConfig.paging && !_.isNil(searchConfig.paging.offset)) {
          aModel.paging.offset = searchConfig.paging.offset;
        }

        viewModel = aModel;
      };

      self.synchronizeViewModelPaging = function synchronizeViewModelPaging(searchConfig) {
        if (!searchConfig.paging) {
          return;
        }

        var aModel = viewModel.clone();
        if (searchConfig.paging) {
          aModel.paging.offset = searchConfig.paging.offset;
        }

        if (searchConfig.clearResults) {
          aModel.paging.offset = 0;
        }

        viewModel = aModel;
      };

      self.getProductFilterModel = function getProductFilterModel() {
        return productFilterModel;
      };

      self.getProductLastFilterModel = function getProductLastFilterModel() {
        return productLastFilterModel;
      };

      self.getPristineProductFilterModel = function getPristineProductFilterModel() {
        return pristineProductFilterModel;
      };

      self.getProductListModel = function getProductListModel() {
        return productListModel;
      };

      self.getProductCartModel = function getProductCartModel() {
        return productCartModel;
      };

      self.getProductCartItemsIds = function getProductCartItemsIds() {
        var result = [];
        productCartModel.items.forEach(function(item) {
          result.push(item.id);
        });

        return result;
      };

      self.synchronizeProductFilterModel = function synchronizeProductFilterModel(model) {
        var aModel = model.clone();

        // If product source has changed...
        if (aModel.productSourceCode !== productFilterModel.productSourceCode) {

          // ... clear list results
          self.clearProductListModel();

          // ... determine if values of the new model should be cleared, based on the new product source

          if (SystemLookupService.productSources.catalogs.code === aModel.productSourceCode) {
            aModel.name = undefined;
          }
          if (SystemLookupService.productSources.externalSales.code === aModel.productSourceCode) {
            aModel.vendor = undefined;
            aModel.vendorProductCode = undefined;
            aModel.vendorProductDescription = undefined;
            aModel.manufacturer = undefined;
            aModel.manufacturerProductCode = undefined;
            aModel.gtinCode = undefined;
            aModel.brand = undefined;
            aModel.homologationClass = undefined;
            aModel.homologationNumber = undefined;
            aModel.contractNumber = undefined;
          }
        }
        productFilterModel = aModel;
      };

      self.synchronizeProductListModel = function synchronizeProductListModel(payload) {
        var aModel = new ProductListModel();

        _.forEach(payload.items, function iterator(instance) {
          var productResultInstance = aModel.newProductResultInstance();

          productResultInstance.id = instance.id;
          productResultInstance.catalogId = instance.catalogId;
          productResultInstance.code = instance.code;
          productResultInstance.description = instance.description;
          productResultInstance.productDescription = instance.productDescription;
          productResultInstance.formatId = instance.formatId;
          productResultInstance.formatDescription = instance.formatDescription;
          productResultInstance.price = instance.price;
          productResultInstance.unspscClassification = instance.unspscClassification;
          productResultInstance.buyerId = instance.buyerId;
          productResultInstance.isPermitted = instance.isPermitted;
          productResultInstance.type = instance.type;
          productResultInstance.isAssociatedToEstablishment = instance.isAssociatedToEstablishment;
          productResultInstance.manufacturer = instance.manufacturer;
          productResultInstance.supplier = instance.supplier;
          productResultInstance.supplierItemCode = instance.supplierItemCode;

          // Disable products present in params model
          if (productParamModel && productParamModel.productIds) {
            productResultInstance.disabled = _.indexOf(productParamModel.productIds, instance.id) > -1;
          }

          // Disable products currently in product cart (not card...), taking into account if it is already disabled
          if (productCartModel && productCartModel.items.length) {
            productResultInstance.disabled = productResultInstance.disabled || _.findIndex(productCartModel.items, function iteratee(item) {
              return item.id === instance.id && item.catalogId !== instance.catalogId;
            }) > -1;
          }

          aModel.products.push(productResultInstance);
        });

        aModel.totalCount = payload.count;

        productListModel = aModel;
      };

      self.saveProductFilterModel = function saveProductFilterModel() {
         productLastFilterModel = _.extend(productLastFilterModel, productFilterModel);
      };

      self.clearProductListModel = function clearProductListModel() {
        productListModel = new ProductListModel();
      };

      self.clearProductFilterModel = function clearProductFilterModel() {
        var aModel = new ProductFilterModel();
        aModel.productSourceCode = productFilterModel.productSourceCode;
        productFilterModel = aModel;
      };

      self.synchronizeProductCartModel = function synchronizeProductCartModel(model) {
        productCartModel = model.clone();
      };

      self.removeProductCartItem = function removeProductCartItem(item) {
        var items = _.filter(productCartModel.items, function filter(i) {
          return i.id !== item.id;
        });
        productCartModel = productCartModel.clone();
        productCartModel.items = items;
        return productCartModel;
      };

      self.clearProductCart = function clearProductCart() {
        productCartModel = new ProductCartModel();
        return productCartModel;
      };

      self.addOrRemoveProductCartItem = function addOrRemoveProductCartItem(item) {
        var items = _.filter(productCartModel.items, function filter(i) {
          return i.id !== item.id;
        });
        productCartModel = productCartModel.clone();
        var selected = true;
        if (productCartModel.items.length === items.length) {
          productCartModel.items.push(item);
        }
        else {
          selected = false;
          productCartModel.items = items;
        }

        reviewProductListItemsAvailabilityState(item, selected);

        return productCartModel;
      };

      function reviewProductListItemsAvailabilityState(item, selected) {
        _.forEach(productListModel.products, function onProducts(product) {
          if (product.code === item.code && product.catalogId && product.catalogId !== item.catalogId) {
            product.disabled = selected;
          }
        });
      }

      return this;
    }
  }
)();
