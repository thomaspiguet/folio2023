(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-search.requisition-criteria')
      .constant('RequisitionSearchCriteriaActions', {
        onClearCriteria: 'onClearCriteria',
        onSearch: 'onSearch',
        onSearchModeChange: 'onSearchModeChange'
      })
    ;
  }
)();
