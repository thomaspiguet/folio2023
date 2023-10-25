(
  function() {
    'use strict';

    angular
        .module('app.models.requisition-template')
        .factory('RequisitionTemplateHeaderModel', RequisitionTemplateHeaderModelFactory);

    /* @ngInject */
    function RequisitionTemplateHeaderModelFactory() {
        return RequisitionTemplateHeaderModel;
    }

    function RequisitionTemplateHeaderModel(obj) {
      var that = _.extend({
        id: undefined,
        name: undefined,
        site: undefined,
        department: undefined,
        address: undefined,
        deliveryLocation: undefined,
        requester: undefined,
        isAutomaticGeneration: undefined,
        active: true,
        client: undefined,
        createdOn: new Date(),
        modifiedOn: undefined,
        modifiedByCode: undefined,
        modifiedByDesc: undefined,
      }, obj);

      this.id = that.id;
      this.name = that.name;
      this.site = that.site;
      this.department = that.department;
      this.address = that.address;
      this.deliveryLocation = that.deliveryLocation;
      this.requester = that.requester;
      this.isAutomaticGeneration = that.isAutomaticGeneration;
      this.client = that.client;
      this.active = that.active;
      this.createdOn = that.createdOn;   // Not wrapped in a date object for the moment - see if this is really needed later
      this.modifiedOn = that.modifiedOn; // Not wrapped in a date object for the moment - see if this is really needed later
      this.modifiedByCode = that.modifiedByCode;
      this.modifiedByDesc = that.modifiedByDesc;

      this.clone = function clone() {
        return new RequisitionTemplateHeaderModel(this);
      };
    }
  }
)();
