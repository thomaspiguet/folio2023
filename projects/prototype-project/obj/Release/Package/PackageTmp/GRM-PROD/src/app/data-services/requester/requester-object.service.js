(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requester')
      .factory('RequesterObjectService', RequesterObjectService);

    /* @ngInject */
    function RequesterObjectService() {
      return {
        newInstance: newInstance,
        toObject: toObject
      };

      function newInstance() {
        return new Requester();
      }

      function toObject(dto) {
        return new Requester(dto);
      }

      function Requester(dto) {
        var that = _.extend({
          id: undefined,
          code: undefined,
          description: undefined,
          phoneExtension: undefined
        }, dto);

        this.id = that.id;
        this.code = that.code;
        this.description = that.description;
        this.phoneExtension = that.phoneExtension;
      }
    }
  }
)();
