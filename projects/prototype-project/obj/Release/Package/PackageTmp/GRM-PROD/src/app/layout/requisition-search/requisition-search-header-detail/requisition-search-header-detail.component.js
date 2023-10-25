(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-search.requisition-header-detail')
      .component('requisitionSearchHeaderDetail', requisitionSearchHeaderDetail())
    ;

    function requisitionSearchHeaderDetail() {
      var cdo = {
        templateUrl: 'requisition-search-header-detail.template.html',
        controller: RequisitionSearchHeaderDetailController,
        bindings: {
          dataModel: '<model',
          stateModel: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionSearchHeaderDetailController(DynamicLookupService) {
      var self = this;
      self.model = undefined;

      self.$onInit = function onInit() {
        self.model = self.dataModel.clone();
        self.model.originStatusDescription = DynamicLookupService.getRequisitionOriginStatuses().getDescriptionByCode(String(self.model.originStatusCode));
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
