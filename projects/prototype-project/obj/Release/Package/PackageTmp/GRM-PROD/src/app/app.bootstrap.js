(function bootstrap(bootstrapper) {
  'use strict';

  // The main application configuration file path
  var grmwebConfigFile = 'config/grmweb.config.json';

  /**
   * This is the application preload, kicked off before the actual Angular app is bootstrapped.
   * The presence of the [grmweb.config.json] file is mandatory for the preload to be successful. It must
   * be located under the "config/" path.
   */
  bootstrapper.bootstrap({
    element: 'html',
    module: 'app',
    bootstrapConfig: {
      strictDi: true,
    },
    resolve: {
      grmwebConfig: /* @ngInject */ function bootstrapper($http, $log, $q) {
        var deferred = $q.defer(),
          configFile = grmwebConfigFile
        ;

        function notifyError(reason) {
          $log.error(reason);
        }

        var res = {
          appConfig: {
            apiPath: undefined,
            configPath: undefined,
            grmLegacyUrl: undefined
          },
          i18nConfig: {
            locales: undefined,
            pathPattern: undefined,
            preferredLocale: undefined,
            resourceFileNamePattern: undefined,
            resourceLocalePattern: undefined,
            resourcesPath: undefined,
            translations: undefined
          },
          idsConfig: {},
          platformConfig: {}
        };

        var cfg;
        $http
          .get(configFile)
          .then(
            function onSuccess(response) {
              cfg = response.data;

              // app
              res.appConfig.apiPath = cfg.app.apiUrl;
              res.appConfig.configPath = cfg.app.configPath;
              res.appConfig.grmLegacyUrl = cfg.app.grmLegacyUrl;
              res.appConfig.appVersion = cfg.app.version;

              // i18n
              res.i18nConfig.pathPattern = cfg.i18n.pathPattern;
              res.i18nConfig.resourceLocalePattern = cfg.i18n.resourceLocalePattern;
              res.i18nConfig.resourceFileNamePattern = cfg.i18n.resourceFileNamePattern;
              res.i18nConfig.resourcesPath = cfg.i18n.resourcesPath;
              res.i18nConfig.locales = cfg.i18n.locales;
              res.i18nConfig.preferredLocale = cfg.i18n.preferredLocale;

              // ids
              res.idsConfig = cfg.ids;

              // platform
              res.platformConfig = cfg.platform;

              // Load localized resource file, based on preferred locale determined above
              var filename = res.i18nConfig.resourceLocalePattern.replace(res.i18nConfig.resourceLocalePattern, res.i18nConfig.preferredLocale) + '/' + res.i18nConfig.resourceFileNamePattern;
              return $http.get(res.i18nConfig.resourcesPath + filename, {
                headers: {
                  'Accept': 'application/json;charset=utf-8'
                },
              });
            }
          )
          .then(
            function onSuccess(response) {
              // Save translations
              res.i18nConfig.translations = response.data;
              return $q.resolve(res);
            }
          )
          .then(
            function onSuccess(res) {
              // ... and off we go!
              deferred.resolve(res);
            },
            function onFailure(reason) {
              notifyError(reason);
              deferred.reject(reason);
            }
          )
        ;

        return deferred.promise;
      }
    }
  });
})(angular.injector(['ng']).get('$window').deferredBootstrapper);
