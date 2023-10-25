(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template.requisition-template-items')
      .constant('RequisitionTemplateItemsStates', {
        // Idle state variants
        idle: 'idle',
        fetching: 'fetching'
      })
    ;
  }
)();
