(
  function() {
    'use strict';

    angular
      .module('app.commons.navigation')
      .provider('NavigationService', NavigationServiceProvider)
    ;

    /* @ngInject */
    function NavigationServiceProvider() {
      var provider = this;

      var currentNavigationItem;
      var topLevelNavigationItems = [];

      provider.registerTopLevelNavigationItem = function registerTopLevelNavigationItem(obj) {
        topLevelNavigationItems.push(obj);
      };

      /* @ngInject */
      provider.$get = function($state) {
        var service = {};

        service.getCurrentNavigationItem = function getCurrentNavigationItem() {
          return currentNavigationItem;
        };

        service.setCurrentNavigationItem = function setCurrentNavigationItem(navigationItem) {
          currentNavigationItem = navigationItem;
        };

        service.containsNavigationItem = function containsNavigationItem(navigationItem) {
          if (_.isNil(currentNavigationItem)) {
            return false;
          }

          // TODO: use this if we need to detect nested levels
          // return _.isEmpty(_.difference(_.split(currentNavigationItem, '.', 3), _.split(navigationItem, '.', 3)));
          return currentNavigationItem.indexOf(navigationItem) >= 0;
        };

        service.navigateTo = function navigateTo(navigationItem, params, options) {
          return $state.go(navigationItem, params, options);
        };

        service.getTopLevelNavigationItems = function getTopLevelNavigationItems() {
          return topLevelNavigationItems;
        };

        /**
         * Swap the language for the current application route.
         *
         * @param {string} localeId - The locale identifier from which the target language should be derived.
         *
         * @returns {promise} - A promise representing the state of the new transition. This is the promise returned by ui-router.
         */
        service.switchCurrentRouteLanguage = function switchCurrentRouteLanguage(localeId) {
          return service.navigateTo($state.current.name, { localeId: localeId }, {});
        };

        return service;
      };
    }
  }
)();
