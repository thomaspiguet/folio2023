(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-search')
      .factory('RequisitionSearchModelManager', RequisitionSearchModelManagerFactory)
    ;

    /* @ngInject */
    function RequisitionSearchModelManagerFactory(
        $log,
        $filter,
        DynamicLookupService,
        RequisitionSearchCriteriaDataModel,
        RequisitionSearchHeaderDetailDataModel,
        RequisitionSearchHeaderListDataModel,
        RequisitionSearchProductListDataModel,
        RequisitionSearchProductDetailDataModel,
        RequisitionSearchViewModel
      ) {

      var self = this;

      var criteriaDataModel, pristineCriteriaDataModel, initialCriteriaDataModel, viewModel;
      var productListDataModel;
      var productDetailDataModel;
      var headerListDataModel;
      var headerDetailDataModel;

      self.initialize = function initialize(obj) {
        criteriaDataModel = new RequisitionSearchCriteriaDataModel(obj);
        viewModel = new RequisitionSearchViewModel(obj);
        self.resetHeaderListDataModel(obj);
        self.resetHeaderDetailDataModel();
        self.resetProductListDataModel(obj);
        self.resetProductDetailDataModel();
        self.setInitialCriteriaDataModel();
        self.setPristineCriteriaDataModel();
      };

      self.clearResults = function clearResults() {
        headerListDataModel = new RequisitionSearchHeaderListDataModel();
        headerDetailDataModel = new RequisitionSearchHeaderDetailDataModel();
        productListDataModel = new RequisitionSearchProductListDataModel();
        productDetailDataModel = new RequisitionSearchProductDetailDataModel();
      };

      self.getRequisitionSearchViewModel = function getRequisitionSearchViewModel() {
        return viewModel;
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
        pristineCriteriaDataModel = new RequisitionSearchCriteriaDataModel();

        viewModel = new RequisitionSearchViewModel();
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
        criteriaDataModel = new RequisitionSearchCriteriaDataModel();
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

      //
      // Product list
      //
      self.synchronizeProductListDataModel = function synchronizeProductListDataModel(payload) {
        var aModel = new RequisitionSearchProductListDataModel();

        _.forEach(payload.items, function iterator(instance) {
          var productResultInstance = aModel.newProductResultInstance();

          productResultInstance.amount = instance.amount;
          productResultInstance.department = instance.department;
          productResultInstance.formatDescription = instance.formatDescription;
          productResultInstance.headerStatusCode = instance.headerStatusCode;
          productResultInstance.productCode = instance.productCode;
          productResultInstance.productDescription = instance.productDescription;
          productResultInstance.quantity = instance.quantity;
          productResultInstance.requisitionDate = instance.requisitionDate;
          productResultInstance.requisitionId = instance.requisitionId;
          productResultInstance.requisitionItemId = instance.requisitionItemId;
          productResultInstance.site = instance.site;
          productResultInstance.statusDescription = instance.statusDescription;
          productResultInstance.store = instance.store;

          aModel.products.push(productResultInstance);
        });

        aModel.totalCount = payload.count;

        productListDataModel = aModel;
      };
      self.resetProductListDataModel = function resetProductListDataModel(payload) {
        productListDataModel = new RequisitionSearchProductListDataModel(payload);
      };
      self.getProductListDataModel = function getProductListDataModel() {
        return productListDataModel;
      };

      //
      // Product detail
      //
      self.synchronizeProductDetailDataModel = function synchronizeProductDetailDataModel(payload) {
        var aModel = new RequisitionSearchProductDetailDataModel(payload);
        productDetailDataModel = aModel;
      };
      self.resetProductDetailDataModel = function resetProductDetailDataModel() {
        productDetailDataModel = new RequisitionSearchProductDetailDataModel();
      };
      self.getProductDetailDataModel = function getProductDetailDataModel() {
        return productDetailDataModel;
      };

      //
      // Header list
      //
      self.synchronizeHeaderListDataModel = function synchronizeHeaderListDataModel(payload) {
        var aModel = new RequisitionSearchHeaderListDataModel();

        _.forEach(payload.items, function iterator(instance) {
          var headerResultInstance = aModel.newHeaderResultInstance();
          headerResultInstance.amount = instance.amount;
          headerResultInstance.client = instance.client;
          headerResultInstance.deliveryLocation = _.isNil(instance.deliveryLocation) ? null : instance.deliveryLocation.code + '-' + instance.deliveryLocation.description;
          headerResultInstance.department = _.isNil(instance.department) ? null : instance.department.code + '-' + instance.department.description;
          headerResultInstance.requester = instance.requester;
          headerResultInstance.requisitionDate = $filter('localeDate')(new Date(instance.requisitionDate));
          headerResultInstance.requisitionId = instance.requisitionId;
          headerResultInstance.site = _.isNil(instance.site) ? null : instance.site.code;
          headerResultInstance.statusCode = instance.statusCode;
          headerResultInstance.statusDescription = instance.statusDescription;

          aModel.headers.push(headerResultInstance);
        });

        aModel.totalCount = payload.count;

        headerListDataModel = aModel;
      };
      self.resetHeaderListDataModel = function resetHeaderListDataModel(payload) {
        headerListDataModel = new RequisitionSearchHeaderListDataModel(payload);
      };
      self.getHeaderListDataModel = function getHeaderListDataModel() {
        return headerListDataModel;
      };

      //
      // Header detail
      //
      self.synchronizeHeaderDetailDataModel = function synchronizeHeaderDetailDataModel(payload) {
        var aModel = new RequisitionSearchHeaderDetailDataModel(payload);
        headerDetailDataModel = aModel;
      };
      self.resetHeaderDetailDataModel = function resetHeaderDetailDataModel() {
        headerDetailDataModel = new RequisitionSearchHeaderDetailDataModel();
      };
      self.getHeaderDetailDataModel = function getHeaderDetailDataModel() {
        return headerDetailDataModel;
      };

      return self;
    }
  }
)();
