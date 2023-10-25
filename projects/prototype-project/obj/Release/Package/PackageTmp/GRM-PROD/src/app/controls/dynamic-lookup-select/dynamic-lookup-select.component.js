(
  function() {
    'use strict';

    angular
      .module('app.controls.dynamic-lookup-select')
      .component('dynamicLookupSelect', dynamicLookupSelect());

    function dynamicLookupSelect() {
      var cdo = {
        templateUrl: 'dynamic-lookup-select.template.html',
        bindings: {
          changed: '&ngChange',
          disabled: '=ngDisabled',
          selectId: '@',
          selectName: '@',
          lookupName: '@',
          multiple: '<',
          model: '=ngModel',
          required: '=ngRequired'
        },
        controller: DynamicLookupSelectController
      };

      /*@ngInject*/
      function DynamicLookupSelectController($log, $timeout, DynamicLookupService) {
        var ctrl = this;

        ctrl.$onInit = function onInit() {
          ctrl.collection = DynamicLookupService.getByName(ctrl.lookupName);
        };

        ctrl.getLookupLocalizedDescription = function(code) {
          return ctrl.collection.getDescriptionByCode(code);
        };

        ctrl.updateModel = function () {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            ctrl.changed();
          });
        };

      }
      return cdo;
    }
 }
)();
