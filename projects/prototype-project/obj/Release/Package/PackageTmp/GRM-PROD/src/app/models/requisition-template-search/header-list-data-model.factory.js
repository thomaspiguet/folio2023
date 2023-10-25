(
  function() {
    'use strict';

    angular
      .module('app.models')
      .factory('HeaderListDataModel', HeaderListDataModelFactory)
    ;

    /* @ngInject */
    function HeaderListDataModelFactory() {
      return HeaderListDataModel;
    }

    function HeaderListDataModel(obj) {
      var that = _.extend({
        headers: [],
        totalCount: 0
      }, obj);

      this.headers = that.headers;
      this.totalCount = that.totalCount;

      this.clone = function clone() {
        return new HeaderListDataModel(this);
      };

      this.newHeaderResultInstance = function newHeaderResultInstance() {
        return new HeaderResultInstance();
      };
    }

    function HeaderResultInstance(obj) {
      var that = _.extend({
        address: undefined,
        department: undefined,
        isActive: false,
        isAutomaticGeneration: false,
        requester: undefined,
        site: undefined,
        templateDescription: undefined,
        templateId: undefined
      }, obj);

      this.address = that.address;
      this.department = that.department;
      this.isActive = that.isActive;
      this.isAutomaticGeneration = that.isAutomaticGeneration;
      this.requester = that.requester;
      this.site = that.site;
      this.templateDescription = that.templateDescription;
      this.templateId = that.templateId;
    }
  }
)();
