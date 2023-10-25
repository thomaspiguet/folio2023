(
  function() {
    'use strict';

    angular
      .module('app.commons.utils')
      .factory('DateHelperService', DateHelperService)
    ;

    /* @ngInject */
    function DateHelperService() {

      /**
       * Calculates absolute delay between 2 dates. 
       * 
       * @param {Date} firstDate is the first date to calculate with.
       * @param {Date} secondDate is the second date to calculate with.
       * @returns The absolute delay (days, hours, minutes and seconds) between these 2 dates.
       */
      function getDelayBetweenDates(firstDate, secondDate) {

        if (!_.isNil(firstDate)) {
          var delay = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };

          if (_.isNil(secondDate)) {
            secondDate = new Date();
          }
          var dateDiffInMs = Math.abs(new Date(firstDate) - new Date(secondDate));
          
          delay.seconds = Math.floor((dateDiffInMs /= 1000) % 60);
          delay.minutes = Math.floor((dateDiffInMs /= 60) % 60);
          delay.hours = Math.floor((dateDiffInMs /= 60) % 24);  
          delay.days = Math.floor(dateDiffInMs / 24);

          return delay;
        }

        return undefined;
      }

      return {
        getDelayBetweenDates: getDelayBetweenDates
      };
    }
  }
)();
