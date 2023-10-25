;(
  function() {
    'use strict';

    angular
      .module('app.filters')
      .filter('sinceDate', sinceDateFilter)
    ;

    /* @ngInject */
    function sinceDateFilter(DateHelperService, Translate) {
      return function filter (date, parm) {
        var delay = DateHelperService.getDelayBetweenDates(date);
        var result = '';

        var detailLevel = parm;
        if (!detailLevel || detailLevel < 1 || detailLevel > 4) {
          detailLevel = 2; // hours/minutes
        }

        if (delay.days) {
          result = result.concat(delay.days).concat(Translate.instant('daysAbbr'));
        }
        if (delay.hours && detailLevel > 1) {
          if (result.length > 0) {
            result = result.concat(' ');
          }
          result = result.concat(delay.hours).concat(Translate.instant('hoursAbbr'));
        }
        if (delay.minutes && detailLevel > 2) {
          if (result.length > 0) {
            result = result.concat(' ');
          }
          result = result.concat(delay.minutes).concat(Translate.instant('minutesAbbr'));
        }
        if (delay.seconds && detailLevel > 3) {
          if (result.length > 0) {
            result = result.concat(' ');
          }
          result = result.concat(delay.seconds).concat(Translate.instant('secondsAbbr'));
        }

        return result;
      };
    }
  }
)();
