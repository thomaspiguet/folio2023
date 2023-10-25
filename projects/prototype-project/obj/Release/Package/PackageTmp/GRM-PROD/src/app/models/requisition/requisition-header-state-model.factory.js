(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionHeaderStateModel', RequisitionHeaderStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionHeaderStateModelFactory(UserProfileService) {
      return RequisitionHeaderStateModel;

      function RequisitionHeaderStateModel(obj) {
        var that = _.extend({
          template: {
            disabled: false,
            hidden: true,
            required: false
          },
          department: {
            disabled: false,
            hidden: false,
            required: true,
            validations: {
              'md-require-match': 'validations.invalidDepartment'
            }
          },
          deliveryLocation: {
            disabled: false,
            hidden: false,
            required: false
          },
          createDeliveryLocation: {
            disabled: false,
            hidden: true
          },
          site: {
            disabled: false,
            hidden: false,
            required: true
          },
          address: {
            disabled: false,
            hidden: false,
            required: true
          },
          requester: {
            disabled: false,
            hidden: false,
            required: true
          },
          phone: {
            disabled: false,
            hidden: false,
            required: false
          },
          requiredOn: {
            disabled: false,
            hidden: false,
            required: true,
            validations: {
              mindate: 'validations.requisition.minDate',
              valid: 'validations.invalidDate'
            }
          },
          createdOn: {
            disabled: true,
            hidden: false,
            required: true
          },
          type: {
            disabled: false,
            hidden: false,
            required: false
          },
          splitOnUniqueOrder: {
            disabled: false,
            hidden: false,
            required: false
          },
          weeklyConsommationDisplayed: {
            disabled: false,
            hidden: false,
            required: false
          },
          note: {
            disabled: false,
            hidden: false,
            required: false
          },
          origin: {
            disabled: true,
            hidden: false,
            required: false
          },
          interface: {
            disabled: true,
            hidden: false,
            required: false
          },
          repetitiveContractNumber: {
            disabled: true,
            hidden: false,
            required: false
          },
          client: {
            disabled: true,
            hidden: false,
            required: false
          },
          completedBy: {
            disabled: true,
            hidden: false,
            required: false
          },
          wmsLastShipmentDate: {
            disabled: false,
            hidden: false,
            required: false
          },
          wmsLocked: {
            disabled: true,
            hidden: false,
            required: false
          },
          updatedOn: {
            disabled: false,
            hidden: false,
            required: false
          },
          modifiedBy: {
            disabled: false,
            hidden: false,
            required: false
          },
          installationSite: {
            disabled: false,
            hidden: true,
            required: false
          }
        }, obj);

        this.template = that.template;
        this.client = that.client;
        this.department = that.department;
        this.deliveryLocation = that.deliveryLocation;
        this.createDeliveryLocation = that.createDeliveryLocation;
        this.site = that.site;
        this.address = that.address;
        this.requester = that.requester;
        this.phone = that.phone;
        this.requiredOn = that.requiredOn;
        this.createdOn = that.createdOn;
        this.type = that.type;
        this.splitOnUniqueOrder = that.splitOnUniqueOrder;
        this.weeklyConsommationDisplayed = that.weeklyConsommationDisplayed;
        this.note = that.note;
        this.origin = that.origin;
        this.interface = that.interface;
        this.repetitiveContractNumber = that.repetitiveContractNumber;
        this.completedBy = that.completedBy;
        this.wmsLastShipmentDate = that.wmsLastShipmentDate;
        this.wmsLocked = that.wmsLocked;
        this.updatedOn = that.updatedOn;
        this.modifiedBy = that.modifiedBy;
        this.installationSite = that.installationSite;

        this.clone = function clone() {
          return new RequisitionHeaderStateModel(this);
        };
      }
    }
  }
)();
