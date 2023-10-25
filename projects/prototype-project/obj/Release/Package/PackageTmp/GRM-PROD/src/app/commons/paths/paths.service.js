(
  function() {
    'use strict';

    angular
      .module('app.commons.paths')
      .provider('Paths', PathsProvider)
    ;

    /* @ngInject */
    function PathsProvider() {
      var provider = this;
      this.paths = {
        apiPath: undefined,
        configPath: undefined,
        resourcesPath: undefined,
        platformApiPath: undefined,
        grmLegacyPath: undefined
      };

      provider.setApiPath = function setApiPath(value) {
        provider.paths.apiPath = value;
      };

      provider.setGrmLegacyPath = function setGrmLegacyPath(value) {
        provider.paths.grmLegacyPath = value;
      };

      provider.setPlatformApiPath = function setPlatformApiPath(value) {
        provider.paths.platformApiPath = value;
      };

      provider.setConfigPath = function setConfigPath(value) {
        provider.paths.configPath = value;
      };

      provider.setResourcesPath = function setResourcesPath(value) {
        provider.paths.resourcesPath = value;
      };

      this.$get = PathsService;
      /* @ngInject */
      function PathsService() {
        var service = this;

        this.getGrmLegacyPath = function getGrmLegacyPath() {
          return provider.paths.grmLegacyPath || '';
        };

        this.getApiPath = function getApiPath() {
          return provider.paths.apiPath || '';
        };

        this.getPlatformApiPath = function getPlatformApiPath() {
          return provider.paths.platformApiPath || '';
        };

        this.getConfigPath = function getConfigPath() {
          return provider.paths.configPath || '';
        };

        this.getResourcesPath = function getResourcesPath() {
          return provider.paths.resourcesPath || '';
        };

        return this;
      }
    }
  }
)();
