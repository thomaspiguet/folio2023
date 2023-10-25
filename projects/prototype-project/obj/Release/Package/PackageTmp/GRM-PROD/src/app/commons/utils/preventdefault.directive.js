(
  function() {
    'use strict';

    angular
      .module('app.commons.utils')
      .directive('preventDefault', preventDefault)
    ;

    /* @ngInject */
    function preventDefault() {
      var ddo = {};

      ddo.restrict = 'A';
      ddo.link = function link($scope, $element, $attrs) {
        $element.bind('click', function (event) {
          if (event) {
            event.preventDefault();
          }
        });
      };

      return ddo;
    }
  }
)();
