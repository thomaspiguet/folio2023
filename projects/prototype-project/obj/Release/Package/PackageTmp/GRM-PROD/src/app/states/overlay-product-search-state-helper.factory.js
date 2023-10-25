(
  function() {
    'use strict';

    angular
      .module('app.states')
      .factory('OverlayProductSearchStateHelper', OverlayProductSearchStateHelperFactory)
    ;

    /* @ngInject */
    function OverlayProductSearchStateHelperFactory($state, $stateParams, ProductDispatcher) {
      var self = this;

      self.initialize = function initialize($scope) {
        ProductDispatcher.initialize($stateParams.productParamModel);
        $scope.$ctrl = ProductDispatcher;

        // Add the following handlers to dispatcher
        $scope.$ctrl.onCloseOverlay = function onCloseOverlay($event, apply) {
          if ($event) {
            $event.preventDefault();
          }

          if (apply) {
            $scope.$emit('applyProductsCart', {
              model: ProductDispatcher.getProductCartItemsIds()
              }
            );
          }

          $state.go('^', {}, { ignoreDirtyState: true });
        };

        $scope.$ctrl.onClear = function onClear() {
          $scope.$broadcast('onClear');
        };
      };

      return self;
    }
  }
)();
