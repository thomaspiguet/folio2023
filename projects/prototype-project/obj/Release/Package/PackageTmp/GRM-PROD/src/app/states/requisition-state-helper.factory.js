(
  function() {
    'use strict';

    angular
      .module('app.states')
      .factory('RequisitionStateHelper', RequisitionStateHelperFactory)
    ;

    /* @ngInject */
    function RequisitionStateHelperFactory(
      // $state,
      $stateParams,
      RequisitionItemListActions,
      RequisitionEditDispatcher
    ) {
      var self = this;
      self.deregisterApplyProductsCart = undefined;

      self.initialize = function initialize($scope) {

        $scope.$ctrl = RequisitionEditDispatcher;

        // TODO: this may not be optimal... see if handler could registered only once
        if (self.deregisterApplyProductsCart) {
          self.deregisterApplyProductsCart();
        }
        self.deregisterApplyProductsCart = $scope.$on('applyProductsCart', onApplyProductsCart);
      };

      self.reset = function reset(clear, stateParams) {
        var params = _.extend({}, stateParams);
        RequisitionEditDispatcher.initialize({
          id: clear ? undefined : params.id,
          iid: clear ? undefined : params.iid,
          uncataloguedProductSavedValues: clear ? undefined : params.uncataloguedProductSavedValues
        });
      };

      function onApplyProductsCart(ev, obj) {
        RequisitionEditDispatcher.onRequisitionItemListAction({
          action: RequisitionItemListActions.onAddRequisitionItems,
          model: obj.model
        });
      }

      return self;
    }
  }
)();
