(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-authorization.authorization-amount-range')
      .constant('AuthorizationAmountRangeActions', {
        onGetAmountRangeFilterGroups: 'onGetAmountRangeFilterGroups',
        onRangeSelectedChanged: 'onRangeSelectedChanged',
        onTechnicalsSelectedChanged: 'onTechnicalsSelectedChanged'
      })
    ;
  }
)();
