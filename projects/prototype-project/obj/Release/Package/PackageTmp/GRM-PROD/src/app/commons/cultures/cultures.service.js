(
  function() {
    'use strict';

    angular
      .module('app.commons.cultures')
      .provider('Cultures', CulturesProvider)
    ;

    /* @ngInject */
    function CulturesProvider() {
      var provider = this;
      this.cultures = undefined;
      this.currentCulture = undefined;
      this.preferredCulture = undefined;

      this.getCurrentCulture = function() {
        return provider.currentCulture;
      };

      this.setCurrentCulture = function(culture) {
        provider.currentCulture = culture;
      };

      this.getCultures = function() {
        return provider.cultures;
      };

      this.setCultures = function(cultures) {
        provider.cultures = cultures;
      };

      this.getPreferredCulture = function() {
        return provider.preferredCulture;
      };

      this.setPreferredCulture = function(culture) {
        provider.preferredCulture = culture;
      };

      this.getCurrentCultureCodeLowerCase = function getCurrentCultureCodeLowerCase() {
        return this.getCurrentCulture().code.toLowerCase();
      };

      this.$get = CultureService;

      /* @ngInject */
      function CultureService($q) {
        var service = {};

        // get culture collection
        service.getCultures = function() {
          return provider.getCultures();
        };

        service.getCultureLocalIdFromCode = function(cultureCode) {
          var culture = _.find(provider.getCultures(), function(c) { return c.code.toLowerCase() === cultureCode.toLowerCase(); });
          return !_.isUndefined(culture) ? culture.localeId : undefined;
        };

        // get current culture
        service.getCurrentCulture = function() {
          return provider.getCurrentCulture();
        };
        // set current culture
        service.setCurrentCulture = function(culture) {
          provider.setCurrentCulture(culture);
        };

        service.getCurrentCultureCode = function getCurrentCultureCode() {
          return service.getCurrentCulture().code;
        };

        service.getCurrentCultureCodeLowerCase = function getCurrentCultureCodeLowerCase() {
          return service.getCurrentCultureCode().toLowerCase();
        };

        service.getCurrentCultureLocaleId = function getCurrentCultureLocaleId() {
          return service.getCurrentCulture().localeId;
        };

        service.getCurrentCultureLanguageId = function getCurrentCultureLanguageId() {
          return service.getCurrentCulture().languageId;
        };

        service.getCurrentCultureLocaleIdLowerCase = function getCurrentCultureLocaleIdLowerCase() {
          return service.getCurrentCultureLocaleId().toLowerCase();
        };

        service.getCurrentCultureLanguageIdLowerCase = function getCurrentCultureLanguageIdLowerCase() {
          return service.getCurrentCultureLanguageId().toLowerCase();
        };

        // get preferred culture
        service.getPreferredCulture = function() {
          return provider.getPreferredCulture();
        };

        service.getPreferredCultureCode = function getPreferredCultureCode() {
          return service.getPreferredCulture().code;
        };

        service.getPreferredCultureLocaleId = function getPreferredCultureLocaleId() {
          return service.getPreferredCulture().localeId;
        };

        service.getPreferredCultureLanguageId = function getPreferredCultureLanguageId() {
          return service.getPreferredCulture().languageId;
        };

        service.getPreferredCultureLocaleIdLowerCase = function getPreferredCultureLocaleIdLowerCase() {
          return service.getPreferredCultureLocaleId().toLowerCase();
        };

        service.getPreferredCultureLanguageIdLowerCase = function getPreferredCultureLanguageIdLowerCase() {
          return service.getPreferredCultureLanguageId().toLowerCase();
        };

        // returns the list of cultures, minus the current culture
        service.availableCultures = function() {
          var result = [];

          var allCultures = service.getCultures();
          var currentCulture = service.getCurrentCulture();

          _.each(allCultures, function onAllCultures(culture) {
            if (culture.code !== currentCulture.code) {
              result.push(culture);
            }
          });

          return result;
        };

        service.ensureCulture = function ensureCulture(culture) {
          var cultureChanged = false;
          var currentCulture = service.getCurrentCulture();
          if (currentCulture.code !== culture.code) {
            service.setCurrentCulture(culture);
            cultureChanged = true;
          }
          return $q.resolve({ cultureChanged: cultureChanged });
        };

        service.ensureLocale = function ensureLocale(localeId) {
          var culture = _.find(service.getCultures(), function onCultures(culture) {
            return culture.languageId.toLowerCase() === localeId;
          });

          return service.ensureCulture(culture);
        };

        return service;
      }
    }
  }
)();
