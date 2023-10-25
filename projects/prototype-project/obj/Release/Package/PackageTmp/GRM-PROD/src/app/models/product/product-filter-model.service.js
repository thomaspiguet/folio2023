(
  function() {
    'use strict';

    angular
      .module('app.models.product')
      .factory('ProductFilterModel', ProductFilterModelFactory)
    ;

    /* @ngInject */
    function ProductFilterModelFactory() {
      return ProductFilterModel;
    }

    function ProductFilterModel(obj) {
      // Define the available search modes
      // Object.defineProperty(this, 'productSources', {
      //   value: {
      //     associated: 'associated',
      //     nonAssociated: 'nonAssociated',
      //     all: 'all'
      //   }
      // });

      var that = _.extend({
        brand: undefined,
        buyer: undefined,
        contractNumber: undefined,
        gtinCode: undefined,
        homologationClass: undefined,
        homologationNumber: undefined,
        manufacturer: undefined,
        manufacturerProductCode: undefined,
        name: undefined,
        productNumber: undefined,
        productSourceCode: undefined,
        unspscClassification: undefined,
        vendor: undefined,
        vendorProductCode: undefined,
        vendorProductDescription: undefined
      }, obj);

      this.brand = that.brand;
      this.buyer = that.buyer;
      this.contractNumber = that.contractNumber;
      this.gtinCode = that.gtinCode;
      this.homologationClass = that.homologationClass;
      this.homologationNumber = that.homologationNumber;
      this.manufacturer = that.manufacturer;
      this.manufacturerProductCode = that.manufacturerProductCode;
      this.name = that.name;
      this.productNumber = that.productNumber;
      this.productSourceCode = that.productSourceCode;
      this.unspscClassification = that.unspscClassification;
      this.vendor = that.vendor;
      this.vendorProductCode = that.vendorProductCode;
      this.vendorProductDescription = that.vendorProductDescription;

      /*Compares using a custom comparer to ignore "function" properties
      and consider properties with value null, undefined or "" as equal.*/
      this.isEqual = function isEqual(obj) {
        return _.isEqualWith(this, obj, function(val1, val2) {
          if (_.isFunction(val1) && _.isFunction(val2)) {
            return val1.toString() === val2.toString();
          }
          if (_.isNil(val1) && (_.isNil(val2) || val2 === '') ||
              _.isNil(val2) && (_.isNil(val1) || val1 === '')) {
            return true;
          }
        });
      };

      this.clone = function clone() {
        return new ProductFilterModel(this);
      };
    }
  }
)();
