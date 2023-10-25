(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionActionBarStateModel', RequisitionActionBarStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionActionBarStateModelFactory() {
      return RequisitionActionBarStateModel;
    }

    function RequisitionActionBarStateModel(obj) {
      var that = _.extend({
        cancel: {
          disabled: true,
          hidden: false
        },
        complete: {
          disabled: false,
          hidden: false
        },
        delete: {
          disabled: false,
          hidden: false
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
        return new RequisitionActionBarStateModel(this);
      };
    }
  }
)();
