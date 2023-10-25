(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-header-actions')
      .component('requisitionHeaderActions', requisitionHeaderActions())
    ;

    function requisitionHeaderActions() {
      var cdo = {
        templateUrl: 'requisition-header-actions.template.html',
        controller: RequisitionHeaderActionsController,
        bindings: {
          stateModel: '<',
          actionHandler: '&'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionHeaderActionsController(RequisitionHeaderActionsActions) {
      var ctrl = this;

      function handleAction(action) {
        ctrl.actionHandler({
          obj: {
            action: action
          }
        });
      }

      this.onQuickHeaderEntry = function onQuickHeaderEntry($event) {
        if ($event) {
          $event.preventDefault();
        }

        handleAction(RequisitionHeaderActionsActions.onQuickHeaderEntry);
      };

      this.onToggleRequisitionTemplate = function onToggleRequisitionTemplate($event) {
        if ($event) {
          $event.preventDefault();
        }

        handleAction(RequisitionHeaderActionsActions.onToggleRequisitionTemplate);
      };

      this.onAttachFile = function onAttachFile($event) {
        if ($event) {
          $event.preventDefault();
        }
        // TODO implement
      };

      this.onMoreActions = function onMoreActions($event) {
        if ($event) {
          $event.preventDefault();
        }
        // TODO implement
      };

      this.onAddAuthorizer = function onAddAuthorizer($event) {
        if ($event) {
          $event.preventDefault();
        }

        handleAction(RequisitionHeaderActionsActions.onAddAuthorizer);
      };

      this.onReplaceAuthorizer = function onReplaceAuthorizer($event) {
        if ($event) {
          $event.preventDefault();
        }

        handleAction(RequisitionHeaderActionsActions.onReplaceAuthorizer);
      };
    }
  }
)();
