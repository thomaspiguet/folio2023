(
  function() {
    'use strict';

    angular
      .module('app.layout.common.blur')
      .directive('blur', blur);

    /* @ngInject */
    function blur($parse, $timeout, $compile, $log) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          element.on('click', function () {
            element.blur();
          });
        }
      };
    }

  }
)();
