/**
 * The application's main configuration block.
 * @license Logibec
 */
(
  function() {
    'use strict';

    angular
      .module('app')
      .config(config)
    ;

    /* @ngInject */
    function config(
        // Third party dependencies
        $compileProvider,
        $httpProvider,
        $locationProvider,
        $logProvider,
        $qProvider,
        $provide,
        stConfig,
        tmhDynamicLocaleProvider,
        // Local dependencies
        grmwebConfig,
        AuthenticationManagerProvider,
        CulturesProvider,
        PathsProvider,
        StatesInitializerProvider,
        TranslationProvider,
        VersionServiceProvider
      ) {

      // TODO: allow pre-binds for the moment... we have to review this
      $compileProvider.preAssignBindingsEnabled(true);

      // TODO: this disables javascript errors raised when no rejection handler is set up for a given promise
      $qProvider.errorOnUnhandledRejections(false);

      // In some cases, we need to provide a request body for the delete
      // operation. In such a case, the content must be provided a json
      $httpProvider.defaults.headers.delete = {
        'Content-Type': 'application/json'
      };

      PathsProvider.setApiPath(grmwebConfig.appConfig.apiPath);
      PathsProvider.setConfigPath(grmwebConfig.appConfig.configPath);
      PathsProvider.setResourcesPath(grmwebConfig.i18nConfig.resourcesPath);
      PathsProvider.setPlatformApiPath(grmwebConfig.platformConfig.apiUrl);
      PathsProvider.setGrmLegacyPath(grmwebConfig.appConfig.grmLegacyUrl);

      AuthenticationManagerProvider.setUrl(grmwebConfig.idsConfig.url);
      AuthenticationManagerProvider.setAuthority(grmwebConfig.idsConfig.authority);
      AuthenticationManagerProvider.setClientId(grmwebConfig.idsConfig.clientId);
      AuthenticationManagerProvider.setResponseType(grmwebConfig.idsConfig.responseType);
      AuthenticationManagerProvider.setScope(grmwebConfig.idsConfig.scope);
      AuthenticationManagerProvider.setRedirectUri(grmwebConfig.idsConfig.redirectUri);
      AuthenticationManagerProvider.setPostLogoutRedirectUri(grmwebConfig.idsConfig.postLogoutRedirectUri);
      AuthenticationManagerProvider.setSilentRedirectUri(grmwebConfig.idsConfig.silentRedirectUri);
      AuthenticationManagerProvider.setTokenName(grmwebConfig.idsConfig.tokenName);

      // Initialize cultures
      CulturesProvider.setCultures(grmwebConfig.i18nConfig.locales);
      var currentLocale = _.find(grmwebConfig.i18nConfig.locales, function(l) { return l.localeId === grmwebConfig.i18nConfig.preferredLocale; });
      CulturesProvider.setPreferredCulture(currentLocale);
      CulturesProvider.setCurrentCulture(currentLocale);

      // Initialize global translations
      TranslationProvider.setResourceCulturePattern(grmwebConfig.i18nConfig.resourceLocalePattern);
      TranslationProvider.setResourceFileNamePattern(grmwebConfig.i18nConfig.resourceFileNamePattern);
      TranslationProvider.setTranslations(grmwebConfig.i18nConfig.translations);
      TranslationProvider.setCurrentCultureCode(currentLocale.languageId.toLowerCase());

      VersionServiceProvider.setWebAplicationVersion(grmwebConfig.appConfig.appVersion);

      // The dynamic locale service needs a path pattern
      tmhDynamicLocaleProvider.localeLocationPattern(grmwebConfig.i18nConfig.pathPattern);

      // Define our own smart table pager template
      stConfig.pagination.template = 'smart-table-pager.directive.html';

      // Initialize application ui-router states
      StatesInitializerProvider.initialize();

      //Defines states for login/logout callbacks.
      AuthenticationManagerProvider.setLoginLogoutCallbackStates();

      $locationProvider.html5Mode(true).hashPrefix('!');

      // TODO: externalize in application configuration
      $logProvider.debugEnabled(false);
    }
  }
)();
