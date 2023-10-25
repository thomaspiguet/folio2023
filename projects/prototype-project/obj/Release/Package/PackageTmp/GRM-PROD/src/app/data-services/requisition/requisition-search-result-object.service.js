(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition')
      .factory('RequisitionSearchResultObjectService', RequisitionSearchResultObjectService);

    /* @ngInject */
    function RequisitionSearchResultObjectService(DynamicLookupService) {
      return {
        toHeaderResultObject: toHeaderResultObject,
        toProductResultObject: toProductResultObject
      };

      function toHeaderResultObject(dto) {
        return new RequisitionSearchResultHeaderObject(dto);
      }

      function toProductResultObject(dto) {
        return new RequisitionSearchResultProductObject(dto);
      }

      function RequisitionSearchResultHeaderObject(dto) {
        var that = _.extend({
          amount: undefined,
          client: undefined,
          deliveryLocation: undefined,
          department: undefined,
          requester: undefined,
          requisitionDate: undefined,
          requisitionId: undefined,
          site: undefined,
          statusCode: undefined,
          statusDescription: undefined
        }, dto);

        this.amount = that.amount;
        this.client = that.client;
        this.deliveryLocation = that.deliveryLocation;
        this.department = that.department;
        this.requester = that.requester;
        this.requisitionDate = that.requisitionDate;
        this.requisitionId = that.requisitionId;
        this.site = that.site;
        this.statusCode = that.statusCode;
        this.statusDescription = that.statusDescription;
      }

      function RequisitionSearchResultProductObject(dto) {
        var that = _.extend({
          amount: undefined,
          department: undefined,
          formatCode: undefined,
          formatDescription: undefined,
          headerStatusCode: undefined,
          productCode: undefined,
          productDescription: undefined,
          quantity: undefined,
          requisitionDate: undefined,
          requisitionId: undefined,
          requisitionItemId: undefined,
          site: undefined,
          statusDescription: undefined,
          store: undefined
        }, dto);

        this.amount = that.amount;
        this.department = that.department;
        this.formatCode = that.formatCode;
        this.formatDescription = that.formatDescription;
        this.headerStatusCode = that.headerStatusCode;
        this.productCode = that.productCode;
        this.productDescription = that.productDescription;
        this.quantity = that.quantity;
        this.requisitionDate = that.requisitionDate;
        this.requisitionId = that.requisitionId;
        this.requisitionItemId = that.requisitionItemId;
        this.site = that.site;
        this.statusDescription = that.statusDescription;
        this.store = that.store;
      }
    }
  }
)();
