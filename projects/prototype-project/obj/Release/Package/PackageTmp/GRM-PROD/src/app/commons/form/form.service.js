(
  function() {
    'use strict';

    angular
      .module('app.commons.form')
      .factory('FormService', FormService);

    /* @ngInject */
    function FormService($q, $log, $parse, $timeout) {

      var service = {
        forms: []
      };

      // Register a new form to the service
      service.register = function(scope, element, controller) {
        service.forms.push({
          scope: scope,
          element: element,
          controller: controller
        });
      };

      // Unregister a form to the service
      service.unregister = function (scope) {
        angular.forEach(service.forms, function (form) {
          if (form.scope.$id === scope.$id)  {
            service.forms.splice(service.forms.indexOf(form), 1);
          }
        });
      };

      // Returns true if any form is in a dirty state
      service.isDirty = function () {
        var result = false;
        angular.forEach(service.forms, function (form) {
          if (form.controller.$dirty) {
            result = true;
          }
        });
        return result;
      };

      // Returns true if all forms are valid
      service.isValid = function () {
        var result = true;
        angular.forEach(service.forms, function (form) {
          if (!form.controller.$valid) {
            result = false;
          }
        });
        return result;
      };

      /**
       * Get dirty state of a specific named form.
       *
       * @param {string} formName - name of the form as string.
       * @returns {boolean}
       */
      service.isFormDirty = function isFormDirty(formName) {
        var form = _.find(service.forms, function(form) { return form.controller.$name === formName; });
        if (!_.isNil(form)) {
          return form.controller.$dirty;
        }
        return false;
      };

      /**
       * Get invalidity state of a specific named form.
       *
       * @param {string} formName - name of the form as string.
       * @returns {boolean}
       */
      service.isFormInvalid = function isFormValid(formName) {
        var form = _.find(service.forms, function(form) { return form.controller.$name === formName; });
        if (!_.isNil(form)) {
          return form.controller.$invalid;
        }
        return false;
      };

      // Sets all forms to pristine
      service.setPristine = function() {
        angular.forEach(service.forms, function (form) {
          form.controller.$setPristine();
        });
      };
      // Sets all forms to dirty
      service.setDirty = function () {
        angular.forEach(service.forms, function (form) {
          form.controller.$setDirty();
        });
      };

      return service;
    }
  }
)();
