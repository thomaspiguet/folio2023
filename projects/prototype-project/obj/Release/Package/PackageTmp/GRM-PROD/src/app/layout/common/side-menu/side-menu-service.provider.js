;(
  function() {
    'use strict';

    angular
      .module('app.layout.common.side-menu')
      .provider('SideMenuService', SideMenuService)
    ;

    /* @ngInject */
    function SideMenuService() {
      var provider = this;

      /**
       * Modules spec
       *
       * - The menu supports the selection a so-called modules, through the use of a dropdown list at the top of the
       *   side menu. If only one top level module is provided, it will be displayed as a single label, otherwise it
       *   will be displayed as a dropdown list
       * - A list of associated menu items is displayed underneath the selected module upon selecting one.
       * - A list of associated sub menu items is displayed underneath the selected menu item (if configured as such) upon selecting one.
       *
       * The modules attribute is an array of the following structure:
       *
       * {
       *   label: string, // the key of the module label - translated at runtime
       *   iconClass: string, //the css icon class to display in the menu for this module
       *   states: [ // an array of menu items associated to the given module
       *     {
       *       label: string, // the key of the menu item label - translated at runtime
       *       stateName: string, // a string mapping to a state name - if provided, item is displayed as a link, otherwise item is displayed as a label
       *       iconClass: string, //the css icon class to display in the menu for this menu item
       *       states: [ // an array of sub menu items - if provided and not empty, will be displayed as a list of sub-menu items, otherwise will not be displayed
       *         {
       *           label: string, // the key of the sub menu item - translated at runtime
       *           stateName: string // a string mapping to a state name - mandatory
       *         }
       *       ]
       *     }
       *   ],
       *   staticLinks: [ // an array of menu items consisting of static links
       *     {
       *       label: string, // the key of the menu item label
       *       iconClass: string, //the css icon class to display in the menu for this static link
       *       link: string // the static url to add to module menu items
       *     }
       *   ]
       * }
       */

      var modules = [];

      // The currently selected menu item - this corresponds to the current state name
      var currentSideMenuItem;

      provider.registerModule = function registerModule(moduleObj) {
        modules.push(moduleObj);
      };

      /* @ngInject */
      provider.$get = function() {
        var service = this;

        service.getModules = function getModules() {
          return modules;
        };

        service.getCurrentSideMenuItem = function getCurrentSideMenuItem() {
          return currentSideMenuItem;
        };

        service.setCurrentSideMenuItem = function setCurrentSideMenuItem(SideMenuItem) {
          currentSideMenuItem = SideMenuItem;
        };

        service.containsSideMenuItem = function containsSideMenuItem(item) {
          if (_.isNil(item)) {
            return false;
          }

          // TODO: use this if we need to detect nested levels
          // return _.isEmpty(_.difference(_.split(currentSideMenuItem, '.', 3), _.split(SideMenuItem, '.', 3)));
          return currentSideMenuItem.indexOf(item) >= 0;
        };

        return service;
      };
    }
  }
)();
