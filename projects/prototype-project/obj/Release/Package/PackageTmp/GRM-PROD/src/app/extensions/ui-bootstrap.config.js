/**
 * Add a configuration block to the native angular routing mechanism, which is used by
 * the angular-openid module. The $routeProvider service is configured to NOT eagerly
 * instantiate the $route service.
 *
 * @see {@link https://github.com/angular/angular.js/blob/master/CHANGELOG.md#ngroute-due-to-1}
 * @see {@link https://docs.angularjs.org/api/ngRoute/provider/$routeProvider}
 */

(
  function() {
    'use strict';

    angular
      .module('ui.bootstrap')
      .config(config)
    ;

    /* @ngInject */
    function config($provide, $uibTooltipProvider) {

      var defaultPopoverConfig = {
        class: 'error-popover',
        trigger: '\'mouseenter\''
      };

      $uibTooltipProvider.options({
        placement: 'auto top',
        appendToBody: true
      });

      /*Here, we decorate uibPopoverHtml directive, as we want to default some values that we
      cannot set with the $uibTooltipProvider. */
      $provide.decorator('uibPopoverHtmlDirective',
        /* @ngInject */function uibPopoverHtmlDirectiveDecorator($delegate) {

          var directive = $delegate[0];
          directive.priority = 1;

          var compile = directive.compile;

          directive.compile = function(tElement, tAttrs) {
            if (_.isNil(tAttrs.popoverClass)) {
              tAttrs.popoverClass = defaultPopoverConfig.class;
            }
            if (_.isNil(tAttrs.popoverTrigger)) {
              tAttrs.popoverTrigger = defaultPopoverConfig.trigger;
            }
            var link = compile.apply(this, arguments);
            return function(scope, elem, attrs) {
              link.apply(this, arguments);
            };
          };

          return $delegate;
        }
      );
    }
  }
)();

