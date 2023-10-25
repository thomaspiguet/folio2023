(
  function() {
    'use strict';

    angular
        .module('app.models.requisition-search')
        .factory('RequisitionSearchCriteriaDataModel', RequisitionSearchCriteriaDataModelFactory);

    /* @ngInject */
    function RequisitionSearchCriteriaDataModelFactory() {
      return RequisitionSearchCriteriaDataModel;

      function RequisitionSearchCriteriaDataModel(obj) {
        // Define the available search modes
        Object.defineProperty(this, 'searchModes', {
          value: {
            header: 'header',
            product: 'product'
          }
        });

        var that = _.extend({
          client: undefined,
          createdOnFrom: null,
          createdOnTo: null,
          deliveryLocation: undefined,
          department: undefined,
          includeCancelledRequisitions: undefined,
          installationLocation: undefined,
          itemStatuses: undefined,
          orderId: undefined,
          productCode: undefined,
          productDescription: undefined,
          requester: undefined,
          requisitionId: undefined,
          requisitionTypes: undefined,
          searchMode: this.searchModes.header,
          site: undefined,
          statuses: undefined,
          store: undefined
        }, obj);

        this.client = that.client;
        this.createdOnFrom = that.createdOnFrom;
        this.createdOnTo = that.createdOnTo;
        this.deliveryLocation = that.deliveryLocation;
        this.department = that.department;
        this.includeCancelledRequisitions = that.includeCancelledRequisitions;
        this.installationLocation = that.installationLocation;
        this.itemStatuses = that.itemStatuses;
        this.orderId = that.orderId;
        this.productCode = that.productCode;
        this.productDescription = that.productDescription;
        this.requester = that.requester;
        this.requisitionId = that.requisitionId;
        this.requisitionTypes = that.requisitionTypes;
        this.searchMode = that.searchMode;
        this.site = that.site;
        this.statuses = that.statuses;
        this.store = that.store;

        this.clone = function clone() {
          return new RequisitionSearchCriteriaDataModel(this);
        };

        this.copy = function copy(that) {
          return new RequisitionSearchCriteriaDataModel(that);
        };

        this.equals = function equals(that) {
          return this.client === that.client &&
            this.createdOnFrom === that.createdOnFrom &&
            this.createdOnTo === that.createdOnTo &&
            this.deliveryLocation === that.deliveryLocation &&
            this.department === that.department &&
            this.includeCancelledRequisitions === that.includeCancelledRequisitions &&
            this.installationLocation === that.installationLocation &&
            this.itemStatuses === that.itemStatuses &&
            this.orderId === that.orderId &&
            this.productCode === that.productCode &&
            this.productDescription === that.productDescription &&
            this.requester === that.requester &&
            this.requisitionId === that.requisitionId &&
            this.requisitionTypes === that.requisitionTypes &&
            this.searchMode === that.searchMode &&
            this.site === that.site &&
            this.statuses === that.statuses &&
            this.store === that.store
          ;
        };

        this.isEmpty = function isEmpty() {
          return (_.isNil(this.client) || _.isEmpty(this.client)) &&
             _.isNil(this.createdOnFrom) &&
             _.isNil(this.createdOnTo) &&
            (_.isNil(this.deliveryLocation) || _.isEmpty(this.deliveryLocation)) &&
            (_.isNil(this.department) || _.isEmpty(this.department)) &&
            (_.isNil(this.includeCancelledRequisitions) || _.isEmpty(this.includeCancelledRequisitions)) &&
            (_.isNil(this.installationLocation) || _.isEmpty(this.installationLocation)) &&
            (_.isNil(this.itemStatuses) || _.isEmpty(this.itemStatuses)) &&
            (_.isNil(this.orderId) || _.isEmpty(this.orderId)) &&
            (_.isNil(this.productCode) || _.isEmpty(this.productCode)) &&
            (_.isNil(this.productDescription) || _.isEmpty(this.productDescription)) &&
            (_.isNil(this.requester) || _.isEmpty(this.requester)) &&
            (_.isNil(this.requisitionId) || _.isEmpty(this.requisitionId)) &&
            (_.isNil(this.requisitionTypes) || _.isEmpty(this.requisitionTypes)) &&
            (_.isNil(this.site) || _.isEmpty(this.site)) &&
            (_.isNil(this.statuses) || _.isEmpty(this.statuses)) &&
            (_.isNil(this.store) || _.isEmpty(this.store))
          ;
        };
      }
    }
  }
)();
