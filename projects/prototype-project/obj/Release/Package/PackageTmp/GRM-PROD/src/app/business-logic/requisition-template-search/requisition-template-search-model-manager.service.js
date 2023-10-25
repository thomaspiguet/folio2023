(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-template-search')
      .factory('RequisitionTemplateSearchModelManager', RequisitionTemplateSearchModelManagerFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateSearchModelManagerFactory(
        $log,
        CriteriaDataModel,
        HeaderListDataModel,
        ProductListDataModel,
        ViewModel
      ) {

      var self = this;

      var criteriaDataModel, pristineCriteriaDataModel, initialCriteriaDataModel;
      var productListDataModel;
      var headerListDataModel;
      var viewModel;

      self.initialize = function initialize(obj) {
        criteriaDataModel = new CriteriaDataModel(obj);
        viewModel = new ViewModel(obj);
        self.resetHeaderListDataModel(obj);
        self.resetProductListDataModel(obj);
        self.setInitialCriteriaDataModel();
        self.setPristineCriteriaDataModel();
      };

      self.clearResults = function clearResults() {
        headerListDataModel = new HeaderListDataModel();
        productListDataModel = new ProductListDataModel();
      };

      //
      // Criteria
      //
      self.synchronizeCriteriaModel = function synchronizeCriteriaModel(model) {
        criteriaDataModel = criteriaDataModel.copy(model);
      };
      self.getCriteriaDataModel = function getCriteriaDataModel() {
        return criteriaDataModel;
      };
      self.changeSearchMode = function changeSearchMode(mode) {
        var aModel = criteriaDataModel.clone();
        aModel.searchMode = mode;
        criteriaDataModel = aModel;
        pristineCriteriaDataModel = new CriteriaDataModel();
      };
      self.isPristineCriteriaDataModel = function isPristineCriteriaDataModel() {
        return pristineCriteriaDataModel.equals(criteriaDataModel);
      };
      self.setPristineCriteriaDataModel = function setPristineCriteriaDataModel() {
        pristineCriteriaDataModel = criteriaDataModel.clone();
      };
      self.getInitialCriteriaDataModel = function getInitialCriteriaDataModel() {
        return initialCriteriaDataModel;
      };
      self.setInitialCriteriaDataModel = function setInitialCriteriaDataModel() {
        initialCriteriaDataModel = criteriaDataModel.clone();
      };
      self.isEmptyCriteriaDataModel = function isEmptyCriteriaDataModel() {
        return criteriaDataModel.isEmpty();
      };
      self.resetCriteriaDataModel = function resetCriteriaDataModel() {
        criteriaDataModel = new CriteriaDataModel();
      };

      //
      // View model
      //
      self.synchronizeViewModel = function synchronizeViewModel(payload) {
        var aModel = viewModel.clone();
        aModel.paging.total = payload.count;
        viewModel = aModel;
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

      self.getRequisitionTemplateSearchViewModel = function getRequisitionTemplateSearchViewModel() {
        return viewModel;
      };
      //
      // Product list
      //
      self.synchronizeProductListDataModel = function synchronizeProductListDataModel(payload) {
        var aModel = new ProductListDataModel();

        _.forEach(payload.items, function iterator(instance) {
          var productResultInstance = aModel.newProductResultInstance();

          productResultInstance.department = instance.department;
          productResultInstance.distributionUnit = instance.distributionUnit;
          productResultInstance.isActive = instance.isActive;
          productResultInstance.isAutomaticGeneration = instance.isAutomaticGeneration;
          productResultInstance.isProductInvalid = instance.isProductInvalid;
          productResultInstance.productCode = instance.productCode;
          productResultInstance.productDescription = instance.productDescription;
          productResultInstance.productInvalidityReason = instance.productInvalidityReason;
          productResultInstance.site = instance.site;
          productResultInstance.store = instance.store;
          productResultInstance.templateDescription = instance.templateDescription;
          productResultInstance.templateId = instance.templateId;
          productResultInstance.templateItemId = instance.templateItemId;

          aModel.products.push(productResultInstance);
        });

        aModel.totalCount = payload.count;

        productListDataModel = aModel;
      };
      self.resetProductListDataModel = function resetProductListDataModel(obj) {
        productListDataModel = new ProductListDataModel(obj);
      };
      self.getProductListDataModel = function getProductListDataModel() {
        return productListDataModel;
      };

      //
      // Header list
      //
      self.synchronizeHeaderListDataModel = function synchronizeHeaderListDataModel(payload) {
        var aModel = new HeaderListDataModel();

        _.forEach(payload.items, function iterator(instance) {
          var headerResultInstance = aModel.newHeaderResultInstance();
          headerResultInstance.address = instance.address;
          headerResultInstance.department = instance.department;
          headerResultInstance.isActive = instance.isActive;
          headerResultInstance.isAutomaticGeneration = instance.isAutomaticGeneration;
          headerResultInstance.requester = instance.requester;
          headerResultInstance.site = instance.site;
          headerResultInstance.templateDescription = instance.templateDescription;
          headerResultInstance.templateId = instance.templateId;

          aModel.headers.push(headerResultInstance);
        });

        aModel.totalCount = payload.count;

        headerListDataModel = aModel;
      };
      self.resetHeaderListDataModel = function resetHeaderListDataModel(obj) {
        headerListDataModel = new HeaderListDataModel(obj);
      };
      self.getHeaderListDataModel = function getHeaderListDataModel() {
        return headerListDataModel;
      };

      return self;
    }
  }
)();
