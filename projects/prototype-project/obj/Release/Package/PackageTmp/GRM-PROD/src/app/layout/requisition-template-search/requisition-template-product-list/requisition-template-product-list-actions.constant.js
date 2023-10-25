(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template-search.requisition-template-product-list')
      .constant('RequisitionTemplateProductListActions', {
        onPage: 'onPage',
        onSort: 'onSort',
        onRowSelect: 'onRowSelect',
      })
    ;
  }
)();
