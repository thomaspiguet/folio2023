(
  function() {
    'use strict';
    angular
      .module('app.layout.common.smart-table')
      .directive('stNumberOfPagesSetter', stNumberOfPagesSetter);

    /* @ngInject */
    function stNumberOfPagesSetter($log) {
      var cdo = {
        require: 'stTable',
        link: stNumberOfPagesSetterLink
      };

    function stNumberOfPagesSetterLink(scope, element, attrs, ctrl) {
      scope.$watch(attrs.stNumberOfPagesSetter, function(newValue, oldValue) {
        if (parseInt(newValue) !== parseInt(oldValue)) {
          var itemCount = parseInt(newValue);
          var pagination = ctrl.tableState().pagination;
          pagination.totalItemCount = itemCount;
          pagination.numberOfPages = Math.ceil(itemCount / pagination.number);
          // if (pagination.numberOfPages === 0) {
          //   pagination.start = 0;
          // }
          pagination.start = 0;
        }
      });
    }
    return cdo;
  }
 }
)();
