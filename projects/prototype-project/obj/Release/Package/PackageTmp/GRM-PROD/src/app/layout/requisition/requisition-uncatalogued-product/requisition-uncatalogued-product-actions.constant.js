(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-uncatalogued-product')
      .constant('RequisitionUncataloguedProductActions', {
        'fetchDefaultValues': 'fetchDefaultValues',
        'fetchDefaultBuyer': 'fetchDefaultBuyer',
        'onAddProduct': 'onAddUncataloguedProduct',
        'onSaveCurrentValues': 'onSaveUncataloguedProductCurrentValues',
        'onAddProductAndClose': 'onAddUncataloguedProductAndClose',
        'onCancelProductEdition': 'onCancelUncataloguedProductEdition',
        'onClosePrestine': 'onCloseUncataloguedProductPrestine',
        'onEditProduct': 'onEditUncataloguedProduct'
      })
    ;
  }
)();
