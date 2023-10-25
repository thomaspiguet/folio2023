(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionUncataloguedProductStateModel', RequisitionUncataloguedProductStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionUncataloguedProductStateModelFactory(UserProfileService) {
      return RequisitionUncataloguedProductStateModel;

      function RequisitionUncataloguedProductStateModel(obj) {
        var that = _.extend({
          account: {
            disabled: false,
            required: false
          },
          buyer: {
            disabled: false,
            required: false
          },
          classification: {
            hidden: false,
            segment: {
              disabled: false,
              required: false
            },
            family: {
              disabled: false,
              required: false
            },
            class: {
              disabled: false,
              required: false
            }
          },
          cost: {
            disabled: false,
            required: false
          },
          description: {
            disabled: false,
            required: false
          },
          distributionUnit: {
            disabled: false,
            hidden: false,
            required: false
          },
          interactionMode: undefined,
          isUpdateable: false,
          notifyBuyerToCreateProduct: {
            disabled: false,
            required: false
          },
          noteForBuyer: {
            disabled: false,
            required: false
          },
          projectActivity: {
            disabled: false,
            required: false
          },
          quantity: {
            disabled: false,
            required: false
          },
          secondaryCode: {
            disabled: false,
            required: false
          },
          statisticalUnit: {
            disabled: false,
            hidden: false,
            required: false
          },
          vendor: {
            disabled: false,
            required: false,
            matchRequired: false
          },
          vendorItemCode: {
            disabled: false,
            required: false
          },
          taxScheme: {
            disabled: false,
            required: false
          },
          unspscClassification: {
            disabled: false,
            required: false,
            hidden: false,
            active: false,
            details: {
              hidden:false
            }
          }
        }, obj);

        this.account = that.account;
        this.buyer = that.buyer;
        this.classification = that.classification;
        this.cost = that.cost;
        this.description = that.description;
        this.distributionUnit = that.distributionUnit;
        this.interactionMode = that.interactionMode;
        this.isUpdateable = that.isUpdateable;
        this.notifyBuyerToCreateProduct = that.notifyBuyerToCreateProduct;
        this.noteForBuyer = that.noteForBuyer;
        this.projectActivity = that.projectActivity;
        this.quantity = that.quantity;
        this.secondaryCode = that.secondaryCode;
        this.statisticalUnit = that.statisticalUnit;
        this.vendor = that.vendor;
        this.vendorItemCode = that.vendorItemCode;
        this.taxScheme = that.taxScheme;
        this.unspscClassification = that.unspscClassification;

        this.clone = function clone() {
          return new RequisitionUncataloguedProductStateModel(this);
        };
      }
    }
  }
)();
