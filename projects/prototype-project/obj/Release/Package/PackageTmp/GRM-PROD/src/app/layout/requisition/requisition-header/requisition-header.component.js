(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-header')
      .component('requisitionHeader', requisitionHeader())
    ;

    function requisitionHeader() {
      var cdo = {
        templateUrl: 'requisition-header.template.html',
        controller: RequisitionHeaderController,
        bindings: {
          requisitionHeaderModel: '<model',
          requisitionHeaderStateModel: '<stateModel',
          actionHandler: '&',
          editHandler: '&',
          createMode: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionHeaderController(
        $scope,
        DynamicLookupService,
        RequisitionHeaderActions,
        UserProfileService
      ) {

      var ctrl = this;
      ctrl.today = new Date();

      this.dataModel = undefined;
      this.stateModel = undefined;
      var deliveryLocationSearchText = '';
      var requisitionTypes = [];

      this.$onInit = function onInit() {
        synchronizeModels();

        requisitionTypes = DynamicLookupService.getRequisitionTypes();
      };

      this.$onChanges = function onChanges(changesObj) {
        synchronizeModels();
      };

      this.onSelectDepartment = function onSelectDepartment() {
        notifyModelChanged();
      };

      this.getRequisitionTypes = function getRequisitionTypes() {
        return requisitionTypes;
      };

      this.isIncludeExternalSales = function isIncludeExternalSales() {
        return UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canDoExternalSaleRequisition;
      };

      this.validateRequiredOnMinDate = function validateRequiredOnMinDate() {
        if (!_.isNil($scope.requisitionHeaderForm.requiredOn)) {
          return $scope.requisitionHeaderForm.requiredOn.$touched ?
            ctrl.dataModel.createdOn || ctrl.today : undefined;
        }
        return undefined;
      };

      this.getRequisitionTypeDescription = function getRequisitionTypeDescription(requisitionTypeCode) {
        return DynamicLookupService.getRequisitionTypes().getDescriptionByCode(requisitionTypeCode);
      };

      this.onSelectRequester = function onSelectRequester() {
        notifyModelChanged();
      };

      this.onSelectDeliveryLocation = function onSelectDeliveryLocation() {
        notifyModelChanged();
      };

      this.onSelectRequisitionTemplate = function onSelectRequisitionTemplate() {
        if (false === ctrl.createMode) {
          return;
        }

        notifyModelChanged();
      };

      this.onSelectSite = function onSelectSite() {
        notifyModelChanged();
      };

      this.onSelectAddress = function onSelectAddress() {
        notifyModelChanged();
      };

      this.onChangePhoneExtension = function onChangePhoneExtension() {
        notifyModelChanged();
      };

      this.onSelectClient = function onSelectClient() {
        notifyModelChanged();
      };

      this.onSelectRequiredOn = function onSelectRequiredOn() {
        notifyModelChanged();
      };

      this.onSelectRequisitionType = function onSelectRequisitionType() {
        // if (DynamicLookupService.getRequisitionTypes()._1.code === ctrl.dataModel.type) {
        //   ctrl.dataModel.installationSite = undefined;
        // }
        notifyModelChanged();
      };

      this.onSelectSplitOnUniqueOrder = function onSelectSplitOnUniqueOrder() {
        notifyModelChanged();
      };

      this.onSelectIsWeeklyConsommationDisplayed = function onSelectIsWeeklyConsommationDisplayed() {
        notifyModelChanged();
      };

      this.onSelectInstallationSite = function onSelectInstallationSite() {
        notifyModelChanged();
      };

      this.onChangeNote = function onChangeNote() {
        notifyModelChanged();
      };

      this.onDeliveryLocationSearchTextChange = function onDeliveryLocationSearchTextChange(obj) {
        deliveryLocationSearchText = obj.searchText;
      };

      this.onCreateDeliveryLocation = function onCreateDeliveryLocation($event) {
        if ($event) {
          $event.preventDefault();
        }

        ctrl.actionHandler({
          obj: {
            action: RequisitionHeaderActions.toggleDeliveryLocationCreation,
            value: deliveryLocationSearchText
          }
        });
        deliveryLocationSearchText = '';
      };

      //
      // Helper functions
      //
      function notifyModelChanged() {
        ctrl.editHandler({
          obj: {
            model: ctrl.dataModel
          }
        });
      }

      function synchronizeModels() {
        ctrl.dataModel = ctrl.requisitionHeaderModel.clone();
        ctrl.stateModel = ctrl.requisitionHeaderStateModel;
      }
    }
  }
)();
