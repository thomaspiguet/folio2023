(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-progress')
      .component('requisitionProgress', requisitionProgress())
    ;

    function requisitionProgress() {
      var cdo = {
        templateUrl: 'requisition-progress.template.html',
        controller: RequisitionProgressController,
        bindings: {
          requisitionProgressModel: '<model'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionProgressController() {
      var ctrl = this;

      this.model = this.requisitionProgressModel;

      ctrl.$onChanges = function (changes) {
        ctrl.model = ctrl.requisitionProgressModel.clone(ctrl.requisitionProgressModel);
      };

      // TODO : use lookup
      this.isToComplete = function isToComplete() { return ctrl.model.status === 1; };
      this.isToAuthorize = function isToAuthorize() { return ctrl.model.status === 2; };
      this.isInPreparation = function isInPreparation() { return ctrl.model.status === 3; };
      this.isOrdered = function isOrdered() { return ctrl.model.status === 4; };
      this.isAwaitingDelivery = function isAwaitingDelivery() { return ctrl.model.status === 5; };
      this.isDelivered = function isDelivered() { return ctrl.model.status === 6; };
    }
  }
)();
