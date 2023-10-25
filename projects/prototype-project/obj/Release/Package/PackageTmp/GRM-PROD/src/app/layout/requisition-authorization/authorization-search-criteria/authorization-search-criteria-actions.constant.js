(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-authorization.authorization-search-criteria')
      .constant('AuthorizationSearchCriteriaActions', {
        togglePanel: 'togglePanel',
        onSearch: 'onSearch',
        onClear: 'onClear'
      })
    ;
  }
)();
