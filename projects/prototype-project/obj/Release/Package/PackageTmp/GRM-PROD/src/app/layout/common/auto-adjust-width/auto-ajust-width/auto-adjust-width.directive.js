(
  function() {
    'use strict';

    angular
      .module('app.layout.common.auto-adjust-width')
      .directive('autoAdjustWidth', autoAdjustWidth);

    /* @ngInject */
    function autoAdjustWidth() {
      var cdo = {
        restrict: 'A',
        link: AutoAdjustHeaderLink
      };

    function AutoAdjustHeaderLink(scope, element, attrs) {
      var initialWidth;
      var autoYOverflowSibbling = new Clay(angular.element(element[0]).parent()[0].querySelector(attrs.autoAdjustWidth));
      var autoYOverflowSibblingElement = angular.element(autoYOverflowSibbling.el);
      autoYOverflowSibblingElement.css('resize', 'none');

      autoYOverflowSibbling.on('resize', function() {
        element.css('width', autoYOverflowSibbling.el.clientWidth + 'px');
      });
    }
      return cdo;
    }
 }
)();
