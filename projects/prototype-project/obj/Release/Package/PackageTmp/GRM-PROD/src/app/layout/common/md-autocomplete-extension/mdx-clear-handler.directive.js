(
  function() {
    'use strict';
    angular
      .module('app.layout.common.md-autocomplete-extension')
      .directive('mdxClearHandler', mdxClearHandler);

    /*@ngInject*/
    function mdxClearHandler($log) {
      var cdo = {
        require: 'mdAutocomplete',
        link: mdxClearHandlerLink
      };

    function mdxClearHandlerLink(scope, element, attrs, ctrl) {
      function overrideClear(fn) {
        return function() {
          var input = element.find('input');
          input.val(null);
          var result = fn.apply(this, arguments);
          return result;
        };
      }
      ctrl.clear = overrideClear(ctrl.clear);

      //Listen "onClear" event. onClear event is triggered when a "clear" button is clicked. (Mostly in search criterias sections)
      scope.$on('onClear', function() {
        if (ctrl.scope.searchText !== '') {
          scope.$emit('reinitialize');
        }
        ctrl.scope.searchText = '';
      });
    }
    return cdo;
  }
 }
)();
