(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionProgressModel', RequisitionProgressModelFactory)
    ;

    /* @ngInject */
    function RequisitionProgressModelFactory() {
      return RequisitionProgressModel;
    }

    function RequisitionProgressModel(obj) {
      var that = _.extend({
        status: 1
      }, obj);

      this.status = that.status;

      this.clone = function clone() {
        return new RequisitionProgressModel(this);
      };
    }
  }
)();
