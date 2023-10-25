(
  function() {
    'use strict';

    angular.module('app.business-logic', [
      'app.business-logic.authorization',
      'app.business-logic.common',
      'app.business-logic.product',
      'app.business-logic.requisition',
      'app.business-logic.requisition-follow-up',
      'app.business-logic.requisition-search',
      'app.business-logic.requisition-template',
      'app.business-logic.requisition-template-search'
    ]);

  }
)();
