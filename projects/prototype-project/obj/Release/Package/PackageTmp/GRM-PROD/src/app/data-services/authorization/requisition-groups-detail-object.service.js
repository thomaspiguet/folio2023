;(
  function() {
    'use strict';

    angular
      .module('app.dataservices.authorization')
      .service('RequisitionGroupsDetailObjectService', RequisitionGroupsDetailObjectServiceImpl)
    ;

    function RequisitionGroupsDetailObjectServiceImpl() {
      function newInstance() {
        return new RequisitionGroupsDetail();
      }

      function toObject(dto) {
        return new RequisitionGroupsDetail(dto);
      }

      function RequisitionGroupsDetail(dto) {
        var that = _.extend({
          authorizationGroupId: undefined,
          amount: undefined,
          product: {
            type: undefined,
            complementaryDescription: undefined,
            id: undefined,
            code: undefined,
            description: undefined
          },
          quantity: undefined,
          formatDescription: undefined,
          price: undefined,
          account: {
            id: undefined,
            code: undefined,
            description: undefined
          },
          requisitionItemId: undefined,
          requisitionItemNote: undefined
        }, dto);

        this.amount = that.amount;
        this.product = {
          type: that.product.type,
          complementaryDescription: that.product.complementaryDescription,
          id: that.product.id,
          code: that.product.code,
          description: that.product.description
        };
        this.quantity = that.quantity;
        this.formatDescription = that.formatDescription;
        this.price = that.price;
        this.account = {
          id: that.account.id,
          code: that.account.code,
          description: that.account.description
        };
        this.requisitionItemId = that.requisitionItemId;
      }

      return {
        newInstance: newInstance,
        toObject: toObject
      };
    }
  }
)();
