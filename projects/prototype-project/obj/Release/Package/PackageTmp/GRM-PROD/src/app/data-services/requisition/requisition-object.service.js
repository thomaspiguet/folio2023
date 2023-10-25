(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition')
      .factory('RequisitionObjectService', RequisitionObjectService);

    /* @ngInject */
    function RequisitionObjectService(RequisitionItemObjectService) {
      return {
        newInstance: newInstance,
        toObject: toObject,
        toDto: toDto
      };

      function newInstance() {
        return new RequisitionAggregateObject();
      }

      function toObject(dto) {
        return new RequisitionAggregateObject(dto);
      }

      function toDto(requisitionAggregate) {
        var result = {
          addressId: requisitionAggregate.address ? requisitionAggregate.address.id : undefined,
          createdOn: requisitionAggregate.createdOn,
          requiredOn: requisitionAggregate.requiredOn,
          clientId: requisitionAggregate.client ? requisitionAggregate.client.id : undefined,
          deliveryLocationId: requisitionAggregate.deliveryLocation ? requisitionAggregate.deliveryLocation.id : undefined,
          departmentId: requisitionAggregate.department ? requisitionAggregate.department.id : undefined,
          id: requisitionAggregate.id,
          installationSiteId: requisitionAggregate.installationSite ? requisitionAggregate.installationSite.id : undefined,
          modifiedBy: requisitionAggregate.modifiedBy,
          modifiedOn: requisitionAggregate.modifiedOn,
          requesterId: requisitionAggregate.requester ? requisitionAggregate.requester.id : undefined,
          requesterNote: requisitionAggregate.requesterNote,
          requesterPhoneExtension: requisitionAggregate.phoneExtension,
          requisitionItems: [],
          requisitionTemplateId: requisitionAggregate.requisitionTemplate ? requisitionAggregate.requisitionTemplate.code : undefined,
          siteId: requisitionAggregate.site ? requisitionAggregate.site.id : undefined,
          splitOnUniqueOrder: requisitionAggregate.splitOnUniqueOrder,
          status: requisitionAggregate.status,
          type: _.isString(requisitionAggregate.type) ? _.parseInt(requisitionAggregate.type, 10) : requisitionAggregate.type
        };

        _.forEach(requisitionAggregate.requisitionItems, function onRequisitionItems(requisitionItemAggregate) {
          result.requisitionItems.push(RequisitionItemObjectService.toDto(requisitionItemAggregate));
        });

        return result;
      }

      function RequisitionAggregateObject(dto) {
        var that = _.extend({
          address: undefined,
          completedBy: undefined,
          completedOn: undefined,
          createdOn: undefined,
          client: undefined,
          deliveryLocation: undefined,
          department: undefined,
          externalReferenceNumber: undefined,
          id: undefined,
          interfaceSequenceNumber: undefined,
          installationSite: undefined,
          interface: undefined,
          modifiedBy: undefined,
          modifiedOn: undefined,
          originStatusCode: undefined,
          repetitiveContractNumber: undefined,
          requester: undefined,
          requesterNote: undefined,
          requesterPhoneExtension: undefined,
          requiredOn: undefined,
          requisitionTemplate: undefined,
          site: undefined,
          splitOnUniqueOrder: undefined,
          status: undefined,
          type: undefined,
          wmsLastShipmentDate: undefined,
          wmsLocked: undefined
        }, dto);

        this.address = that.address;
        this.completedBy = that.completedBy;
        this.completedOn = that.completedOn;
        this.createdOn = that.createdOn;
        this.client = that.client;
        this.deliveryLocation = that.deliveryLocation;
        this.department = that.department;
        this.id = that.id;
        this.interfaceSequenceNumber = that.interfaceSequenceNumber;
        this.externalReferenceNumber = that.externalReferenceNumber;
        this.installationSite = that.installationSite;
        this.interface = that.interface;
        this.modifiedBy = that.modifiedBy;
        this.modifiedByUsername = that.modifiedByUsername;
        this.modifiedOn = that.modifiedOn;
        this.originStatusCode = that.originStatusCode;
        this.repetitiveContractNumber = that.repetitiveContractNumber;
        this.requester = that.requester;
        this.requesterNote = that.requesterNote;
        this.phoneExtension = that.requesterPhoneExtension;
        this.requiredOn = that.requiredOn;
        this.requisitionTemplate = that.requisitionTemplate;
        this.site = that.site;
        this.splitOnUniqueOrder = that.splitOnUniqueOrder;
        this.status = that.status;
        this.type = _.toString(that.type);
        this.wmsLastShipmentDate = that.wmsLastShipmentDate;
        this.wmsLocked = that.wmsLocked;

        var requisitionItems = this.requisitionItems = [];

        if (!_.isNil(dto)) {
          _.forEach(dto.requisitionItems, function onRequisitionItems(requisitionItem) {
            requisitionItems.push(RequisitionItemObjectService.toObject(requisitionItem));
          });
        }
      }
    }
  }
)();
