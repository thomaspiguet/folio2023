(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionItemListModel', RequisitionItemListModelFactory)
    ;

    /* @ngInject */
    function RequisitionItemListModelFactory() {
      return RequisitionItemListModel;
    }

    function RequisitionItemListModel(obj) {
      var self = this;
      var that = _.extend({
        // The id of the currently selected item
        requisitionItemUuid: undefined,
        requisitionMinimumDueDate: undefined,

        // The list of available items
        requisitionItems: []
      }, obj);

      this.requisitionItemUuid = that.requisitionItemUuid;
      this.requisitionItems = that.requisitionItems;
      this.requisitionMinimumDueDate = that.requisitionMinimumDueDate;

      this.selectedRequisitionItem = function selectedRequisitionItem() {
        return _.find(this.requisitionItems, function finder(ri) {
          return ri.uuid === self.requisitionItemUuid;
        });
      };

      this.clone = function clone() {
        return new RequisitionItemListModel(this);
      };
    }
  }
)();
