(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionItemNavigatorStateModel', RequisitionItemNavigatorStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionItemNavigatorStateModelFactory() {
      return RequisitionItemNavigatorStateModel;
    }

    function RequisitionItemNavigatorStateModel(obj) {
      var that = _.extend({
        previous: {
          disabled: false,
          hidden: false
        },
        next: {
          disabled: false,
          hidden: false
        }
      }, obj);

      this.previous = that.previous;
      this.next = that.next;

      this.clone = function clone() {
        return new RequisitionItemNavigatorStateModel(this);
      };
    }
  }
)();
