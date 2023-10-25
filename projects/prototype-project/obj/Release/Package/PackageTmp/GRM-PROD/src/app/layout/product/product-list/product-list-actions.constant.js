(
  function() {
    'use strict';

    angular
      .module('app.layout.product.product-list')
      .constant('ProductListActions', {
        onProductItemClick: 'onProductItemClick',
        onSort: 'onSort',
        onPage: 'onPage',
        onRowSelect: 'onRowSelect',
      })
    ;
  }
)();
