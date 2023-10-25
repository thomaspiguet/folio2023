(
  function() {
    'use strict';

    angular
      .module('app.layout.product.product-cart')
      .constant('ProductCartActions', {
        onApplyCart: 'onApplyCart',
        onCloseCart: 'onCloseCart',
        onDiscardCart: 'onDiscardCart',
        onClearCart: 'onClearCart',
        onRemoveCartItem: 'onRemoveCartItem'
      })
    ;
  }
)();
