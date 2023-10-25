(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template-search.requisition-template-criteria')
      .component('requisitionTemplateCriteria', requisitionTemplateCriteria())
    ;

    function requisitionTemplateCriteria() {
      var cdo = {
        templateUrl: 'requisition-template-criteria.template.html',
        controller: RequisitionTemplateCriteriaController,
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
    function RequisitionTemplateCriteriaController(
      $log,
      $scope,
      RequisitionTemplateCriteriaActions,
      UserProfileService
    ) {
      var self = this;
      self.model = undefined;

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
            action: RequisitionTemplateCriteriaActions.onSearchModeChange,
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
            action: RequisitionTemplateCriteriaActions.onSearch,
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
            action: RequisitionTemplateCriteriaActions.onClearCriteria
          }
        });
      };

      self.isSearchDisabled = function isSearchDisabled() {
        if (!_.isNil(self.stateModel)) {
          return self.stateModel.search.disabled || $scope.requisitionTemplateSearchForm.$invalid;
        }
        return false;
      };

      self.isClearDisabled = function isClearDisabled() {
        if (!_.isNil(self.stateModel)) {
          // Consider state model value only if form is valid or pristine, otherwise button should be enabled
          if ($scope.requisitionTemplateSearchForm.$valid || $scope.requisitionTemplateSearchForm.$pristine) {
            return self.stateModel.clear.disabled;
          }
        }
        return false;
      };

      //
      // Value change handlers
      //
      self.onTemplateIdChange = function onTemplateIdChange() {
        notityModelChange();
      };
      self.onTemplateDescriptionChange = function onTemplateDescriptionChange() {
        notityModelChange();
      };
      self.onSelectSite = function onSelectSite() {
        notityModelChange();
      };
      self.onSelectDepartment = function onSelectDepartment() {
        notityModelChange();
      };
      self.onSelectAddress = function onSelectAddress() {
        notityModelChange();
      };
      self.onSelectRequester = function onSelectRequester() {
        notityModelChange();
      };
      self.onSelectClient = function onSelectClient() {
        notityModelChange();
      };      
      self.onActiveChange = function onActiveChange() {
        notityModelChange();
      };
      self.onAutomaticGenerationChange = function onAutomaticGenerationChange() {
        notityModelChange();
      };
      self.onProductNumberChange = function onProductNumberChange() {
        notityModelChange();
      };
      self.onProductDescriptionChange = function onProductDescriptionChange() {
        notityModelChange();
      };
      self.onProductStoreChange = function onProductStoreChange() {
        notityModelChange();
      };
      self.onProductInvalidChange = function onProductInvalidChange() {
        notityModelChange();
      };
      self.isIncludeExternalSales = function isIncludeExternalSales() {
        return UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canDoExternalSaleRequisition;
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
