(
  function() {
    'use strict';

    angular
      .module('app.layout.common.resizable')
      .directive('resizable', resizable);

    /* @ngInject */
    function resizable($log) {
      var cdo = {
        restrict: 'A',
        link: {
            post: resizableLink
        }
      };

      function resizableLink(scope, element, attrs) {
          var clayedElement;
          if (!_.isNil(attrs.direction)) {
            if (attrs.direction !== 'vertical' || attrs.direction !== 'horizontal') {
              $log.warn('resizable directive : direction attribute, if provided, must be \'vertical\' or \'horizontal\'. horizontal defaulted.');
              clayedElement = new Clay(element[0], {resize: 'horizontal'});
            } else {
              clayedElement = new Clay(element[0], {resize: attrs.direction});
            }
          } else {
            clayedElement = new Clay(element[0]);
          }
      }
        return cdo;
    }

 }
)();
