(
  function() {
    'use strict';

    angular
      .module('app.states')
      .factory('ProductSearchStateHelper', ProductSearchStateHelperFactory)
    ;

    /* @ngInject */
    function ProductSearchStateHelperFactory($log, $stateParams, ProductDispatcher) {
      var self = this;

      self.initialize = function initialize($scope) {
        ProductDispatcher.initialize({
          id: $stateParams.id
        });
        $scope.$ctrl = ProductDispatcher;
        $scope.$ctrl.onClear = function onClear() {
          $scope.$broadcast('onClear');
        };
      };

      return self;
    }
  }
)();
