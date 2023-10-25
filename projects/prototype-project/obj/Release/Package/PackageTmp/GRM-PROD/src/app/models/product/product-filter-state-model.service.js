(
  function() {
    'use strict';

    angular
      .module('app.models.product')
      .factory('ProductFilterStateModel', ProductFilterStateModelFactory)
    ;

    /* @ngInject */
    function ProductFilterStateModelFactory() {
      return ProductFilterStateModel;

      function ProductFilterStateModel(obj) {
        var that = _.extend({
          products: {
            hidden: false
          },
          externalSales: {
            hidden: true
          },
          productSource: {
            hidden: false,
            showProducts: true,
            showCatalogs: true,
            showExternalSales: true,
            showConsumptionStatistics: false // TODO: unavailable at the moment
          },
          productNumber: {
            disabled: false,
            hidden: false,
            required: false
          },
          name: {
            disabled: false,
            hidden: false,
            required: false
          },
          unspscClassification: {
            disabled: false,
            hidden: false,
            required: false
          },
          buyer: {
            disabled: false,
            hidden: false,
            required: false
          },
          catalog: {
            hidden: false
          },
          vendor: {
            disabled: false,
            hidden: false,
            required: false
          },
          vendorProductCode: {
            disabled: false,
            hidden: false,
            required: false
          },
          vendorProductDescription: {
            disabled: false,
            hidden: false,
            required: false
          },
          manufacturer: {
            disabled: false,
            hidden: false,
            required: false
          },
          manufacturerProductCode: {
            disabled: false,
            hidden: false,
            required: false
          },
          gtinCode: {
            disabled: false,
            hidden: false,
            required: false
          },
          brand: {
            disabled: false,
            hidden: false,
            required: false
          },
          homologationClass: {
            disabled: false,
            hidden: false,
            required: false
          },
          homologationNumber: {
            disabled: false,
            hidden: false,
            required: false
          },
          contractNumber: {
            disabled: false,
            hidden: false,
            required: false
          },
          search: {
            disabled: false,
            hidden: false,
            running: false,
            completed: false
          },
          clear: {
            disabled: false
          }
        }, obj);

        this.products = that.products;
        this.externalSales = that.externalSales;
        this.productSource = that.productSource;
        this.productNumber = that.productNumber;
        this.name = that.name;
        this.unspscClassification = that.unspscClassification;
        this.buyer = that.buyer;
        this.catalog = that.catalog;
        this.vendor = that.vendor;
        this.vendorProductCode = that.vendorProductCode;
        this.vendorProductDescription = that.vendorProductDescription;
        this.manufacturer = that.manufacturer;
        this.manufacturerProductCode = that.manufacturerProductCode;
        this.gtinCode = that.gtinCode;
        this.brand = that.brand;
        this.homologationClass = that.homologationClass;
        this.homologationNumber = that.homologationNumber;
        this.contractNumber = that.contractNumber;
        this.search = that.search;
        this.clear = that.clear;

        this.clone = function clone() {
          return new ProductFilterStateModel(this);
        };
      }
    }

  }
)();
