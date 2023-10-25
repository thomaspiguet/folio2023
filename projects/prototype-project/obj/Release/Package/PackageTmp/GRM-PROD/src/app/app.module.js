/**
 * Logibec's web based GRM application
 * @module app
 * @license Logibec
 */
(
  function() {
    'use strict';

    angular.module('app', [
      // Third party dependencies
      'ngAnimate',
      'ngMaterial',
      //'ngRoute',
      'ngSanitize',
      'angular-openid',
      'angularUtils.directives.uiBreadcrumbs',
      'chart.js',
      'smart-table',
      'tmh.dynamicLocale',

      'ui.bootstrap',
      'ui.router',
      'ui.validate',
      'uuid4',

      // Local dependencies
      'app.business-logic',
      'app.controls',
      'app.commons',
      'app.dataservices',
      'app.filters',
      'app.layout',
      'app.models',
      'app.platform',
      'app.states',
      'app.validators',
      'app.views'
    ]);

  }
)();
