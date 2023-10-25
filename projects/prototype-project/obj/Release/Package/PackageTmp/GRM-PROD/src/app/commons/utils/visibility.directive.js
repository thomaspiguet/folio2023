;(
  function() {
    'use strict';

    angular
      .module('app.commons.utils')
      .directive('visibility', visibilityDirective)
    ;

    /* @ngInject */
    function visibilityDirective() {
      return {
        restrict: 'A',
        multiElement: true,
        link: function(scope, element, attr) {
          scope.$watch(attr.visibility, function visibilityWatchAction(value) {
            element[0].style.visibility = value ? 'visible' : 'hidden';
          });
        }
      };
    }
  }
)();
