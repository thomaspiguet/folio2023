(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-authorization.authorization-actions')
      .constant('AuthorizationActionsActions', {
        onAuthorize: 'onAuthorize',
        onRefuse: 'onRefuse'
      })
      .constant('AuthorizationActionsStates', {
        inProgress: 'inProgress',
        completed: 'completed',
        idle: 'idle'
      })
    ;
  }
)();
