(
  function() {
    'use strict';

    angular
      .module('app.layout.common.auto-adjust-header')
      .directive('autoAdjustHeader', autoAdjustHeader);

    /* @ngInject */
    function autoAdjustHeader($timeout, $window) {
      function AutoAdjustHeaderLink(scope, element, attrs) {
        var tbody = new Clay(element[0].querySelector('tbody'));

        function resizeHandler() {
          var theader = angular.element(element[0].querySelector('thead'));
          var height = angular.element(tbody.selector).height();
          var scrollHeight = angular.element(tbody.selector)[0].scrollHeight;
          if (scrollHeight > height) {
            theader.css('padding-right', '17px');
          }
          else {
            theader.css('padding-right', '0px');
          }
        }

        tbody.on('resize', resizeHandler);

        //
        // Provide the ability to watch a given scope attribute when directive is ran
        // for the first time, in order to force trigger the resize handler function once.
        // The resize is triggered once, and then is unregistered.
        //
        if (attrs.autoAdjustHeader) {
          var unregisterWatch = scope.$watch(
            function(scope) {
              return scope.$eval(attrs.autoAdjustHeader);
            },
            function(value) {
              if (value && value.length) {
                $timeout(function() {
                  resizeHandler();
                  unregisterWatch();
                }, 100);
              }
            }
          );
        }
      }

      var ddo = {
        restrict: 'A',
        link: AutoAdjustHeaderLink
      };

      return ddo;
    }

 }
)();
