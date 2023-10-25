(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template-search.requisition-template-criteria')
      .constant('RequisitionTemplateCriteriaActions', {
        onClearCriteria: 'onClearCriteria',
        onSearch: 'onSearch',
        onSearchModeChange: 'onSearchModeChange'
      })
    ;
  }
)();
