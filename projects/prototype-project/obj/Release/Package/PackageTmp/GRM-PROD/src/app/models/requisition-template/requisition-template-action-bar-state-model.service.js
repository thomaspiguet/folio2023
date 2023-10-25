(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-template')
      .factory('RequisitionTemplateActionBarStateModel', RequisitionTemplateActionBarStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateActionBarStateModelFactory() {
      return RequisitionTemplateActionBarStateModel;
    }

    function RequisitionTemplateActionBarStateModel(obj) {
      var that = _.extend({
        cancel: {
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
      this.delete = that.delete;
      this.save = that.save;

      this.clone = function clone() {
        return new RequisitionTemplateActionBarStateModel(this);
      };
    }
  }
)();
