(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-item-list')
      .constant('RequisitionItemListActions', {
        onAddRequisitionItem: 'onAddRequisitionItem',
        onAddRequisitionItems: 'onAddRequisitionItems',
        onCreateUncataloguedProduct: 'onCreateUncataloguedProduct',
        onEditUncataloguedProductItem: 'onEditUncataloguedProductItem',
        onRemoveRequisitionItem: 'onRemoveRequisitionItem',
        onSearchProductInfo: 'onSearchProductInfo',
        onSearchProducts: 'onSearchProducts',
        onSelectRequisitionItem: 'onSelectRequisitionItem',
        onSortRequisitionItems: 'onSortRequisitionItems',
        onItemDueDateChanged: 'onItemDueDateChanged'
      })
    ;
  }
)();
