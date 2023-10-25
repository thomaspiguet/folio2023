(
  function() {
    'use strict';

    angular
      .module('app.dataservices.account')
      .factory('AccountObjectService', AccountObjectService)
    ;

    /* @ngInject */
    function AccountObjectService() {
      return {
        toObject: toObject,
        toDto: toDto,
        newInstance: newInstance
      };

      function toObject(dto) {
        return dto;
      }

      function toDto(object) {

      }

      function newInstance() {

      }

      // Account object constructor
      function Account(dto) {

      }
    }
  }
)();
