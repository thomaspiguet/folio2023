(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-item-navigator')
      .constant('RequisitionItemNavigatorActions', {
        'onPrevious': 'onPrevious',
        'onNext': 'onNext'
      })
    ;
  }
)();
