(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template-search.requisition-template-header-list')
      .constant('RequisitionTemplateHeaderListActions', {
        onPage: 'onPage',
        onSort: 'onSort',
        onRowSelect: 'onRowSelect',
      })
    ;
  }
)();
