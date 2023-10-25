(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionViewModel', RequisitionViewModelFactory)
    ;

    /* @ngInject */
    function RequisitionViewModelFactory() {
      return RequisitionViewModel;
    }

    function RequisitionViewModel(obj) {
      var that = _.extend({
        requisitionLabel: undefined,
        uncataloguedProductSavedValues: undefined
      }, obj);

      this.requisitionLabel = that.requisitionLabel;
      this.uncataloguedProductSavedValues = that.uncataloguedProductSavedValues;

      this.clone = function clone() {
        return new RequisitionViewModel(this);
      };
    }
  }
)();
