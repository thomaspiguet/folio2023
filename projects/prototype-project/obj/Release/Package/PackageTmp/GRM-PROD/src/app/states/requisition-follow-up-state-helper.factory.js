;(
  function() {
    'use strict';

    angular
      .module('app.states')
      .factory('RequisitionFollowUpStateHelper', RequisitionFollowUpStateHelperFactory)
    ;

    /* @ngInject */
    function RequisitionFollowUpStateHelperFactory($stateParams, RequisitionFollowUpDispatcher, UrlHelper) {
      var self = this;

      self.initialize = function initialize($scope) {
        $scope.$ctrl = RequisitionFollowUpDispatcher;

        var requesterId;
        var statusGroup;
        var status;

        if ($stateParams.requesterId) {
          requesterId = $stateParams.requesterId;
        }
        if ($stateParams.statusGroup) {
          statusGroup = $stateParams.statusGroup;
        }
        if ($stateParams.status) {
          status = $stateParams.status;
        }

        RequisitionFollowUpDispatcher.initialize({
          clearState: $stateParams.clearState,
          requesterI: requesterId,
          statusGroup: statusGroup,
          status: status
        });

        $stateParams.clearState = false;

        if (requesterId || statusGroup || status) {
          UrlHelper.synchronizeUrl({
            params: {
              requesterId: undefined,
              statusGroup: undefined,
              status: undefined
            }
          });
        }
      };

      return self;
    }
  }
)();
