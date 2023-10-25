;(
  function() {
    'use strict';

    angular
      .module('app.business-logic.authorization')
      .factory('AuthorizationDisplayLogicManager', AuthorizationDisplayLogicManagerFactory)
    ;

    /* @ngInject */
    function AuthorizationDisplayLogicManagerFactory(
      $log,
      $mdSidenav,
      AuthorizationSearchCriteriaStateModel,
      AuthorizationModelManager,
      AuthorizationStateManager
    ) {
      var self = this;

      var searchCriteriaStateModel;
      var modelManager = AuthorizationModelManager;
      var stateManager = AuthorizationStateManager;

      self.initialize = function initialize() {
        $log.log('AuthorizationDisplayLogicManager.initialize');

        searchCriteriaStateModel = new AuthorizationSearchCriteriaStateModel();
        self.synchronize();
      };

      self.synchronize = function synchronize() {
        computeAuthorizationSearchCriteriaStateModel();
      };

      self.toggleRightPanel = function toggleRightPanel() {
        $mdSidenav('right-side-menu').toggle();
      };

      //
      // authorization search criteria
      //
      function computeAuthorizationSearchCriteriaStateModel() {
        var aStateModel = searchCriteriaStateModel.clone();
        aStateModel.clear.disabled = modelManager.getAuthorizationSearchCriteriaDataModel().isEmpty() && !stateManager.getStateModel().searchCriteriaApplied;
        aStateModel.search.disabled = modelManager.getAuthorizationSearchCriteriaDataModel().isEmpty();
        searchCriteriaStateModel = aStateModel;
      }

      self.getAuthorizationSearchCriteriaStateModel = function getAuthorizationSearchCriteriaStateModel() {
        return searchCriteriaStateModel;
      };

      //
      // authorization list
      //
      function computeAuthorizationListStateModel() {
        // TODO: implement
      }

      return self;
    }
  }
)();
