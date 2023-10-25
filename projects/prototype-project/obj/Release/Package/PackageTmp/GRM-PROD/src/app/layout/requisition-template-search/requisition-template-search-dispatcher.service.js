(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template-search')
      .factory('RequisitionTemplateSearchDispatcher', RequisitionTemplateSearchDispatcher)
    ;

    /* @ngInject */
    function RequisitionTemplateSearchDispatcher(
      $log,
      RequisitionTemplateCriteriaActions,
      RequisitionTemplateHeaderListActions,
      RequisitionTemplateProductListActions,
      RequisitionTemplateSearchBusinessLogic,
      RequisitionTemplateSearchDisplayLogicManager,
      RequisitionTemplateSearchModelManager,
      RequisitionTemplateSearchStateManager
    ) {

      var self = this;

      var businessLogic = RequisitionTemplateSearchBusinessLogic;
      var displayLogic = RequisitionTemplateSearchDisplayLogicManager;
      var modelManager = RequisitionTemplateSearchModelManager;
      var stateManager = RequisitionTemplateSearchStateManager;

      // (re) initialize this service to its default state
      self.initialize = function initialize(configParams) {
        var config = _.extend({
          clearState: false
        }, configParams);

        // Init state manager
        stateManager.initialize(config);

        // Init model manager
        modelManager.initialize(stateManager.getRequisitionTemplateSearchStateModel());

        // Init business logic manager
        businessLogic.initialize({
          notify: self.notificationHandler
        });

        // Init display logic manager
        displayLogic.initialize({
          //
        });
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

      self.getRequisitionTemplateSearchViewModel = function getRequisitionTemplateSearchViewModel() {
        return modelManager.getRequisitionTemplateSearchViewModel();
      };

      self.onStateChange = function onStateChange(obj) {
        stateManager.updateState(obj);
      };

      self.getStateModel = function getStateModel() {
        return stateManager.getRequisitionTemplateSearchStateModel();
      };

      //
      // Search criteria
      //
      self.getCriteriaDataModel = function getCriteriaDataModel() {
        return modelManager.getCriteriaDataModel();
      };
      self.getCriteriaStateModel = function getCriteriaStateModel() {
        return displayLogic.getCriteriaStateModel();
      };
      self.onCriteriaAction = function onCriteriaAction(obj) {
        var action = obj.action;
        if (!_.isNil(obj.action)) {
          if (RequisitionTemplateCriteriaActions.onSearchModeChange === obj.action) {
            businessLogic.onSearchModeChange(obj.mode);
          }
          else if (RequisitionTemplateCriteriaActions.onSearch === obj.action) {
            businessLogic.onSearch(obj.searchConfiguration);
          }
          else if (RequisitionTemplateCriteriaActions.onClearCriteria === obj.action) {
            businessLogic.onClearSearchCriteria();
          }
        }
      };
      self.onCriteriaEdit = function onCriteriaEdit(obj) {
        var model = obj.model;
        if (!_.isNil(model)) {
          businessLogic.synchronizeSearchCriteria(obj.model);
        }
      };
      //
      // Header list
      //
      self.getHeaderListDataModel = function getHeaderListDataModel() {
        return modelManager.getHeaderListDataModel();
      };
      self.getHeaderListStateModel = function getHeaderListStateModel() {
        return displayLogic.getHeaderListStateModel();
      };
      self.headerListActionHandler = function headerListActionHandler(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (RequisitionTemplateHeaderListActions.onSort === action) {
            businessLogic.onListSort(obj.searchConfiguration);
          }
          else if (RequisitionTemplateHeaderListActions.onPage === action) {
            businessLogic.onListPage(obj.searchConfiguration);
          }
        }
      };

      //
      // Product list
      //
      self.getProductListDataModel = function getProductListDataModel() {
        return modelManager.getProductListDataModel();
      };
      self.getProductListStateModel = function getProductListStateModel() {
        return displayLogic.getProductListStateModel();
      };
      self.productListActionHandler = function productListActionHandler(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (RequisitionTemplateProductListActions.onSort === action) {
            businessLogic.onListSort(obj.searchConfiguration);
          }
          else if (RequisitionTemplateHeaderListActions.onPage === action) {
            businessLogic.onListPage(obj.searchConfiguration);
          }
        }
      };
      return this;
    }
  }
)();
