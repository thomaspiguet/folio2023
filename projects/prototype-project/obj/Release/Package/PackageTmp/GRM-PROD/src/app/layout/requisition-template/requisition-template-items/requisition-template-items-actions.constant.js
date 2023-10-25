(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template.requisition-template-items')
      .constant('RequisitionTemplateItemsActions', {
        onAddRequisitionTemplateItem: 'onAddRequisitionTemplateItem',
        onAddRequisitionTemplateItems: 'onAddRequisitionTemplateItems',
        onRemoveRequisitionItem: 'onRemoveRequisitionTemplateItem',
        onSearchProductInfo: 'onSearchProductInfo',
        onSearchProducts: 'onSearchProducts'
      })
    ;
  }
)();
