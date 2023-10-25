(
  function () {
    'use strict';

    angular
      .module('app.layout.requisition-authorization')
      .factory('RequisitionAuthorizationDispatcher', RequisitionAuthorizationDispatcherFactory)
      ;

    /* @ngInject */
    function RequisitionAuthorizationDispatcherFactory(
      $log,
      $state,
      NotificationHandler,
      AuthorizationBusinessLogic,
      AuthorizationDisplayLogicManager,
      AuthorizationListActions,
      AuthorizationAmountRangeActions,
      AuthorizationActionsActions,
      AuthorizationActionsStates,
      AuthorizationSearchCriteriaActions,
      AuthorizationModelManager,
      AuthorizationStateManager,
      InteractionModes,
      PopupService
    ) {

      var self = this;
      var businessLogic = AuthorizationBusinessLogic;
      var displayLogic = AuthorizationDisplayLogicManager;
      var modelManager = AuthorizationModelManager;
      var stateManager = AuthorizationStateManager;
      var authorizeProcessState = AuthorizationActionsStates.idle;
      var refuseProcessState = AuthorizationActionsStates.idle;

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          clearState: false,
          amountRangeId: undefined
        }, configParams);

        // Init state manager
        stateManager.initialize(config);

        // Init model manager
        modelManager.initialize(config);

        // Init display logic manager
        displayLogic.initialize({
          //
        });

        // Init business logic manager
        businessLogic.initialize({
          notify: self.notificationHandler
        });
      };

      self.notificationHandler = function notificationHandler(configObj) {
        if (_.isNil(configObj) || _.isNil(configObj.event)) {
          return;
        }
        var urlParams;
        switch (configObj.event) {
          case AuthorizationBusinessLogic.Events.AUTHORIZED:
          case AuthorizationBusinessLogic.Events.DECLINED: {
            break;
          }
        }
      };

      self.getAuthorizationViewModel = function getAuthorizationViewModel() {
        return modelManager.getViewModel();
      };

      self.getAuthorizationStateModel = function getAuthorizationStateModel() {
        return stateManager.getStateModel();
      };

      //
      // authorization actions
      //
      self.getAuthorizeProcessState = function getAuthorizeProcessState() {
        return authorizeProcessState;
      };

      self.getRefuseProcessState = function getRefuseProcessState() {
        return refuseProcessState;
      };

      self.authorizationActionsActionHandler = function authorizationActionsActionHandler(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (AuthorizationActionsActions.onAuthorize === action) {
            // Request confirmation if more than 1 group to be authorized...
            if (self.getAuthorizationSelectedCount() > 1) {
              NotificationHandler.confirm({
                messageOrKey: 'confirmRequisitionAuthorizationMsg',
                btnAction: 'authorizeAction'
              }).then(function success() {
                processAcceptAuthorizations();
              });
            }
            else {
              processAcceptAuthorizations();
            }
          }
          else if (AuthorizationActionsActions.onRefuse === action) {
            PopupService.inputDialog({
              title: 'refuse',
              content: {
                type: 'textarea',
                msg: 'pleaseEnterRefusalReasonMsg',
                maxLength: 2000,
                required: true
              },
              btnAction: 'refuseAction'
            }).result.then(
              function success(data) {
                processRefuseAuthorizations(data.inputValue);
              }
            );
          }
          else {
            $log.warn('Unknown action [' + action + ']');
          }
        }
      };

      self.getAuthorizationSelectedCount = function getAuthorizationSelectedCount() {
        return stateManager.getSelectionCount();
      };

      function processAcceptAuthorizations() {
        authorizeProcessState = AuthorizationActionsStates.inProgress;
        businessLogic.authorizeSelectedAuthorizations()
          .then(
            function success(response) {
              authorizeProcessState = AuthorizationActionsStates.completed;
            },
            function failure(reason) {
            }
          );
      }

      function processRefuseAuthorizations(note) {
        refuseProcessState = AuthorizationActionsStates.inProgress;
        businessLogic.refuseSelectedAuthorizations(note)
          .then(
            function success(response) {
              refuseProcessState = AuthorizationActionsStates.completed;
            },
            function failure(reason) {
            }
          );
      }

      //
      // authorization amnount range
      //
      self.getAuthorizationAmountRangeDataModel = function getAuthorizationAmountRangeDataModel() {
        return modelManager.getAuthorizationAmountRangeDataModel();
      };

      self.authorizationAmountRangeActionHandler = function authorizationAmountRangeActionHandler(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (AuthorizationAmountRangeActions.onRangeSelectedChanged === action) {
            businessLogic.onFilterAuthorizationRequisitionGroups(obj.model);
          }
          else if (AuthorizationAmountRangeActions.onTechnicalsSelectedChanged === action) {
            businessLogic.onFilterAuthorizationRequisitionGroups(obj.model);
          }
          else if (AuthorizationAmountRangeActions.onGetAmountRangeFilterGroups === action) {
            businessLogic.fetchAuthorizationAmountRangeFilterGroups();
          }
          else {
            $log.warn('Unknown action [' + action + ']');
          }
        }
      };

      //
      // search criteria
      //
      self.getSearchCriteriaDataModel = function getSearchCriteriaDataModel() {
        return modelManager.getAuthorizationSearchCriteriaDataModel();
      };

      self.getSearchCriteriaStateModel = function getSearchCriteriaStateModel() {
        return displayLogic.getAuthorizationSearchCriteriaStateModel();
      };

      self.searchCriteriaActionHandler = function searchCriteriaActionHandler(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (AuthorizationSearchCriteriaActions.togglePanel === action) {
            displayLogic.toggleRightPanel();
          }
          else if (AuthorizationSearchCriteriaActions.onSearch === action) {
            businessLogic.onSearchAuthorizationRequisitionGroups();
          }
          else if (AuthorizationSearchCriteriaActions.onClear === action) {
            businessLogic.onClearSearchCriteria();
          }
          else {
            $log.warn('Unknown action [' + action + ']');
          }
        }
      };

      self.searchCriteriaEditHandler = function searchCriteriaEditHandler(obj) {
        if (!_.isNil(obj.payload)) {
          businessLogic.synchronizeSearchCriteria(obj.payload);
        }
      };

      //
      // authorization list
      //
      self.getAuthorizationListDataModel = function getAuthorizationListDataModel() {
        return modelManager.getAuthorizationListDataModel();
      };

      self.authorizationListActionHandler = function authorizationListActionHandler(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (AuthorizationListActions.toggleAuthorizationProductLines === action) {
            businessLogic.expandOneAuthorization(obj.payload);
          }
          else if (AuthorizationListActions.toggleAuthorizationRelatedAuthorizations === action) {
            businessLogic.expandOneAssociatedAuthorizationSection(obj.payload);
          }
          else if (AuthorizationListActions.fetchAuthorizationRequisitionGroups === action) {
            businessLogic.fetchAuthorizationRequisitionGroups();
          }
          else if (AuthorizationListActions.toggleAuthorizationSelection === action || AuthorizationListActions.toggleAuthorizationListSelection === action) {
            businessLogic.onAuthorizationSelection(obj.payload);
          }
          else if (AuthorizationListActions.sortAuthorizationList === action) {
            businessLogic.onSortAuthorizationRequisitionGroups(obj.payload);
          }
          else if (AuthorizationListActions.toggleSearchCriteria === action) {
            displayLogic.toggleRightPanel();
          }
          else if (AuthorizationListActions.onScrollAuthorizationList === action) {
            businessLogic.onScrollAuthorizationList(obj.payload);
          }
          else if (AuthorizationListActions.onRowSelection === action) {
            businessLogic.onRowSelection(obj.payload);
          }
          else {
            $log.warn('Unknown action [' + action + ']');
          }
        }
      };

      return self;
    }
  }
)();
