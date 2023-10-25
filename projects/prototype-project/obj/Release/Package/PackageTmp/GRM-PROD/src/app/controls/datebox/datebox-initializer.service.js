(
  function() {
    'use strict';

    angular
      .module('app.controls.datebox')
      .factory('DateboxInitializer', DateboxInitializer)
    ;

    /* @ngInject */
    function DateboxInitializer($filter, $locale, $mdDateLocale, $q, Translate) {
      return {
        initialize: initialize
      };

      function initialize() {
        // Setup the md calendar
        $mdDateLocale.months = $locale.DATETIME_FORMATS.MONTH;
        $mdDateLocale.shortMonths = $locale.DATETIME_FORMATS.SHORTMONTH;
        $mdDateLocale.days = $locale.DATETIME_FORMATS.DAY;
        $mdDateLocale.shortDays = $locale.DATETIME_FORMATS.SHORTDAY;
        $mdDateLocale.msgCalendar = Translate.instant('calendar');
        $mdDateLocale.msgOpenCalendar = Translate.instant('openCalendar');

        var dateFilter = $filter('date');
        $mdDateLocale.parseDate = function (dateString) {
          var m = moment(dateString, [
            // moment expects all caps date formats ?!?
            $locale.DATETIME_FORMATS.shortDate.toUpperCase(),

            //
            // TODO: this is a bit of a patch... needs improvement
            //
            // Allow arbitrary input formats on top of the one provided for
            // the current locale - the goal is to allow/support manual input
            'YYYY-MM-DD',
            'YY-MM-DD',
            'DD-MM-YYYY',
            'DD-MM-YY',
            'MM-DD-YY',
            'MM-DD-YYYY',
            'YYYY/MM/DD',
            'YY/MM/DD',
            'DD/MM/YYYY',
            'DD/MM/YY',
            'MM/DD/YY',
            'MM/DD/YYYY'
          ], true);
          return m.isValid() ? m.toDate() : new Date(NaN);
        };
        $mdDateLocale.formatDate = function (date) {
          var m = moment(date);
          return m.isValid() ? dateFilter(date, $locale.DATETIME_FORMATS.shortDate) : '';
        };

        return $q.resolve($mdDateLocale);
      }
    }
  }
)();
