(
  function() {
    'use strict';

    angular
      .module('app.models.product')
      .factory('ProductListModel', ProductListModelFactory)
    ;

    /* @ngInject */
    function ProductListModelFactory() {
      return ProductListModel;
    }

    function ProductListModel(obj) {
      var that = _.extend({
        products: [],
        totalCount: 0
      }, obj);

      this.products = that.products;
      this.totalCount = that.totalCount;

      this.clone = function clone() {
        return new ProductListModel(this);
      };

      this.newProductResultInstance = function newProductResultInstance() {
        return new ProductResultInstance();
      };
    }

    function ProductResultInstance(obj) {
      var that = _.extend({
        id: undefined,
        catalogId: undefined,
        code: undefined,
        description: undefined,
        productDescription: undefined,
        formatId: undefined,
        formatDescription: undefined,
        price: undefined,
        unspscClassification: undefined,
        buyerId: undefined,
        isPermitted: false,
        type: undefined,
        isAssociatedToEstablishment: false,
        manufacturer: undefined,
        supplier: undefined,
        supplierItemCode: undefined,
      }, obj);

      this.id = that.id;
      this.catalogId = that.catalogId;
      this.code = that.code;
      this.description = that.description;
      this.productDescription = that.productDescription;
      this.formatId = that.formatId;
      this.formatDescription = that.formatDescription;
      this.price = that.price;
      this.unspscClassification = that.unspscClassification;
      this.buyerId = that.buyerId;
      this.isPermitted = that.isPermitted;
      this.type = that.type;
      this.isAssociatedToEstablishment = that.isAssociatedToEstablishment;
      this.manufacturer = that.manufacturer;
      this.supplier = that.supplier;
      this.supplierItemCode = that.supplierItemCode;
    }
  }
)();
