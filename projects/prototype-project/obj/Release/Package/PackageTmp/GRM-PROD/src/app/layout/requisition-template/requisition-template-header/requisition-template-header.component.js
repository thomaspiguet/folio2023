(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template.requisition-template-header')
      .component('requisitionTemplateHeader', requisitionTemplateHeader())
    ;

    function requisitionTemplateHeader() {
      var cdo = {
        controller: RequisitionTemplateHeaderController,
        templateUrl: 'requisition-template-header.template.html',
        bindings: {
          actionHandler: '&',
          checkHandler: '&',
          editHandler: '&',
          mode: '<',
          requisitionTemplateHeaderModel: '<model',
          requisitionTemplateHeaderStateModel: '<stateModel',
          userProfileId: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionTemplateHeaderController($log, UserProfileService) {
      var ctrl = this;
      this.model = undefined;
      this.stateModel = undefined;

      this.$onInit = function onInit() {
        synchronizeModel();
      };

      this.$onChanges = function onChanges(changesObj) {
        synchronizeModel();
      };

      this.onRequisitionTemplateDescriptionChange = function onRequisitionTemplateDescriptionChange() {
        ctrl.model.name = !_.isNil(ctrl.model.name) ? ctrl.model.name.toUpperCase() : undefined;
        notifyModelChanged();
      };

      this.onSelectSite = function onSelectSite() {
        notifyModelChanged();
      };

      this.onSelectDepartment = function onSelectDepartment() {
        notifyModelChanged();
      };

      this.onSelectAddress = function onSelectAddress() {
        notifyModelChanged();
      };

      this.onSelectDeliveryLocation = function onSelectDeliveryLocation() {
        notifyModelChanged();
      };

      this.onSelectRequester = function onSelectRequester() {
        notifyModelChanged();
      };

      this.onSelectClient = function onSelectClient() {
        notifyModelChanged();
      };

      this.onChangeActiveState = function onChangeActiveState() {
        notifyModelChanged();
      };

      this.onChangeIsAutomaticGeneration = function onChangeIsAutomaticGeneration() {
        notifyModelChanged();
      };

      this.isIncludeExternalSales = function isIncludeExternalSales() {
        return UserProfileService.getCurrentProfile().permissions.requisitionSpecific.canDoExternalSaleRequisition;
      };

      //
      // Helper functions
      //
      function notifyModelChanged() {
        ctrl.editHandler({
          obj: {
            model: ctrl.model
          }
        });
      }

      function synchronizeModel() {
        ctrl.model = ctrl.requisitionTemplateHeaderModel.clone();
        ctrl.stateModel = ctrl.requisitionTemplateHeaderStateModel;
      }
    }
  }
)();
