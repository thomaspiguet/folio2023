(
  function() {
    'use strict';

    angular
      .module('app.filters')
      .filter('localeDate', localeDateFilter);

    /* @ngInject */
    function localeDateFilter($mdDateLocale) {
      return function filter (date, parms) {
        if (_.isDate(date)) {
          return $mdDateLocale.formatDate($mdDateLocale.parseDate(date));
        }
        return $mdDateLocale.formatDate(date);
      };
    }
  }
)();
