(
  function() {
    'use strict';

    angular
      .module('app.states')
      .factory('RequisitionSearchStateHelper', RequisitionSearchStateHelperFactory)
    ;

    /* @ngInject */
    function RequisitionSearchStateHelperFactory(
      $log,
      $stateParams,
      RequisitionSearchDispatcher
    ) {
      var self = this;

      self.initialize = function initialize($scope) {

        $scope.$ctrl = RequisitionSearchDispatcher;
        $scope.$ctrl.onClear = function onClear() {
          $scope.$broadcast('onClear');
        };

        RequisitionSearchDispatcher.initialize({
          clearState: $stateParams.clearState
        });
        $stateParams.clearState = false;
      };

      return self;
    }
  }
)();
