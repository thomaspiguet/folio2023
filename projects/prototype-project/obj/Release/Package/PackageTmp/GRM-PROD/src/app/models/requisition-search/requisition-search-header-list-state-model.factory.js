(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-search')
      .factory('RequisitionSearchHeaderListStateModel', RequisitionSearchHeaderListStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchHeaderListStateModelFactory() {
      return RequisitionSearchHeaderListStateModel;
    }

    function RequisitionSearchHeaderListStateModel(obj) {
      var that = _.extend({
        hidden: false,
        searching: false,
        detail: {
          hidden: true
        }
      }, obj);

      this.hidden = that.hidden;
      this.searching = that.searching;
      this.detail = that.detail;

      this.clone = function clone() {
        return new RequisitionSearchHeaderListStateModel(this);
      };
    }
  }
)();
