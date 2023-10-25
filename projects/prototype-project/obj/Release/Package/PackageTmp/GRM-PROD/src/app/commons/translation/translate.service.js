/**
 * @file Translation service implementation
 * @author Benoit Bolduc
 */
(
  function() {
    'use strict';

    angular
      .module('app.commons')
      .factory('Translate', TranslateService)
    ;

    /* @ngInject */
    function TranslateService($filter, Translation) {
      /**
       * The filter method performs the actual translation for the given key.
       *
       * @param {string} key The key to translate
       * @param {array|string} parms The parameter(s) to 'bind' in the message - may be a single value or an array of values
       */
      function filter(key, parms) {
        if (_.isUndefined(key)) {
          return undefined;
        }

        var result = Translation.getTranslation(key);
        if (_.isUndefined(result) || result == null) {
          result = '??' + key + '??';
        }

        if (!_.isNil(parms)) {
          if (_.isArray(parms)) {
            _.forEach(parms, function onParms(parm, index) {
              result = result.replace('{' +  index + '}', parm);
            });
          }
          else {
            result = result.replace('{0}', parms);
          }
        }
        return result;
      }

      function instant(key, parms) {
        // return service.filter(key, parms);
        return $filter('translateStateful')(key, parms);
      }

      function use(cultureCode) {
        return Translation.loadTranslations(cultureCode);
      }

      return {
        filter: filter,
        instant: instant,
        use: use
      };
    }
  }
)();
