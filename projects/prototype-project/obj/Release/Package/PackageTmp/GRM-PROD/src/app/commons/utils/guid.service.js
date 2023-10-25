(
  function() {
    'use strict';

    angular
      .module('app.commons.utils')
      .factory('GuidService', GuidService)
    ;

    /* @ngInject */
    function GuidService(uuid4) {
      function newGuid() {
        return uuid4.generate();
      }

      return {
        newGuid: newGuid
      };
    }
  }
)();
