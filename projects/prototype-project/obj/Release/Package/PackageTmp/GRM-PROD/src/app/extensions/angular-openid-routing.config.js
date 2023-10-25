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
      .module('angular-openid')
      .config(angularOpenIdRoutingConfig)
    ;

    /* @ngInject */
    function angularOpenIdRoutingConfig($routeProvider) {
      $routeProvider.eagerInstantiationEnabled(false);
    }
  }
)();

