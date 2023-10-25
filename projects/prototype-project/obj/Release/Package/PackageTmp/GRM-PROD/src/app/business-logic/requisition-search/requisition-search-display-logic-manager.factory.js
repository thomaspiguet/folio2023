(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-search')
      .factory('RequisitionSearchDisplayLogicManager', RequisitionSearchDisplayLogicManagerFactory)
    ;

    /* @ngInject */
    function RequisitionSearchDisplayLogicManagerFactory(
      $log,
      RequisitionSearchCriteriaStateModel,
      RequisitionSearchHeaderListStateModel,
      RequisitionSearchHeaderDetailStateModel,
      RequisitionSearchProductListStateModel,
      RequisitionSearchProductDetailStateModel,
      RequisitionSearchModelManager,
      RequisitionSearchStateManager,
      UserProfileService
    ) {
      var self = this;
      var criteriaStateModel;
      var productListStateModel;
      var headerListStateModel;
      var headerDetailStateModel;
      var productDetailStateModel;

      var modelManager = RequisitionSearchModelManager;
      var stateManager = RequisitionSearchStateManager;

      self.initialize = function initialize(configParams) {
        criteriaStateModel = new RequisitionSearchCriteriaStateModel();
        productListStateModel = new RequisitionSearchProductListStateModel();
        headerListStateModel = new RequisitionSearchHeaderListStateModel();
        headerDetailStateModel = new RequisitionSearchHeaderDetailStateModel();
        productDetailStateModel = new RequisitionSearchProductDetailStateModel();
        self.synchronize();
      };

      self.synchronize = function synchronize() {
        computeCriteriaState();
        computeProductListStateModel();
        computeProductDetailStateModel();
        computeHeaderListStateModel();
        computeHeaderDetailStateModel();
      };

      self.synchronizeCriteriaStateModel = function synchronizeCriteriaStateModel(dirty) {
        var aStateModel = criteriaStateModel.clone();
        aStateModel.clear.disabled = !dirty;
        aStateModel.search.disabled = !dirty;
        criteriaStateModel = aStateModel;
      };

      self.setSearchingState = function setSearchingState(state) {
        var aModel;

        aModel = criteriaStateModel.clone();
        aModel.searching = state;
        criteriaStateModel = aModel;

        aModel = headerListStateModel.clone();
        aModel.searching = state;
        headerListStateModel = aModel;

        aModel = headerDetailStateModel.clone();
        aModel.searching = state;
        headerDetailStateModel = aModel;

        aModel = productListStateModel.clone();
        aModel.searching = state;
        productListStateModel = aModel;
      };

      self.getCriteriaStateModel = function getCriteriaStateModel() {
        return criteriaStateModel;
      };
      self.getProductListStateModel = function getProductListStateModel() {
        return productListStateModel;
      };
      self.getProductDetailStateModel = function getProductDetailStateModel() {
        return productDetailStateModel;
      };
      self.getHeaderListStateModel = function getHeaderListStateModel() {
        return headerListStateModel;
      };
      self.getHeaderDetailStateModel = function getHeaderDetailStateModel() {
        return headerDetailStateModel;
      };

      function computeCriteriaState() {
        var aStateModel = criteriaStateModel.clone();
        aStateModel.client.hidden =
          UserProfileService.getCurrentProfile().isDecentralized() &&
          !UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canDoExternalSaleRequisition;
        aStateModel.clear.disabled = modelManager.getCriteriaDataModel().isEmpty();
        criteriaStateModel = aStateModel;
      }

      function computeProductListStateModel() {
        var aModel = productListStateModel.clone();
        aModel.hidden = modelManager.getCriteriaDataModel().searchModes.header === modelManager.getCriteriaDataModel().searchMode;
        productListStateModel = aModel;
      }

      function computeHeaderListStateModel() {
        var aModel = headerListStateModel.clone();
        aModel.hidden = modelManager.getCriteriaDataModel().searchModes.product === modelManager.getCriteriaDataModel().searchMode;
        headerListStateModel = aModel;
      }

      function computeHeaderDetailStateModel() {
        var aModel = headerDetailStateModel.clone();
        var criteria = modelManager.getCriteriaDataModel();
        var headerDetail = modelManager.getHeaderDetailDataModel();
        aModel.hidden = criteria.searchModes.header !== criteria.searchMode;
        if (!aModel.hidden) {
          aModel.hidden = headerListStateModel.detail.hidden;
        }
        headerDetailStateModel = aModel;
      }

      function computeProductDetailStateModel() {
        var aModel = productDetailStateModel.clone();
        var criteria = modelManager.getCriteriaDataModel();
        var productDetail = modelManager.getProductDetailDataModel();
        aModel.hidden = criteria.searchModes.product !== criteria.searchMode;
        if (!aModel.hidden) {
          aModel.hidden = productListStateModel.detail.hidden;
        }
        productDetailStateModel = aModel;
      }

      return self;
    }
  }
)();
