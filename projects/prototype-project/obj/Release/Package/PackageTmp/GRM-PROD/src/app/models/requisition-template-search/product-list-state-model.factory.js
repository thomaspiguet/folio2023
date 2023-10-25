(
  function() {
    'use strict';

    angular
      .module('app.models')
      .factory('ProductListStateModel', ProductListStateModelFactory)
    ;

    /* @ngInject */
    function ProductListStateModelFactory() {
      return ProductListStateModel;
    }

    function ProductListStateModel(obj) {
      var that = _.extend({
        hidden: false,
        searching: false
      }, obj);

      this.hidden = that.hidden;
      this.searching = that.searching;

      this.clone = function clone() {
        return new ProductListStateModel(this);
      };
    }
  }
)();
