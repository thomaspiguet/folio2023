(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-search')
      .factory('RequisitionSearchDispatcher', RequisitionSearchDispatcher)
    ;

    /* @ngInject */
    function RequisitionSearchDispatcher(
      $log,
      $q,
      RequisitionSearchCriteriaActions,
      RequisitionSearchHeaderListActions,
      RequisitionSearchProductListActions,
      RequisitionSearchBusinessLogic,
      RequisitionSearchDisplayLogicManager,
      RequisitionSearchModelManager,
      RequisitionSearchStateManager
    ) {

      var self = this;

      var businessLogic = RequisitionSearchBusinessLogic;
      var displayLogic = RequisitionSearchDisplayLogicManager;
      var modelManager = RequisitionSearchModelManager;
      var stateManager = RequisitionSearchStateManager;

      // (re) initialize this service to its default state
      self.initialize = function initialize(configParams) {
        var config = _.extend({
          clearState: false
        }, configParams);

        // Init state manager
        stateManager.initialize(config);

        // Init model manager
        modelManager.initialize(stateManager.getRequisitionSearchStateModel());

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

      self.getRequisitionSearchViewModel = function getRequisitionSearchViewModel() {
        return modelManager.getRequisitionSearchViewModel();
      };

      self.onStateChange = function onStateChange(obj) {
        stateManager.updateState(obj);
      };

      self.getStateModel = function getStateModel() {
        return stateManager.getRequisitionSearchStateModel();
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
          if (RequisitionSearchCriteriaActions.onSearchModeChange === obj.action) {
            businessLogic.onSearchModeChange(obj.mode);
          }
          else if (RequisitionSearchCriteriaActions.onSearch === obj.action) {
            businessLogic.onSearch(obj.searchConfiguration);
          }
          else if (RequisitionSearchCriteriaActions.onClearCriteria === obj.action) {
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
        // return true;
        return displayLogic.getHeaderListStateModel();
      };
      self.headerListActionHandler = function headerListActionHandler(obj) {
        var action = obj.action;
        var deffered = $q.defer();

        if (!_.isNil(action)) {
          if (RequisitionSearchHeaderListActions.onSort === action) {
            businessLogic.onListSort(obj.searchConfiguration);
            deffered.resolve();
          }
          else if (RequisitionSearchHeaderListActions.onPage === action) {
            businessLogic.onListPage(obj.searchConfiguration);
            deffered.resolve();
          }
          else if (RequisitionSearchHeaderListActions.onRowSelect === action) {
            businessLogic.updateHeaderDetailSection(obj.id);
            deffered.resolve();
          }
          else if (RequisitionSearchHeaderListActions.onToggleDetailSection === action) {
            businessLogic
              .updateHeaderDetailSection(obj.id)
              .then(
                function success(response) {
                  deffered.resolve();
                },
                function failure(reason) {
                  deffered.reject(reason);
                }
              );
          }
          else {
            deffered.reject('Unsupported action');
          }
        }
        else {
          deffered.reject('Undefined action');
        }

        return deffered.promise;
      };

      //
      // Header Detail
      //
      self.getHeaderDetailDataModel = function getHeaderDetailDataModel() {
        return modelManager.getHeaderDetailDataModel();
      };

      self.getHeaderDetailStateModel = function getHeaderDetailStateModel() {
        return displayLogic.getHeaderDetailStateModel();
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
        var deffered = $q.defer();

        if (!_.isNil(action)) {
          if (RequisitionSearchProductListActions.onSort === action) {
            businessLogic.onListSort(obj.searchConfiguration);
            deffered.resolve();
          }
          else if (RequisitionSearchProductListActions.onPage === action) {
            businessLogic.onListPage(obj.searchConfiguration);
            deffered.resolve();
          }
          else if (RequisitionSearchProductListActions.onRowSelect === action) {
            businessLogic.updateProductDetailSection(obj.id, obj.iid);
            deffered.resolve();
          }
          else if (RequisitionSearchProductListActions.onToggleDetailSection === action) {
            businessLogic
              .updateProductDetailSection(obj.id, obj.iid)
              .then(
                function success(response) {
                  deffered.resolve();
                },
                function failure(reason) {
                  deffered.reject(reason);
                }
              );
          }
          else {
            deffered.reject('Unsupported action');
          }
        }
        else {
          deffered.reject('Undefined action');
        }

        return deffered.promise;
      };

      //
      // Product Detail
      //
      self.getProductDetailDataModel = function getProductDetailDataModel() {
        return modelManager.getProductDetailDataModel();
      };

      self.getProductDetailStateModel = function getProductDetailStateModel() {
        return displayLogic.getProductDetailStateModel();
      };

      return this;
    }
  }
)();
