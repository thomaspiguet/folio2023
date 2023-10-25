(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-search.requisition-criteria')
      .component('requisitionSearchCriteria', requisitionSearchCriteria())
    ;

    function requisitionSearchCriteria() {
      var cdo = {
        templateUrl: 'requisition-search-criteria.template.html',
        controller: RequisitionSearchCriteriaController,
        bindings: {
          dataModel: '<model',
          stateModel: '<',
          viewModel: '<',
          actionHandler: '&',
          editHandler: '&'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionSearchCriteriaController(
      $log,
      $scope,
      RequisitionSearchCriteriaActions,
      UserProfileService
    ) {
      var self = this;
      self.model = undefined;
      self.today = new Date();

      var oldStatusesSelection = [];

      //
      // Life cycle hooks
      //
      self.$onInit = function onInit() {
        self.model = self.dataModel.clone();
      };

      self.$onChanges = function onChanges(changesObj) {
        if (!_.isNil(changesObj.dataModel)) {
          if (!_.isNil(changesObj.dataModel.currentValue)) {
            self.model = changesObj.dataModel.currentValue.clone();
          }
        }
      };

      //
      // Form actions/states
      //

      /**
       * Handle the search mode change
       */
      self.onSearchModeChange = function onSearchModeChange($event) {
        if ($event) {
          $event.preventDefault();
        }
        if (self.model.searchMode === self.dataModel.searchMode) {
          return;
        }
        self.actionHandler({
          obj: {
            action: RequisitionSearchCriteriaActions.onSearchModeChange,
            mode: self.model.searchMode
          }
        });
      };

      /**
       * Launch the search action with current model values
       */
      self.onSearch = function onSearch($event) {
        if ($event) {
          $event.preventDefault();
        }
        self.actionHandler({
          obj: {
            action: RequisitionSearchCriteriaActions.onSearch,
            searchConfiguration: {
              paging: self.viewModel.paging,
              sorting: self.viewModel.sorting,
              clearResults: true
            }
          }
        });
      };

      /**
       * Clear the current search criteria
       */
      self.onClear = function onClear($event) {
        if ($event) {
          $event.preventDefault();
        }
        self.actionHandler({
          obj: {
            action: RequisitionSearchCriteriaActions.onClearCriteria
          }
        });
      };

      self.isSearchDisabled = function isSearchDisabled() {
        if (!_.isNil(self.stateModel)) {
          return self.stateModel.search.disabled || $scope.requisitionSearchForm.$invalid;
        }
        return false;
      };

      self.isClearDisabled = function isClearDisabled() {
        if (!_.isNil(self.stateModel)) {
          // Consider state model value only if form is valid or pristine, otherwise button should be enabled
          if ($scope.requisitionSearchForm.$valid || $scope.requisitionSearchForm.$pristine) {
            return self.stateModel.clear.disabled;
          }
        }
        return false;
      };

      self.isIncludeExternalSales = function isIncludeExternalSales() {
        return UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canDoExternalSaleRequisition;
      };      
      
      //
      // Value change handlers
      //
      self.onRequisitionIdChange = function onRequisitionIdChange() {
        notityModelChange();
      };

      self.onRequisitionStatusChange = function onRequisitionStatusChange() {
        if (_.includes(self.model.statuses, '0') && !_.includes(oldStatusesSelection, '0')) {
          self.model.includeCancelledRequisitions = true;
        }

        oldStatusesSelection = _.clone(self.model.statuses);
        notityModelChange();
      };

      self.onIncludeCancelledRequisitionsChange = function onIncludeCancelledRequisitionsChange() {
        notityModelChange();
      };

      self.onSiteChange = function onSiteChange() {
        notityModelChange();
      };

      self.onDepartmentChange = function onDepartmentChange() {
        notityModelChange();
      };

      self.onRequesterChange = function onRequesterChange() {
        notityModelChange();
      };

      self.onDeliveryLocationChange = function onDeliveryLocationChange() {
        notityModelChange();
      };

      self.onInstallationLocationChange = function onInstallationLocationChange() {
        notityModelChange();
      };

      self.onCreatedOnFromChange = function onCreatedOnFromChange() {
        notityModelChange();
      };

      self.onCreatedOnToChange = function onCreatedOnToChange() {
        notityModelChange();
      };

      self.onRequisitionTypeChange = function onRequisitionTypeChange() {
        notityModelChange();
      };

      self.onClientChange = function onClientChange() {
        notityModelChange();
      };

      self.onProductCodeChange = function onProductCodeChange() {
        notityModelChange();
      };

      self.onProductDescriptionChange = function onProductDescriptionChange() {
        notityModelChange();
      };

      self.onStoreChange = function onStoreChange() {
        notityModelChange();
      };

      self.onOrderIdChange = function onOrderIdChange() {
        notityModelChange();
      };

      self.onItemStatusChange = function onItemStatusChange() {
        notityModelChange();
      };

      function notityModelChange() {
        self.editHandler({
          obj: {
            model: self.model
          }
        });
      }
    }
  }
)();
