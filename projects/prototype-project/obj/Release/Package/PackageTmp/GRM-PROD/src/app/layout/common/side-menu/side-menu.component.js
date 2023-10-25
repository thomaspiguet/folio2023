;(
  function() {
    'use strict';

    angular
      .module('app.layout.common.side-menu')
      .component('sideMenu', sideMenu())
    ;

    function sideMenu() {
      var cdo = {
        templateUrl: 'side-menu.template.html',
        controller: SideMenuController,
        bindings: {
          expanded: '<',
          onToggleSideMenu: '&',
          staticLinkFactory: '&'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function SideMenuController(SideMenuService) {
      var self = this;

      self.$onInit = function onInit() {
        self.showModules = false;
        self.modules = _.arrayCopy(SideMenuService.getModules()); // Keep a copy of the module config locally for now
        if (_.isNil(self.modules)) {
          self.modules = [];
        }
        self.selectedModule = self.modules[0]; // force select first module in list for the moment
        self.selectedMenuItem = undefined;
        _.forEach(self.selectedModule.states, function onStates(state) {
          if (state.stateName) {
            self.selectedMenuItem = state.stateName;
          }
          if (state.states && state.states.length > 0) {
            self.selectedMenuItem = state.states[0].stateName;
          }
        });
      };

      self.onToggle = function onToggle($event) {
        if ($event) {
          $event.preventDefault();
        }
        self.onToggleSideMenu();
      };

      self.onShowModules = function onShowModules($event) {
        if ($event) {
          $event.preventDefault();
        }
        // Do not show module list if side menu is collapsed
        if (!self.expanded) {
          self.showModules = false;
          return;
        }
        // Do not show module list if it contains only one element or less
        if (self.modules.length <= 1) {
          self.showModules = false;
          return;
        }
        self.showModules = !self.showModules;
      };

      self.onSelectModule = function onSelectModule(module) {
        if (self.isModuleSelected(module)) {
          self.selectedModule = undefined;
        }
        else {
          self.selectedModule = module;
        }
        self.showModules = false;
      };

      self.isModuleSelected = function isModuleSelected(module) {
        return self.selectedModule === module;
      };

      self.getSelectedModule = function getSelectedModule() {
        return self.selectedModule;
      };

      self.getModules = function getModules() {
        return self.modules;
      };

      self.isSideMenuItemSelected = function isSideMenuItemSelected(which) {
        return SideMenuService.containsSideMenuItem(which);
      };

      self.getLink = function getLink(which) {
        return self.staticLinkFactory({ obj: {
          link: which
        }});
      };
    }
  }
)();
