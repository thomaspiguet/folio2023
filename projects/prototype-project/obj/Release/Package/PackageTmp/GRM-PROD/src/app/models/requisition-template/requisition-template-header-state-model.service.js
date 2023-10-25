(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-template')
      .factory('RequisitionTemplateHeaderStateModel', RequisitionTemplateHeaderStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateHeaderStateModelFactory(UserProfileService) {
      return RequisitionTemplateHeaderStateModel;

      function RequisitionTemplateHeaderStateModel(obj) {
        var that = _.extend({
          name: {
            disabled: false,
            hidden: false,
            required: true
          },
          site: {
            disabled: false,
            hidden: false,
            required: true
          },
          department: {
            disabled: false,
            hidden: false,
            required: false
          },
          address: {
            disabled: false,
            hidden: false,
            required: false
          },
          deliveryLocation: {
            disabled: false,
            hidden: false,
            required: false
          },
          requester: {
            disabled: false,
            hidden: false,
            required: false
          },
          active: {
            disabled: false,
            hidden: false,
            required: true
          },
          isAutomaticGeneration: {
            disabled: false,
            hidden: false,
            required: true
          },
          client: {
            disabled: true,
            hidden: false,
            required: false
          }
        }, obj);

        this.name = that.name;
        this.site = that.site;
        this.department = that.department;
        this.address = that.address;
        this.deliveryLocation = that.deliveryLocation;
        this.requester = that.requester;
        this.active = that.active;
        this.isAutomaticGeneration = that.isAutomaticGeneration;
        this.client = that.client;

        this.clone = function clone() {
          return new RequisitionTemplateHeaderStateModel(this);
        };
      }
    }

  }
)();
