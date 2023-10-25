(
  function() {
    'use strict';

    angular
      .module('app.commons.utils')
      .directive('stopPropagation', stopPropagation)
    ;

    /* @ngInject */
    function stopPropagation() {
      var ddo = {};

      ddo.restrict = 'A';
      ddo.link = function link($scope, $element, $attrs) {
        $element.bind('click', function (event) {
          if (event) {
            event.stopPropagation();
          }
        });
      };

      return ddo;
    }
  }
)();
