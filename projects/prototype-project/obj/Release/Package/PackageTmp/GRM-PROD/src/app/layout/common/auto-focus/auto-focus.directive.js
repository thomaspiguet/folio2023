(
  function() {
    'use strict';
    angular
      .module('app.layout.common.auto-focus')
      .directive('autoFocus', autoFocus);

    /* @ngInject */
    function autoFocus($log, $timeout) {
      var cdo = {
        link: autoFocusLink
      };

    function autoFocusLink(scope, element, attrs) {

        if (_.isNil(attrs.afterTransitionOf)) {
            element[0].focus();
            return;
        }

        var transitionedParent = element.parents(attrs.afterTransitionOf)[0];
        var transitionedParentElement = angular.element(transitionedParent);

        transitionedParentElement.on('transitionend', onTransitionedParentHandler);

        function onTransitionedParentHandler($event) {
            if ($event.target === transitionedParent) {
                /*var transitionDelay = transitionedParentElement.css('transition-delay').replace('s', '');
                 var delayInMs = !_.isNil(transitionDelay) ? _.toNumber(transitionDelay) * 1000 : 0;*/
                element[0].focus();
                transitionedParentElement.off('transitionend', onTransitionedParentHandler);
            }
        }
    }
    return cdo;
  }
 }
)();
