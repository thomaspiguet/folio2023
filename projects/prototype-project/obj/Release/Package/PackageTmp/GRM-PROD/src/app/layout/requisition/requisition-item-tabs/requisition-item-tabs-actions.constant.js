(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-item-tabs')
      .constant('RequisitionItemTabsActions', {
        onDeselectAuthorizationsTab: 'onDeselectAuthorizationsTab',
        onSelectAuthorizationsTab: 'onSelectAuthorizationsTab',
        onStoreChanged: 'onStoreChanged',
        onViewConsumptionStatisticsForProduct: 'onViewConsumptionStatisticsForProduct'
      })
    ;
  }
)();
