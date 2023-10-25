(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.authorizers-management')
      .constant('AuthorizersManagementActions', {
        addAuthorizer: 'addAuthorizer',
        replaceAuthorizer: 'replaceAuthorizer'
      })
    ;
  }
)();
