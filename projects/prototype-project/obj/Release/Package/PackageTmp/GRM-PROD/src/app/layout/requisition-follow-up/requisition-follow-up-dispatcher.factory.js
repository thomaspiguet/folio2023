;(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-follow-up')
      .factory('RequisitionFollowUpDispatcher', RequisitionFollowUpDispatcherFactory)
    ;

    /* @ngInject */
    function RequisitionFollowUpDispatcherFactory($log, $stateParams, RequisitionFollowUpStateManager) {
      var self = this;

      self.initialize = function initialize(obj) {
        var configObj = _.extend({
          clearState: false,
          requesterId: undefined,
          statusGroup: undefined,
          status: undefined
        }, obj);
        RequisitionFollowUpStateManager.initialize(configObj);
      };

      self.onStateChange = function onStateChange(obj) {
        RequisitionFollowUpStateManager.updateState(obj);
      };

      self.getStateModel = function getStateModel() {
        return RequisitionFollowUpStateManager.getRequisitionFollowUpStateModel();
      };

      return self;
    }
  }
)();
