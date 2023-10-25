(
  function() {
    'use strict';

    angular
      .module('app.commons.form')
      .directive('manageFormState', manageFormState)
    ;

    /* @ngInject */
    function manageFormState($parse, FormService) {
      var ddo = {};

      ddo.restrict = 'A';
      ddo.require = 'form';
      ddo.link = function link(scope, element, attrs, formCtrl) {
        // Register the form
        FormService.register(scope, element, formCtrl);

        // Unregister when the form is destroyed
        scope.$on('$destroy', function () {
          FormService.unregister(scope);
        });
      };

      return ddo;
    }
  }
)();
