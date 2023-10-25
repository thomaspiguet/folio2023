(
  function() {
    'use strict';

    angular
      .module('app.models.product')
      .factory('ProductCartStateModel', ProductCartStateModelFactory)
    ;

    /* @ngInject */
    function ProductCartStateModelFactory() {
      return ProductCartStateModel;

      function ProductCartStateModel(obj) {
        var that = _.extend({
          showAddToRequisition: false,
          showAddToRequisitionTemplate: false,
        }, obj);

        this.showAddToRequisition = that.showAddToRequisition;
        this.showAddToRequisitionTemplate = that.showAddToRequisitionTemplate;

        this.clone = function clone() {
          return new ProductCartStateModel(this);
        };
      }
    }

  }
)();
