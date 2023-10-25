(
  function() {
    'use strict';

    angular
      .module('app.states')
      .factory('RequisitionTemplateStateHelper', RequisitionTemplateStateHelperFactory);

    /* @ngInject */
    function RequisitionTemplateStateHelperFactory($log,
      $state,
      $stateParams,
      RequisitionTemplateDispatcher,
      RequisitionTemplateItemsActions
    ) {
      var self = this;
      self.deregisterApplyProductsCart = undefined;

      self.initialize = function initialize($scope) {
        $scope.$ctrl = RequisitionTemplateDispatcher;
        
        // TODO: this may not be optimal... see if handler could registered only once
        if (self.deregisterApplyProductsCart) {
          self.deregisterApplyProductsCart();
        }
        self.deregisterApplyProductsCart = $scope.$on('applyProductsCart', onApplyProductsCart);
      };
      
      self.reset = function reset(clear, stateParams) {
        var params = _.extend({}, stateParams);
        RequisitionTemplateDispatcher.initialize({
          id: clear ? undefined : params.id,
          iid: clear ? undefined : params.iid
        });
      };
      
      function onApplyProductsCart(ev, obj) {
        RequisitionTemplateDispatcher.onRequisitionTemplateItemsAction({
          action: RequisitionTemplateItemsActions.onAddRequisitionTemplateItems,
          model: obj.model
        });
      }      

      return self;
    }
  }
)();
