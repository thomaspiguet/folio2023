(
  function() {
    'use strict';

    angular
      .module('app.commons.translation')
      .provider('Translation', TranslationProvider)
    ;

    /* @ngInject */
    function TranslationProvider() {
      var provider = this;
      var translations;
      var resourceCulturePattern;
      var resourceFileNamePattern;
      var currentCultureCode;

      this.getTranslation = function(key) {
        return _.get(translations, key);
      };

      this.getTranslations = function() {
        return translations;
      };

      this.getCurrentCultureCode = function() {
        return currentCultureCode;
      };

      this.setTranslations = function setTranslations(value) {
        translations = value;
      };

      this.setCurrentCultureCode = function setCurrentCultureCode(value) {
        currentCultureCode = value;
      };

      this.setResourceCulturePattern = function(value) {
        resourceCulturePattern = value;
      };

      this.setResourceFileNamePattern = function(value) {
        resourceFileNamePattern = value;
      };

      this.$get = TranslationService;

      /* @ngInject */
      function TranslationService($http, $q, Paths, Cultures) {
          var service = {};

          service.getTranslation = function(key) {
            return provider.getTranslation(key);
          };

          service.getTranslations = function() {
            return provider.getTranslations();
          };

          service.loadTranslations = function loadTranslations(cultureCode) {
            var deferred = $q.defer();

            if (currentCultureCode !== cultureCode) {
              currentCultureCode = cultureCode;

              var filename = resourceCulturePattern.replace(resourceCulturePattern, Cultures.getCultureLocalIdFromCode(cultureCode)) + '/' + resourceFileNamePattern;
              $http
                .get(Paths.getResourcesPath() + filename)
                .then(
                  function(response) {
                    // Store new translations - this could be optimized (caching?)
                    provider.setTranslations(response.data);
                    deferred.resolve({ translationsLoaded: true });
                  },
                  function(reason) {
                    deferred.reject('Translations not loaded [' + reason + ']');
                  }
                )
              ;
            }
            else {
              deferred.resolve({ translationsLoaded: false });
            }

            return deferred.promise;
          };

          return service;
      }
    }
  }
)();
