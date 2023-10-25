(
  function() {
    'use strict';

    angular
      .module('app.commons.translation')
      .filter('translateStateful', translateStatefulFilter)
    ;

    /* @ngInject */
    function translateStatefulFilter(Translate) {
      var theFilter = function(input, parms) {
        return Translate.filter(input, parms);
      };
      theFilter.$stateful = true;
      return theFilter;
    }
  }
)();
