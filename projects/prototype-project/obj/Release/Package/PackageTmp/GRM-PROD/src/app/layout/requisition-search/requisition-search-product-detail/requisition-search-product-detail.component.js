(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-search.requisition-product-detail')
      .component('requisitionSearchProductDetail', requisitionSearchProductDetail())
    ;

    function requisitionSearchProductDetail() {
      var cdo = {
        templateUrl: 'requisition-search-product-detail.template.html',
        controller: RequisitionSearchProductDetailController,
        bindings: {
          dataModel: '<model',
          stateModel: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionSearchProductDetailController() {
      var self = this;
      self.model = undefined;

      self.$onInit = function onInit() {
        self.model = self.dataModel.clone();
//        self.model.originStatusDescription = DynamicLookupService.getRequisitionOriginStatuses().getDescriptionByCode(String(self.model.originStatusCode));
      };

      self.$onChanges = function onChanges(changesObj) {
        if (!_.isNil(changesObj.dataModel)) {
          if (changesObj.dataModel.previousValue !== changesObj.dataModel.currentValue) {
            self.$onInit();
          }
        }
      };
    }
  }
)();
