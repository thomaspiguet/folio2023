(
  function() {
    'use strict';

    angular
      .module('app.states')
      .factory('RequisitionTemplateSearchStateHelper', RequisitionTemplateSearchStateHelperFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateSearchStateHelperFactory(
      $log,
      $stateParams,
      RequisitionTemplateSearchDispatcher
    ) {
      var self = this;

      self.initialize = function initialize($scope) {

        $scope.$ctrl = RequisitionTemplateSearchDispatcher;
        $scope.$ctrl.onClear = function onClear() {
          $scope.$broadcast('onClear');
        };

        RequisitionTemplateSearchDispatcher.initialize({
          clearState: $stateParams.clearState
        });
        $stateParams.clearState = false;
      };

      return self;
    }
  }
)();
