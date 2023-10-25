(
  function() {
    'use strict';
    angular
      .module('app.layout.common.auto-select')
      .directive('autoSelect', autoSelect);

    /* @ngInject */
    function autoSelect($log, $document) {
      var cdo = {
        scope: {
          autoSelect: '<'
        },
        link: autoSelectLink
      };

    function autoSelectLink(scope, element, attrs) {
      scope.$watch('autoSelect', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (!_.isNil(newValue) && element[0] === $document[0].activeElement) {
            element.select();
          }
        }
      });
    }
    return cdo;
  }
 }
)();
