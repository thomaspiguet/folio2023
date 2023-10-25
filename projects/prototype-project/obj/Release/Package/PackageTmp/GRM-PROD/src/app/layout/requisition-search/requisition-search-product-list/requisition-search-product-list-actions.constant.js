(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-search.requisition-product-list')
      .constant('RequisitionSearchProductListActions', {
        onSort: 'onSort',
        onPage: 'onPage',
        onRowSelect: 'onRowSelect',
        onToggleDetailSection: 'onToggleDetailSection'
      })
    ;
  }
)();
