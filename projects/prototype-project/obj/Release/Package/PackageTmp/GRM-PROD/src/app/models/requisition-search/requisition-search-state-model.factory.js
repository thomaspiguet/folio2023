;(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-search')
      .factory('RequisitionSearchStateModel', RequisitionSearchStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchStateModelFactory(RequisitionSearchCriteriaDataModel) {
      var pristineState = {
        client: undefined,
        createdOnFrom: null,
        createdOnTo: null,
        deliveryLocation: undefined,
        department: undefined,
        headers: [],
        includeCancelledRequisitions: undefined,
        installationLocation: undefined,
        itemStatuses: undefined,
        orderId: undefined,
        paging: {
          size: 20,
          offset: 0,
          total: 0
        },
        productCode: undefined,
        productDescription: undefined,
        products: [],
        requester: undefined,
        requisitionId: undefined,
        requisitionTypes: undefined,
        searchMode: 'header',
        site: undefined,
        sorting: {
          by: undefined,
          descending: undefined
        },
        statuses: undefined,
        store: undefined,
        totalCount: 0
      };
      function RequisitionSearchStateModel(obj) {
        var self = this;

        self.client = pristineState.client;
        self.createdOnFrom = pristineState.createdOnFrom;
        self.createdOnTo = pristineState.createdOnTo;
        self.deliveryLocation = pristineState.deliveryLocation;
        self.department = pristineState.department;
        self.headers = pristineState.headers;
        self.includeCancelledRequisitions = pristineState.includeCancelledRequisitions;
        self.installationLocation = pristineState.installationLocation;
        self.itemStatuses = pristineState.itemStatuses;
        self.orderId = pristineState.orderId;
        self.paging = pristineState.paging;
        self.productCode = pristineState.productCode;
        self.productDescription = pristineState.productDescription;
        self.products = pristineState.products;
        self.requester = pristineState.requester;
        self.requisitionId = pristineState.requisitionId;
        self.requisitionTypes = pristineState.requisitionTypes;
        self.searchMode = pristineState.searchMode;
        self.site = pristineState.site;
        self.sorting = pristineState.sorting;
        self.statuses = pristineState.statuses;
        self.store = pristineState.store;
        self.totalCount = pristineState.totalCount;

        if (!_.isNil(obj)) {

          if (obj.client) {
            self.client = obj.client;
          }
          if (obj.createdOnFrom) {
            self.createdOnFrom = obj.createdOnFrom;
          }
          if (obj.createdOnTo) {
            self.createdOnTo = obj.createdOnTo;
          }
          if (obj.deliveryLocation) {
            self.deliveryLocation = obj.deliveryLocation;
          }
          if (obj.department) {
            self.department = obj.department;
          }
          if (obj.headers) {
            self.headers = obj.headers;
          }
          if (obj.includeCancelledRequisitions) {
            self.includeCancelledRequisitions = obj.includeCancelledRequisitions;
          }
          if (obj.installationLocation) {
            self.installationLocation = obj.installationLocation;
          }
          if (obj.itemStatuses) {
            self.itemStatuses = obj.itemStatuses;
          }
          if (obj.orderId) {
            self.orderId = obj.orderId;
          }
          if (obj.paging) {
            self.paging = obj.paging;
          }
          if (obj.productCode) {
            self.productCode = obj.productCode;
          }
          if (obj.productDescription) {
            self.productDescription = obj.productDescription;
          }
          if (obj.products) {
            self.products = obj.products;
          }
          if (obj.requester) {
            self.requester = obj.requester;
          }
          if (obj.requisitionId) {
            self.requisitionId = obj.requisitionId;
          }
          if (obj.requisitionTypes) {
            self.requisitionTypes = obj.requisitionTypes;
          }
          if (obj.searchMode) {
            self.searchMode = obj.searchMode;
          }
          if (obj.site) {
            self.site = obj.site;
          }
          if (obj.sorting) {
            self.sorting = obj.sorting;
          }
          if (obj.statuses) {
            self.statuses = obj.statuses;
          }
          if (obj.store) {
            self.store = obj.store;
          }
          if (obj.totalCount) {
            self.totalCount = obj.totalCount;
          }
        }

        self.clone = function clone() {
          return new RequisitionSearchStateModel(this);
        };

        self.getPristineState = function getPristineState() {
          return _.extend({}, pristineState);
        };
      }

      return RequisitionSearchStateModel;
    }
  }
)();
