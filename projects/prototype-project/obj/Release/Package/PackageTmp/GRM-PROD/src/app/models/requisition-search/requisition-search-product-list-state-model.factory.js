(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-search')
      .factory('RequisitionSearchProductListStateModel', RequisitionSearchProductListStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchProductListStateModelFactory() {
      return RequisitionSearchProductListStateModel;
    }

    function RequisitionSearchProductListStateModel(obj) {
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
        return new RequisitionSearchProductListStateModel(this);
      };
    }
  }
)();
