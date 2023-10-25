;(
  function() {
    'use strict';

    angular
      .module('app.states')
      .factory('RequisitionAuthorizationStateHelper', RequisitionAuthorizationStateHelperFactory)
    ;

    /* @ngInject */
    function RequisitionAuthorizationStateHelperFactory($stateParams, RequisitionAuthorizationDispatcher, UrlHelper) {
      var self = this;

      self.initialize = function initialize($scope) {
        $scope.$ctrl = RequisitionAuthorizationDispatcher;

        var amountRangeId;
        if ($stateParams.amountRangeId) {
          amountRangeId = parseInt($stateParams.amountRangeId, 10);
          if (_.isNaN(amountRangeId)) {
            amountRangeId = $stateParams.amountRangeId;
          }
        }

        RequisitionAuthorizationDispatcher.initialize({
          clearState: $stateParams.clearState,
          amountRangeId: amountRangeId
        });

        $stateParams.clearState = false;

        if (amountRangeId) {
          // Remove amountRangeId parameter from URL
          UrlHelper.synchronizeUrl({
            params: {
              amountRangeId: undefined
            }
          });
        }
      };

      return self;
    }
  }
)();
