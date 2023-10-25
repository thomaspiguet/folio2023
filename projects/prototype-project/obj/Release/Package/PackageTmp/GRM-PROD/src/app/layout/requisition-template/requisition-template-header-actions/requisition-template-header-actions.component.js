(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template.requisition-template-header-actions')
      .component('requisitionTemplateHeaderActions', requisitionTemplateHeaderActions())
    ;

    function requisitionTemplateHeaderActions() {
      var cdo = {
        controller: RequisitionTemplateHeaderActionsController,
        templateUrl: 'requisition-template-header-actions.template.html',
        bindings: {
          actionHandler: '&',
          checkHandler: '&',
          editHandler: '&',
          mode: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionTemplateHeaderActionsController($log) {

      this.$onInit = function onInit() {

      };

      this.$onChanges = function onChanges(changesObj) {

      };

      this.onDuplicateTemplate = function onDuplicateTemplate() {
        this.actionHandler({
          obj: {
            action: 'duplicateTemplate' // TODO: define constants
          }
        });
      };
    }
  }
)();
