;(
  function() {
    'use strict';

    angular
      .module('app.layout.common.scrolling')
      .directive('scrollingTracker', scrollingTrackerDdo)
    ;

    function /* @ngInject */scrollingTrackerDdo($log) {
      return {
        restrict: 'A',
        scope: {
          changeHandler: '&scrollingTracker',
          initialScrollPosition: '<'
        },
        link: function link(scope, iElement, iAttrs) {
          var initialScrollPosition = scope.initialScrollPosition;
          var raw = iElement[0];
          iElement.bind('scroll', function () {
            scope.changeHandler({
              scrollPosition: raw.scrollTop
            });
          });

          var disabled = false;
          scope.$watch(
            function watched() {
              return iElement.height();
            },
            function(newValue, oldValue) {
              if (newValue > 0 && initialScrollPosition && !disabled) {
                $log.log(initialScrollPosition);
                raw.scrollTop = initialScrollPosition;
                disabled = true;
              }
            },
            true
          );
        }
      };
    }
  }
)();
