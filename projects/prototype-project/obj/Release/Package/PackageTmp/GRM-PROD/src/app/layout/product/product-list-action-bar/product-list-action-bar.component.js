(
  function() {
    'use strict';

    angular
      .module('app.layout.product.product-list-action-bar')
      .component('productListActionBar', productListActionBar())
    ;

    function productListActionBar() {
      var cdo = {
        templateUrl: 'product-list-action-bar.template.html',
        controller: ProductListActionBarController,
        bindings: {
          actionHandler: '&',
          cartItemsCount: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function ProductListActionBarController($log, ProductListActionBarActions) {
      var self = this;

      self.onViewCart = function onViewCart($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: ProductListActionBarActions.onViewCart
          }
        });
      };
    }
  }
)();
