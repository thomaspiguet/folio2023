(
  function() {
    'use strict';

    angular
        .module('app.models.requisition')
        .factory('RequisitionHeaderModel', RequisitionHeaderModelFactory);

    /* @ngInject */
    function RequisitionHeaderModelFactory(DynamicLookupService, UserProfileService) {
      return RequisitionHeaderModel;

      function RequisitionHeaderModel(obj) {
        var that = _.extend({
          address: undefined,
          client: undefined,
          completedBy: undefined,
          completedOn: undefined,
          createdOn:  new Date(), //We do not want time.
          deliveryLocation: undefined,
          department: undefined,
          id: undefined,
          installationSite: undefined,
          interface: undefined,
          isWeeklyConsommationDisplayed: false,
          modifiedOn: undefined,
          modifiedByUsername: undefined,
          requesterNote: undefined,
          originStatusCode: undefined,
          originStatusDescription: undefined,
          phoneExtension: undefined,
          repetitiveContractNumber: undefined,
          requester: undefined,
          requiredOn: new Date(), //We do not want time
          requisitionTemplate: undefined,
          site: undefined,
          splitOnUniqueOrder: false,
          status: 1,
          type: '1',
          wmsLastShipmentDate: undefined,
          wmsLocked: undefined
        }, obj);

        this.address = that.address;
        this.client = that.client;
        this.completedBy = that.completedBy;
        this.completedOn = that.completedOn;
        this.createdOn = new Date(that.createdOn);
        this.deliveryLocation = that.deliveryLocation;
        this.department = that.department;
        this.id = that.id;
        this.installationSite = that.installationSite;
        this.interface = that.interface;
        this.isWeeklyConsommationDisplayed = that.isWeeklyConsommationDisplayed;
        this.modifiedOn = that.modifiedOn;
        this.modifiedByUsername = that.modifiedByUsername;
        this.requesterNote = that.requesterNote;
        this.originStatusCode = that.originStatusCode;
        this.originStatusDescription = DynamicLookupService.getRequisitionOriginStatuses().getDescriptionByCode(String(this.originStatusCode));
        this.phoneExtension = that.phoneExtension;
        this.repetitiveContractNumber = that.repetitiveContractNumber;
        this.requester = that.requester;
        this.requiredOn = new Date(that.requiredOn);
        this.requisitionTemplate = that.requisitionTemplate;
        this.site = that.site;
        this.splitOnUniqueOrder = _.isNil(obj) ? UserProfileService.getCurrentProfile().settings.requisitionSpecific.isUniqueRequisitionPerOrder : that.splitOnUniqueOrder;
        this.status = that.status;
        this.type = that.type;
        this.wmsLastShipmentDate = that.wmsLastShipmentDate;
        this.wmsLocked = that.wmsLocked;

        this.clone = function clone() {
          return new RequisitionHeaderModel(this);
        };
      }
    }
  }
)();
