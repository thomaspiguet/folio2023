(
  function() {
    'use strict';

    angular.module('app.models', [
      'app.models.authorization',
      'app.models.product',
      'app.models.requisition',
      'app.models.requisition-follow-up',
      'app.models.requisition-search',
      'app.models.requisition-template',
      'app.models.requisition-template-search'
    ]);

  }
)();
