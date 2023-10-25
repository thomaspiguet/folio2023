(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-template-search')
      .factory('RequisitionTemplateSearchDisplayLogicManager', RequisitionTemplateSearchDisplayLogicManagerFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateSearchDisplayLogicManagerFactory(
      $log,
      CriteriaStateModel,
      HeaderListStateModel,
      ProductListStateModel,
      RequisitionTemplateSearchModelManager,
      RequisitionTemplateSearchStateManager
    ) {
      var self = this;
      var criteriaStateModel;
      var productListStateModel;
      var headerListStateModel;

      var modelManager = RequisitionTemplateSearchModelManager;
      var stateManager = RequisitionTemplateSearchStateManager;

      self.initialize = function initialize(configParams) {
        criteriaStateModel = new CriteriaStateModel();
        productListStateModel = new ProductListStateModel();
        headerListStateModel = new HeaderListStateModel();
        self.synchronize();
      };

      self.synchronize = function synchronize() {
        computeCriteriaState();
        computeProductListStateModel();
        computeHeaderListStateModel();
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
      self.getHeaderListStateModel = function getHeaderListStateModel() {
        return headerListStateModel;
      };

      function computeCriteriaState() {
        var aStateModel = criteriaStateModel.clone();
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

      return self;
    }
  }
)();
