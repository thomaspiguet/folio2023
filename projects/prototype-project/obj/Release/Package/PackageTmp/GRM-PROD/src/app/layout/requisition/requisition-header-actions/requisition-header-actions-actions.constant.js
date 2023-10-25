(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-header-actions')
      .constant('RequisitionHeaderActionsActions', {
        onQuickHeaderEntry: 'onQuickHeaderEntry',
        onToggleRequisitionTemplate: 'onToggleRequisitionTemplate',
        onAddAuthorizer: 'onAddAuthorizer',
        onReplaceAuthorizer: 'onReplaceAuthorizer'
      })
    ;
  }
)();
