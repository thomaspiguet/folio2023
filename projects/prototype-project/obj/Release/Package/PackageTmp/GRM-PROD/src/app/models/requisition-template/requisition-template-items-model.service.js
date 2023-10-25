(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-template')
      .factory('RequisitionTemplateItemsModel', RequisitionTemplateItemsModelFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateItemsModelFactory() {
      return RequisitionTemplateItemsModel;
    }

    function RequisitionTemplateItemsModel(obj) {
      var that = _.extend({
        requisitionTemplateItem: undefined,
        requisitionTemplateItems: []
      },
      obj);

      this.requisitionTemplateItem = that.requisitionTemplateItem;
      this.requisitionTemplateItems = that.requisitionTemplateItems;

      this.clone = function clone() {
        return new RequisitionTemplateItemsModel(this);
      };
    }
  }
)();
