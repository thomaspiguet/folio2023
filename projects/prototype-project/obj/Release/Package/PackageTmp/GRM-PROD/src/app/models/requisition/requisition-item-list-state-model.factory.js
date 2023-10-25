(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionItemListStateModel', RequisitionItemListStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionItemListStateModelFactory() {
      return RequisitionItemListStateModel;
    }

    function RequisitionItemListStateModel(obj) {
      var that = _.extend({
        readOnly: false,
        addAction: {
          disabled: false,
          hidden: false
        },
        addUncataloguedProductAction: {
          disabled: false,
          hidden: false
        },
        requisitionItemStates: []
      }, obj);

      this.readOnly = that.readOnly; // TODO this is needed by the component - see if it can be done different
      this.addAction = that.addAction;
      this.addUncataloguedProductAction = that.addUncataloguedProductAction;
      this.requisitionItemStates = that.requisitionItemStates;

      this.clone = function clone() {
        return new RequisitionItemListStateModel(this);
      };
    }
  }
)();
