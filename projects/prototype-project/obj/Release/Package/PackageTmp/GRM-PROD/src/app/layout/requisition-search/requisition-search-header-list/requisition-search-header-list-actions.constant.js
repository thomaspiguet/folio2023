(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-search.requisition-header-list')
      .constant('RequisitionSearchHeaderListActions', {
        onSort: 'onSort',
        onPage: 'onPage',
        onRowSelect: 'onRowSelect',
        onToggleDetailSection: 'onToggleDetailSection'
      })
    ;
  }
)();
