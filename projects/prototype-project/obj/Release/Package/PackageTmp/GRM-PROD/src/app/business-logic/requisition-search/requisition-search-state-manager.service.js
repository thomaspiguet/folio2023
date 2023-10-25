(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-search')
      .factory('RequisitionSearchStateManager', RequisitionSearchStateManagerFactory)
    ;

    /* @ngInject */
    function RequisitionSearchStateManagerFactory(
      RequisitionSearchStateModel
    ) {
      var self = this;

      var stateModel = new RequisitionSearchStateModel();

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          clearState: false
        }, configParams);

        if (config.clearState) {
          stateModel = new RequisitionSearchStateModel();
        }
      };

      self.getRequisitionSearchStateModel = function getRequisitionSearchStateModel() {
        return stateModel;
      };

      self.updateState = function updateState(stateObj) {
        stateModel = new RequisitionSearchStateModel(stateObj);
      };

      return self;
    }
  }
)();
