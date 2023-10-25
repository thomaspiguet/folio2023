(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.authorizers-management')
      .component('authorizersManagement', authorizersManagement())
    ;

    function authorizersManagement() {
      var cdo = {
        templateUrl: 'authorizers-management.template.html',
        controller: AuthorizersManagementController,
        bindings: {
          editHandler: '&',
          stateModel: '<',
          model: '<',
          configuration: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function AuthorizersManagementController(AuthorizersManagementActions, $log) {

      var ctrl = this;
      ctrl.dataModel = undefined;

      this.$onInit = function onInit() {
        // Initialize models
        ctrl.dataModel = ctrl.model.clone();
        synchronize();
      };

      ctrl.onSelectAuthorizer = function onSelectAuthorizer() {
        ctrl.editHandler({model: ctrl.dataModel});
        synchronize();
      };

      /*ctrl.onAddAuthorizer = function onAddAuthorizer($event) {
        if ($event) {
          ctrl.actionHandler({
                action: AuthorizersManagementActions.addAuthorizer,
                params : {
                  requisitionId: ctrl.configuration.requisitionId,
                  authorizerId: ctrl.model.authorizer.id
                }
              }).then(
              function success(response) {
                $log.log('addSuccess');
              }
          );
        }
      };

      ctrl.onReplaceAuthorizer = function onReplaceAuthorizer($event) {
        if ($event) {
          ctrl.actionHandler({
              requisitionId: ctrl.configuration.requisitionId,
              authorizerFromId: ctrl.model.authorizerFrom.id,
              authorizerToId: ctrl.model.authorizerTo.id
          });
        }
      };*/

      function synchronize() {
        ctrl.stateModel.authorizerTo.disabled = _.isNil(ctrl.dataModel.authorizerFrom);
      }

    }
  }
)();
