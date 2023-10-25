(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-search')
      .factory('RequisitionSearchHeaderListDataModel', RequisitionSearchHeaderListDataModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchHeaderListDataModelFactory() {
      return RequisitionSearchHeaderListDataModel;
    }

    function RequisitionSearchHeaderListDataModel(obj) {
      var that = _.extend({
        headers: [],
        totalCount: 0
      }, obj);

      this.headers = that.headers;
      this.totalCount = that.totalCount;

      this.clone = function clone() {
        return new RequisitionSearchHeaderListDataModel(this);
      };

      this.newHeaderResultInstance = function newHeaderResultInstance() {
        return new RequisitionSearchHeaderResultInstance();
      };
    }

    function RequisitionSearchHeaderResultInstance(obj) {
      var that = _.extend({
        department: undefined,
        amount: undefined,
        client: undefined,
        deliveryLocation: undefined,
        requisitionId: undefined,
        requester: undefined,
        requisitionDate: undefined,
        site: undefined,
        statusCode: undefined,
        statusDescription: undefined
      }, obj);

      this.department = that.department;
      this.amount = that.amount;
      this.client = that.client;
      this.deliveryLocation = that.deliveryLocation;
      this.requisitionId = that.requisitionId;
      this.requester = that.requester;
      this.requisitionDate = that.requisitionDate;
      this.site = that.site;
      this.statusCode = that.statusCode;
      this.statusDescription = that.statusDescription;
    }
  }
)();
