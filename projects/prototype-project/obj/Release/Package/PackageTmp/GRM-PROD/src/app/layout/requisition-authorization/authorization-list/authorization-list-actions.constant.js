(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-authorization.authorization-list')
      .constant('AuthorizationListActions', {
        // fetch authorization list action
        fetchAuthorizationRequisitionGroups: 'fetchAuthorizationRequisitionGroups',
        
        // select whole list action
        toggleAuthorizationListSelection: 'toggleAuthorizationListSelection',
        
        // select one list item action
        toggleAuthorizationSelection: 'toggleAuthorizationSelection',
        
        // sort authorization list action
        sortAuthorizationList: 'sortAuthorizationList',
        
        // show/hide search criteria panel
        toggleSearchCriteria: 'toggleSearchCriteria',
        
        // show/hide authorization product lines
        toggleAuthorizationProductLines: 'toggleAuthorizationProductLines',
        
        // show/hide authorization related authorizations 
        toggleAuthorizationRelatedAuthorizations: 'toggleAuthorizationRelatedAuthorizations',
        
        // handle scroll position tracking
        onScrollAuthorizationList: 'onScrollAuthorizationList',
        
        // select table row (display only, differs from row selection for authorization purposes)
        onRowSelection: 'onRowSelection'
      })
    ;
  }
)();
