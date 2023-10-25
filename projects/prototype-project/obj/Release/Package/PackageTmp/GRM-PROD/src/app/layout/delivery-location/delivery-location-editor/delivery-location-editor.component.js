(
  function() {
    'use strict';

    angular
      .module('app.layout.delivery-location.delivery-location-editor')
      .component('deliveryLocationEditor', deliveryLocationEditor())
    ;

    function deliveryLocationEditor() {
      var cdo = {
        templateUrl: 'delivery-location-editor.template.html',
        controller: DeliveryLocationCreationController,
        bindings: {
          codeMaxLength: '<',
          editHandler: '&',
          department: '<',
          initialValue: '<',
          dataModel: '<model'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function DeliveryLocationCreationController() {

      var ctrl = this;

      /**
       * Initialization lifecycle hook. Parse the initial value and initialize local data model.
       */
      ctrl.$onInit = function onInit() {
        parseInitialValue(ctrl.initialValue);
      };

      ctrl.handleEdit = function handleEdit() {
        ctrl.editHandler({
          model: _.extend({
            departmentId: ctrl.department.id
          }, ctrl.dataModel)
        });
      };

      /**
       * A formatter helper for the code value, used when the code input is blurred.
       */
      ctrl.formatCode = function formatCode($event) {
        if ($event) {
          $event.preventDefault();
        }
        if (_.isNil(ctrl.dataModel.code) || _.isEmpty(ctrl.dataModel.code)) {
          // Nothing to format - return
          return;
        }
        // Uppercase the code value
        ctrl.dataModel.code = ctrl.dataModel.code.toUpperCase();

        ctrl.handleEdit();
      };

      /**
       * Parse the provided value to either code/description OR description
       */
      function parseInitialValue(value) {
        if (_.isNil(value) || _.isEmpty(value)) {
          // Nothing to parse - return
          return '';
        }

        // Best effort: if there is a dash in the provided value, assume it is a separator, ie [code - description]
        var tokens = value.split('-');
        if (tokens.length > 1) {
          // Uppercase the code value
          ctrl.dataModel.code = tokens[0].trim().toUpperCase();
          ctrl.dataModel.description = tokens[1].trim();
        }
        else {
          // ... otherwise, assume parsed value is a (partial?) description
          ctrl.dataModel.description = tokens[0].trim();
        }
        ctrl.handleEdit();
      }
    }
  }
)();
