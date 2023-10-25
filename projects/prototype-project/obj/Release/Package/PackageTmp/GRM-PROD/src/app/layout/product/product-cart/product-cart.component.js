(
  function() {
    'use strict';

    angular
      .module('app.layout.product.product-cart')
      .component('productCart', productCart())
    ;

    function productCart() {
      var cdo = {
        templateUrl: 'product-cart.template.html',
        controller: ProductCartController,
        bindings: {
          actionHandler: '&',
          productCartModel: '<model',
          productCartStateModel: '<modelState'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function ProductCartController(ProductCartActions) {
      var self = this;
      self.model = undefined;
      self.currentIndex = 0;

      self.$onInit = function onInit() {
        synchronizeModel();
      };

      self.$onChanges = function onChanges(changesObj) {
        synchronizeModel();
      };

      //DOM related functions
      this.$postLink = function () {
        //Jquery here .. no angular way to scroll just inside a container ..
        self.scrollTo = function scrollTo(top) {
          var tbody = new Clay('#product-list-cart-item-table tbody');
          var scrollingContainer = angular.element(tbody.selector);
          var scrollHeight;
          if (!_.isNil(top) && top) {
            //Scroll to top
            scrollHeight = 0;
          }
          else {
            //Scroll to bottom
            scrollHeight = scrollingContainer[0].scrollHeight;
          }
          scrollingContainer.scrollTop(scrollHeight);
        };

        self.setFocus = function setFocus($index, itemPrefix) {
          var productCodeInput = angular.element('#code_' + $index);
          productCodeInput.focus();
        };

        self.scrollToAndFocus = function scrollToAndFocus($index, $last) {
          if ($last) {
            self.scrollTo(true);
          }
        };
      };

      this.onSelectItemLine = function onSelectItemLine($index) {
        self.currentIndex = $index;
        self.model.item = self.model.items[$index];
      };

      self.onRemoveItem = function onRemoveItem($event, item) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: ProductCartActions.onRemoveCartItem,
            item: item
          }
        });
      };

      self.onApplyCart = function onApplyCart($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: ProductCartActions.onApplyCart,
            model: self.model
          }
        });
      };

      self.onDiscardCart = function onDiscardCart($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: ProductCartActions.onDiscardCart,
            model: self.model
          }
        });
      };

      self.onCloseCart = function onCloseCart($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: ProductCartActions.onCloseCart
          }
        });
      };

      self.onClearCart = function onClearCart($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: ProductCartActions.onClearCart
          }
        });
      };      

      function synchronizeModel() {
        self.model = self.productCartModel.clone();
      }
    }
  }
)();

