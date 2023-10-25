(
  function() {
    'use strict';

    angular
      .module('app.dataservices.product')
      .factory('ProductObjectService', ProductObjectService);

    /* @ngInject */
    function ProductObjectService() {
      return {
        toObject: toObject,
        //toDto: toDto,
        newInstance: newInstance
      };

      function toObject(dto) {
        return new ProductInfo(dto);
      }

      /*function toDto(object) {
        return object;
      }*/

      function newInstance() {
        return new ProductInfo();
      }

      // ProductInfo object constructor
      function ProductInfo(dto) {
        var that = _.extend({
          buyerId: undefined,
          catalogId: undefined,
          code: undefined,
          description: undefined,
          productDescription: undefined,
          disabled : false,
          formatDescription: undefined,
          formatId: undefined,
          id: undefined,
          isAssociatedToEstablishment: undefined,
          isPermitted: undefined,
          price: undefined,
          type: undefined,
          unspscClassification: undefined,
          manufacturer: undefined,
          supplier: undefined,
          supplierItemCode: undefined
        }, dto);

        this.buyerId = that.buyerId;
        this.catalogId = that.catalogId;
        this.code = that.code;
        this.description = that.description;
        this.productDescription = that.productDescription;
        this.disabled = that.disabled;
        this.formatDescription = that.formatDescription;
        this.formatId = that.formatId;
        this.id = that.id;
        this.isAssociatedToEstablishment = that.isAssociatedToEstablishment;
        this.isPermitted = that.isPermitted;
        this.price = that.price;
        this.type = that.type;
        this.unspscClassification = that.unspscClassification;
        this.manufacturer = that.manufacturer;
        this.supplier = that.supplier;
        this.supplierItemCode = that.supplierItemCode;
      }
    }
  }
)();
