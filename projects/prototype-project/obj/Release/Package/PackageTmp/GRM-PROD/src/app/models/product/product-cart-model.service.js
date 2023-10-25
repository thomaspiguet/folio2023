(
  function() {
    'use strict';

    angular
      .module('app.models.product')
      .factory('ProductCartModel', ProductCartModelFactory)
    ;

    /* @ngInject */
    function ProductCartModelFactory() {
      return ProductCartModel;
    }

    function ProductCartModel(obj) {
      var that = _.extend({
        item: undefined,
        items: []
      }, obj);
      
      this.item = that.item;
      this.items = that.items;

      this.clone = function clone() {
        return new ProductCartModel(this);
      };
    }
  }
)();
