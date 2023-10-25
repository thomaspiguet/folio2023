(
  function() {
    'use strict';

    angular
      .module('app.models.product')
      .factory('ProductActionBarStateModel', ProductActionBarStateModelFactory)
    ;

    /* @ngInject */
    function ProductActionBarStateModelFactory() {
      return ProductActionBarStateModel;
    }

    function ProductActionBarStateModel(obj) {
      var that = _.extend({
        cancel: {
          disabled: false,
          hidden: true
        },
        complete: {
          disabled: false,
          hidden: true
        },
        delete: {
          disabled: false,
          hidden: true
        },
        save: {
          disabled: false,
          hidden: false
        }
      }, obj);

      this.cancel = that.cancel;
      this.complete = that.complete;
      this.delete = that.delete;
      this.save = that.save;

      this.clone = function clone() {
        return new ProductActionBarStateModel(this);
      };
    }
  }
)();
