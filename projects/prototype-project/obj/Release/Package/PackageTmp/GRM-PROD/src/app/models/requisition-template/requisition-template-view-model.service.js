(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-template')
      .factory('RequisitionTemplateViewModel', RequisitionTemplateViewModelFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateViewModelFactory() {
      return RequisitionTemplateViewModel;
    }

    function RequisitionTemplateViewModel(obj) {
      var that = _.extend({
        requisitionTemplateLabel: undefined
      }, obj);

      this.requisitionTemplateLabel = that.requisitionTemplateLabel;

      this.clone = function clone() {
        return new RequisitionTemplateViewModel(this);
      };
    }
  }
)();
