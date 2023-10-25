(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-authorization.authorization-search-criteria')
      .component('authorizationSearchCriteria', authorizationSearchCriteria())
    ;

    function authorizationSearchCriteria() {
      var cdo = {
        templateUrl: 'authorization-search-criteria.template.html',
        controller: AuthorizationSearchCriteriaController,
        bindings: {
          dataModel: '<model',
          stateModel: '<',
          // viewModel: '<',
          actionHandler: '&',
          editHandler: '&'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function AuthorizationSearchCriteriaController(AuthorizationSearchCriteriaActions) {
      var self = this;
      self.model = undefined;
      self.today = new Date();

      self.$onInit = function $onInit() {
        self.model = self.dataModel.clone();
      };

      self.$onChanges = function $onChanges(changesObj) {
        if (!_.isNil(changesObj.dataModel)) {
          if (!_.isNil(changesObj.dataModel.currentValue)) {
            self.model = changesObj.dataModel.currentValue.clone();
          }
        }
      };

      self.onApplySearchCriteria = function onApplySearchCriteria($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: AuthorizationSearchCriteriaActions.onSearch
          }
        });
      };

      self.onClearSearchCriteria = function onClearSearchCriteria($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: AuthorizationSearchCriteriaActions.onClear
          }
        });
      };

      self.onCloseSearchCriteria = function onCloseSearchCriteria($event) {
        if ($event) {
          $event.preventDefault();
        }
        toggleSidePanel();
      };

      self.onRequisitionIdChange = function onRequisitionIdChange() {
        notifyModelChange();
      };

      self.onRequisitionRequesterChange = function onRequisitionRequesterChange() {
        notifyModelChange();
      };

      self.onRequiredOnFromChange = function onRequiredOnFromChange() {
        notifyModelChange();
      };

      self.onRequiredOnToChange = function onRequiredOnToChange() {
        notifyModelChange();
      };

      self.onToAuthorizeSinceChange = function onToAuthorizeSinceChange() {
        notifyModelChange();
      };

      function notifyModelChange() {
        self.editHandler({
          obj: {
            payload: {
              searchCriteria: self.model
            }
          }
        });
      }

      /**
       * Side panel toggler
       */
      function toggleSidePanel() {
        self.actionHandler({
          obj: {
            action: AuthorizationSearchCriteriaActions.togglePanel
          }
        });
      }

    }
  }
)();
