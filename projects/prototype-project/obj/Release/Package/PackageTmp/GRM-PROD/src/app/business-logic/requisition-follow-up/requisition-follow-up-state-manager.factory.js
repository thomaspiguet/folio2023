;(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-follow-up')
      .factory('RequisitionFollowUpStateManager', RequisitionFollowUpStateManagerFactory)
    ;

    /* @ngInject */
    function RequisitionFollowUpStateManagerFactory(RequisitionFollowUpStateModel) {
      var self = this;

      var stateModel = new RequisitionFollowUpStateModel();

      self.initialize = function initialize(configObj) {
        var config = _.extend({
          clearState: false,
          requesterId: undefined,
          statusGroup: undefined,
          status: undefined
        }, configObj);

        if (config.clearState) {
          stateModel = new RequisitionFollowUpStateModel(config);
        }
        else {
          if (stateModel.isPristine) {
            if (config.requesterId) {
              stateModel.requesterId = config.requesterId;
            }
            if (config.statusGroup) {
              stateModel.statusGroups = config.statusGroup;
              if (!_.isArray(stateModel.statusGroups)) {
                stateModel.statusGroups = [stateModel.statusGroups];
              }
            }
            if (config.status) {
              stateModel.statuses = config.status;
              if (!_.isArray(config.status)) {
                stateModel.statuses = [stateModel.statuses];
              }
            }
          }
        }
      };

      self.getRequisitionFollowUpStateModel = function getRequisitionFollowUpStateModel() {
        return stateModel;
      };

      self.updateState = function updateState(obj) {
        stateModel = new RequisitionFollowUpStateModel(obj);
      };

      return self;
    }
  }
)();
