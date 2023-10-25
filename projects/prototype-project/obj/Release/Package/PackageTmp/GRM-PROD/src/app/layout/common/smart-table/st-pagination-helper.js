(
  function() {
    'use strict';
    angular
      .module('app.layout.common.smart-table')
      .directive('stPaginationHelper', stPaginationHelper);

    /* @ngInject */
    function stPaginationHelper($log, $parse) {
      return {
        require: 'stTable',
        restrict: 'A',
        link: function linkingFunction(scope, element, attrs, ctrl) {
          var forceUpdate = false;
          var pagingGetter = $parse(attrs.stPaginationHelper);

          scope.$watch(
            function watched() {
              return pagingGetter(scope);
            },
            function(newValue, oldValue) {
              if ((newValue !== oldValue) || forceUpdate) {
                if (forceUpdate) {
                  forceUpdate = false;
                }

                var paging = newValue;
                var pagination = ctrl.tableState().pagination;
                var itemCount = paging.total;

                // This (re) assigns values... used to restore state, since
                // the pipe function is exited when data is not in yet
                if (pagination.totalItemCount !== paging.total) {
                  pagination.totalItemCount = paging.total;
                  pagination.numberOfPages = Math.ceil(paging.total / pagination.number);
                }
                pagination.start = paging.offset * paging.size;
              }
            },
            true
          );

          var paging = pagingGetter(scope);
          if (paging && paging.total && parseInt(paging.total) > 0) {
            forceUpdate = true;
          }
        }
      };
    }
  }
)();
