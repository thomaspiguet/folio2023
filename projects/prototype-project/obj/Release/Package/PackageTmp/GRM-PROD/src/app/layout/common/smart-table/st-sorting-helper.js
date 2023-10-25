;(
  function() {
    'use strict';

    angular
      .module('app.layout.common.smart-table')
      .directive('stSortingHelper', stSortingHelperDirective)
    ;

    /* @ngInject */
    function stSortingHelperDirective($parse) {
      return {
        restrict: 'A',
        require: 'stTable',
        link: function linkingFunction(scope, elem, attrs, ctrl) {
          var forceUpdate = false;
          var sortingGetter = $parse(attrs.stSortingHelper);

          scope.$watch(
            function watched() {
              return sortingGetter(scope);
            },
            function listener(newValue, oldValue) {
              if ((newValue !== oldValue) || forceUpdate) {
                if (forceUpdate) {
                  forceUpdate = false;
                }

                var sorting = newValue;
                var sort = ctrl.tableState().sort;

                // This (re) assigns values... used to restore state, since
                // the pipe function is exited when data is not in yet
                sort.predicate = sorting.by[0];
                sort.reverse = sorting.descending;
              }
            },
            true
          );

          var sorting = sortingGetter(scope);
          if (sorting && sorting.by) {
            forceUpdate = true;
          }
        }
      };
    }
  }
)();
