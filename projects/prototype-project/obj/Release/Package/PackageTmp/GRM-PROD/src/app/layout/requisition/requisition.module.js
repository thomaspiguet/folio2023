(
  function() {
    'use strict';

    angular.module('app.layout.requisition', [
      'app.layout.requisition.authorizers-management',
      'app.layout.requisition.requisition-header',
      'app.layout.requisition.requisition-header-actions',
      'app.layout.requisition.requisition-item-list',
      'app.layout.requisition.requisition-item-navigator',
      'app.layout.requisition.requisition-item-tabs',
      'app.layout.requisition.requisition-progress',
      'app.layout.requisition.requisition-uncatalogued-product'
    ]);

  }
)();
