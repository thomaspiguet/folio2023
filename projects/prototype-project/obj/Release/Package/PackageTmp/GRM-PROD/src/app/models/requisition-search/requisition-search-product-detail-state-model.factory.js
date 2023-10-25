(
  function() {
    'use strict';

    angular
      .module('app.models')
      .factory('RequisitionSearchProductDetailStateModel', RequisitionSearchProductDetailStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchProductDetailStateModelFactory() {
      return RequisitionSearchProductDetailStateModel;
    }

    function RequisitionSearchProductDetailStateModel(obj) {
      var that = _.extend({
        hidden: false,
        searching: false
      }, obj);

      this.hidden = that.hidden;
      this.searching = that.searching;

      this.clone = function clone() {
        return new RequisitionSearchProductDetailStateModel(this);
      };
    }
  }
)();
