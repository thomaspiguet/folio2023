(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-item-navigator')
      .component('requisitionItemNavigator', requisitionItemNavigator())
    ;

    function requisitionItemNavigator() {
      var cdo = {
        templateUrl: 'requisition-item-navigator.template.html',
        controller: RequisitionItemNavigatorController,
        bindings: {
          productId: '<',
          actionHandler: '&',
          stateModel: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionItemNavigatorController($filter, RequisitionItemNavigatorActions) {
      var self = this;

      function computeLabel() {
        self.label = $filter('translate')('noProductCode');
        if (!_.isNil(self.productId) && !_.isEmpty(self.productId)) {
          self.label = self.productId;
        }
      }

      self.$onInit = function onInit() {
        computeLabel();
      };

      self.$onChanges = function onChanges(changesObj) {
        if (changesObj.productId) {
          if (changesObj.productId.previousValue !== changesObj.productId.currentValue) {
            computeLabel();
          }
        }
      };

      self.onPrevious = function onPrevious($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: RequisitionItemNavigatorActions.onPrevious
          }
        });
      };

      self.onNext = function onNext($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: RequisitionItemNavigatorActions.onNext
          }
        });
      };
    }
  }
)();
