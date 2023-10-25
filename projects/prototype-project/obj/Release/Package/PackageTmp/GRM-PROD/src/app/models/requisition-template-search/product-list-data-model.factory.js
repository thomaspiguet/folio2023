(
  function() {
    'use strict';

    angular
      .module('app.models')
      .factory('ProductListDataModel', ProductListDataModelFactory)
    ;

    /* @ngInject */
    function ProductListDataModelFactory() {
      return ProductListDataModel;
    }

    function ProductListDataModel(obj) {
      var that = _.extend({
        products: [],
        totalCount: 0
      }, obj);

      this.products = that.products;
      this.totalCount = that.totalCount;

      this.clone = function clone() {
        return new ProductListDataModel(this);
      };

      this.newProductResultInstance = function newProductResultInstance() {
        return new ProductResultInstance();
      };
    }

    function ProductResultInstance(obj) {
      var that = _.extend({
        department: undefined,
        distributionUnit: undefined,
        isActive: false,
        isAutomaticGeneration: false,
        isProductInvalid: false,
        productCode: undefined,
        productDescription: undefined,
        productInvalidityReason: undefined,
        site: undefined,
        store: undefined,
        templateDescription: undefined,
        templateId: undefined,
        templateItemId: undefined
      }, obj);

      this.department = that.department;
      this.distributionUnit = that.distributionUnit;
      this.isActive = that.isActive;
      this.isAutomaticGeneration = that.isAutomaticGeneration;
      this.isProductInvalid = that.isProductInvalid;
      this.productCode = that.productCode;
      this.productDescription = that.productDescription;
      this.productInvalidityReason = that.productInvalidityReason;
      this.site = that.site;
      this.store = that.store;
      this.templateDescription = that.templateDescription;
      this.templateId = that.templateId;
      this.templateItemId = that.templateItemId;
    }
  }
)();
