(
  function() {
    'use strict';

    angular
      .module('app.models.product')
      .factory('ProductParamModel', ProductListModelFactory)
    ;

    /* @ngInject */
    function ProductListModelFactory() {
      return ProductParamModel;
    }

    function ProductParamModel(obj) {
      var that = _.extend({
        parentView: undefined,
        requester: undefined,
        department: undefined,
        site: undefined,
        deliveryLocation: undefined,
        client: undefined,
        productIds: undefined
      }, obj);

      this.parentView = that.parentView;
      this.requester = that.requester;
      this.department = that.department;
      this.site = that.site;
      this.deliveryLocation = that.deliveryLocation;
      this.client = that.client;
      this.productIds = that.productIds;

      this.clone = function clone() {
        return new ProductParamModel(this);
      };
    }
  }
)();
