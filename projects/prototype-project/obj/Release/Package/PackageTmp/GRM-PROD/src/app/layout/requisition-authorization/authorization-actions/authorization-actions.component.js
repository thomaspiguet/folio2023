(function () {
    'use strict';

    angular
      .module ('app.layout.requisition-authorization.authorization-actions')
      .component ('authorizationActions', authorizationActions())
    ;

    function authorizationActions() {
      var cdo = {
        templateUrl: 'authorization-actions.template.html',
        controller: AuthorizationActionsController,
        bindings: {
          actionHandler: '&',
          authorizationSelectedCount: '<?',
          authorizeProcessState: '<?',
          refuseProcessState: '<?',
        }
      };

      return cdo;
    }

  /* @ngInject */
  function AuthorizationActionsController(
    $filter,
    $log,
    $timeout,
    AuthorizationActionsActions,
    AuthorizationActionsStates) {

    var self = this;
    self.isAuthorizeCompletedStateExpired = true;
    self.isRefuseCompletedStateExpired = true;

    self.$onChanges = function $onChanges(changesObj) {
      // Whenever authorization/refuse state gets completed, internally reset to idle after 2 sec.
      // This behavior could be left to the parent controller but since the user experience is
      // tightly coupled to the component itself and that the visual duration of the completed
      // indicator is more the concern of THIS visual component, it is rather managed right inside
      // its controller...

      if (changesObj.authorizeProcessState) {
        if (changesObj.authorizeProcessState.currentValue === AuthorizationActionsStates.completed) {
          $timeout(function onTimeout() {
            self.isAuthorizeCompletedStateExpired = true;
          }, 2000);
        }
        else if (changesObj.authorizeProcessState.currentValue === AuthorizationActionsStates.inProgress) {
          self.isAuthorizeCompletedStateExpired = false;
        }
      }

      if (changesObj.refuseProcessState) {
        if (changesObj.refuseProcessState.currentValue === AuthorizationActionsStates.completed) {
          $timeout(function onTimeout() {
            self.isRefuseCompletedStateExpired = true;
          }, 2000);
        }
        else if (changesObj.refuseProcessState.currentValue === AuthorizationActionsStates.inProgress) {
          self.isRefuseCompletedStateExpired = false;
        }
      }
    };

    // // TODO: Need this ?
    // self.stateModel = {
    //   filterButton: {
    //     disabled: false,
    //     hidden: false,
    //     required: false
    //   }
    // };

    self.onAuthorize = function($event) {
      if ($event) {
        $event.preventDefault();
      }

      // emit event up to dispatcher...
      self.actionHandler({
        obj: {
          action: AuthorizationActionsActions.onAuthorize
        }
      });

      $log.log('OnAuthorizeClicked.');
    };

    self.onRefuse = function($event) {
      if ($event) {
        $event.preventDefault();
      }

      // emit event up to dispatcher...
      self.actionHandler({
        obj: {
          action: AuthorizationActionsActions.onRefuse
        }
      });

      $log.log('OnRefuseClicked.');
    };

    self.isRefuseActionDisabled = function() {
      return !self.isAuthorizeIdle() || !self.authorizationSelectedCount || !self.isRefuseIdle();
    };

    self.isAuthorizeActionDisabled = function() {
      return !self.isRefuseIdle() || !self.authorizationSelectedCount || !self.isAuthorizeIdle();
    };

    self.isAuthorizeIdle = function () {
      return self.isAuthorizeCompletedStateExpired || self.authorizeProcessState === AuthorizationActionsStates.idle;
    };

    self.isAuthorizeInProgress = function () {
      return self.authorizeProcessState === AuthorizationActionsStates.inProgress;
    };

    self.isRefuseIdle = function () {
      return self.isRefuseCompletedStateExpired || self.refuseProcessState === AuthorizationActionsStates.idle;
    };

    self.isRefuseInProgress = function () {
      return self.refuseProcessState === AuthorizationActionsStates.inProgress;
    };
  }
})();
