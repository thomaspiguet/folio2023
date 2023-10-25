(
  function() {
    'use strict';

    angular
      .module('app.models')
      .factory('RequisitionSearchHeaderDetailStateModel', RequisitionSearchHeaderDetailStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchHeaderDetailStateModelFactory() {
      return RequisitionSearchHeaderDetailStateModel;
    }

    function RequisitionSearchHeaderDetailStateModel(obj) {
      var that = _.extend({
        hidden: false,
        searching: false
      }, obj);

      this.hidden = that.hidden;
      this.searching = that.searching;

      this.clone = function clone() {
        return new RequisitionSearchHeaderDetailStateModel(this);
      };
    }
  }
)();
