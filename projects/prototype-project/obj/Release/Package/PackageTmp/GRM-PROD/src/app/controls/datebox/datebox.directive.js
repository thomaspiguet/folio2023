(
  function() {
    'use strict';

    angular
      .module('app.controls.datebox')
      .directive('dateBox', dateBox)
    ;

    /* @ngInject */
    function dateBox() {
      var ddo = {
        restrict:'E',
        require: 'ngModel',
        templateUrl: 'datebox.template.html',
        scope: {
          model: '=ngModel', // Date
          placeholder: '@', // Text into placeholder.
          disabled: '=ngDisabled', // If required disable the component is marked as true.
          inputName: '@',
          required: '=ngRequired', // If is required the component is marked as true.
          minDate: '=',
          maxDate: '='
        },
        link: RequesterListLink
      };

      function RequesterListLink(scope, element, attrs, ctrl) {
        scope.updateModel = function() {
          ctrl.$setViewValue(scope.model);
        };

        ctrl.$viewChangeListeners.push(function() {
          scope.$eval(attrs.ngChange);
        });
      }
      return ddo;
    }
  }
)();
