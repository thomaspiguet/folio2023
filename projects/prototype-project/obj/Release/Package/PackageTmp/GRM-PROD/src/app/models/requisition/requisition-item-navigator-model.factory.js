(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionItemNavigatorModel', RequisitionItemNavigatorModelFactory)
    ;

    /* @ngInject */
    function RequisitionItemNavigatorModelFactory() {
      return RequisitionItemNavigatorModel;
    }

    function RequisitionItemNavigatorModel(obj) {
      var that = _.extend({
        requisitionId: undefined
      }, obj);

      this.requisitionId = that.requisitionId;

      this.clone = function clone() {
        return new RequisitionItemNavigatorModel(this);
      };
    }
  }
)();
