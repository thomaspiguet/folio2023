(
  function() {
    'use strict';

    angular
      .module('app.layout.common.action-bar')
      .component('actionBar', actionBar())
    ;

    function actionBar() {
      var cdo = {
        templateUrl: 'action-bar.template.html',
        controller: ActionBarController,
        bindings: {
          // the sole action handler
          actionHandler: '&',

          // the currently occurring action
          actionState: '<',

          // cancel action states
          hideCancel: '<',
          disableCancel: '<',

          // complete action states
          hideComplete: '<',
          disableComplete: '<',

          // delete action states
          hideDelete: '<',
          disableDelete: '<',

          // save action states
          hideSave: '<',
          disableSave: '<',

          // A check mark timeout may be provided to override the default
          completedCheckmarkTimeout: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function ActionBarController($log, $timeout, ActionBarConstants) {
      // Keep a reference to this component instance
      var ctrl = this;
      // The timeout value used to display a check mark when an action is completed
      var completedTimeout;
      // The current completed action
      var completedAction;
      // Alias
      var actions = ActionBarConstants;

      //
      // Component life cycle
      //
      this.$onInit = function onInit() {
        completedTimeout = ctrl.completedCheckmarkTimeout || 3000;

        // initialize display state
        ctrl.hideCancel = _.isNil(ctrl.hideCancel) ? false : ctrl.hideCancel;
        ctrl.hideComplete = _.isNil(ctrl.hideComplete) ? false : ctrl.hideComplete;
        ctrl.hideDelete = _.isNil(ctrl.hideDelete) ? false : ctrl.hideDelete;
        ctrl.hideSave = _.isNil(ctrl.hideSave) ? false : ctrl.hideSave;

        // initialize disabled state
        ctrl.disableCancel = _.isNil(ctrl.disableCancel) ? false : ctrl.disableCancel;
        ctrl.disableComplete = _.isNil(ctrl.disableComplete) ? false : ctrl.disableComplete;
        ctrl.disableDelete = _.isNil(ctrl.disableDelete) ? false : ctrl.disableDelete;
        ctrl.disableSave = _.isNil(ctrl.disableSave) ? false : ctrl.disableSave;
      };

      this.$onChanges = function onChanges(changesObj) {
        if (!_.isNil(changesObj.actionState)) {
          if (changesObj.actionState.currentValue !== changesObj.actionState.previousValue && (actions.idle === changesObj.actionState.currentValue || actions.idleSuccess === changesObj.actionState.currentValue)) {
            var prev = changesObj.actionState.previousValue;
            if (actions.cancelling === prev) {
              scheduleCompletedCheckmark(actions.canceled);
            }
            if (actions.completing === prev) {
              scheduleCompletedCheckmark(actions.completed);
            }
            if (actions.deleting === prev) {
              scheduleCompletedCheckmark(actions.deleted);
            }
            if (actions.saving === prev) {
              scheduleCompletedCheckmark(actions.saved);
            }
          }
        }
      };

      function scheduleCompletedCheckmark(which) {
        completedAction = which;
        $timeout(function onTimeout() {
          completedAction = actions.idle;
        }, completedTimeout);
      }

      //
      // Component state indicator functions
      //
      this.isSaving = function isSaving() {
        return actions.saving === ctrl.actionState;
      };
      this.isSaved = function isSaved() {
        return actions.saved === completedAction;
      };

      this.isCompleting = function isCompleting() {
        return actions.completing === ctrl.actionState;
      };
      this.isCompleted = function isCompleted() {
        return actions.completed === completedAction;
      };

      this.isCancelling = function isCancelling() {
        return actions.cancelling === ctrl.actionState;
      };
      this.isCancelled = function isCancelled() {
        return actions.cancelled === completedAction;
      };

      this.isDeleting = function isDeleting() {
        return actions.deleting === ctrl.actionState;
      };
      this.isDeleted = function isDeleted() {
        return actions.deleted === completedAction;
      };

      this.isIdle = function isIdle() {
        return actions.idle === ctrl.actionState || actions.idleSuccess === ctrl.actionState || actions.idleError === ctrl.actionState;
      };

      //
      // Component disabled state indicator functions
      //
      this.isCancelActionDisabled = function isCancelActionDisabled() {
        return ctrl.disableCancel || !ctrl.isIdle();
      };

      this.isCompleteActionDisabled = function isCompleteActionDisabled() {
        return ctrl.disableComplete || !ctrl.isIdle();
      };

      this.isDeleteActionDisabled = function isDeleteActionDisabled() {
        return ctrl.disableDelete || !ctrl.isIdle();
      };

      this.isSaveActionDisabled = function isSaveActionDisabled() {
        return ctrl.disableSave || !ctrl.isIdle();
      };

      //
      // Action handlers
      //
      this.onDelete = function onDelete($event) {
        if ($event) {
          $event.preventDefault();
        }

        ctrl.actionHandler({
          obj: {
            action: actions.delete
          }
        });
      };

      this.onCancel = function onCancel($event) {
        if ($event) {
          $event.preventDefault();
        }

        ctrl.actionHandler({
          obj: {
            action: actions.cancel
          }
        });
      };

      this.onSave = function onSave($event) {
        if ($event) {
          $event.preventDefault();
        }

        ctrl.actionHandler({
          obj: {
            action: actions.save
          }
        });
      };

      this.onComplete = function onComplete($event) {
        if ($event) {
          $event.preventDefault();
        }

        ctrl.actionHandler({
          obj: {
            action: actions.complete
          }
        });
      };
    }
  }
)();
