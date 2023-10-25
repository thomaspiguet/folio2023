(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-search')
      .factory('RequisitionSearchProductListDataModel', RequisitionSearchProductListDataModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchProductListDataModelFactory() {
      return RequisitionSearchProductListDataModel;
    }

    function RequisitionSearchProductListDataModel(obj) {
      var that = _.extend({
        products: [],
        totalCount: 0
      }, obj);

      this.products = that.products;
      this.totalCount = that.totalCount;

      this.clone = function clone() {
        return new RequisitionSearchProductListDataModel(this);
      };

      this.newProductResultInstance = function newProductResultInstance() {
        return new RequisitionSearchProductResultInstance();
      };
    }

    function RequisitionSearchProductResultInstance(obj) {
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
      }, obj);

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
)();
