(
  function() {
    'use strict';

    angular
      .module('app.dataservices.project-activity')
      .factory('ProjectActivityObjectService', ProjectActivityObjectService);

    /* @ngInject */
    function ProjectActivityObjectService() {
      return {
        toObject: toObject,
        newInstance: newInstance
      };

      function toObject(dto) {
        return new ProjectActivityInfo(dto);
      }

      function newInstance() {
        return new ProjectActivityInfo();
      }

      // ProjectActivityInfo object constructor
      function ProjectActivityInfo(dto) {
        var that = _.extend({
          id: undefined,
          projectCode: undefined,
          activityCode: undefined,
          description: undefined
        }, dto);

        this.id = that.id;
        this.projectCode = that.projectCode;
        this.activityCode = that.activityCode;
        this.description = that.description;
      }
    }
  }
)();
