(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionItemTabsStateModel', RequisitionItemTabsStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionItemTabsStateModelFactory() {
      return RequisitionItemTabsStateModel;
    }

    function RequisitionItemTabsStateModel(obj) {
      var that = _.extend({
        //
        // Tabs sub section
        //
        tabs: {
          product: {
            disabled: false,
            hidden: false,
          },
          quantities: {
            disabled: false,
            hidden: true,
          },
          purchaseProcess: {
            disabled: false,
            hidden: true,
          },
          fixedAssets: {
            disabled: false,
            hidden: true,
          },
          authorizations: {
            disabled: false,
            hidden: true,
          },
        },
        //
        // Fields
        //
        account: {
          disabled: false,
          hidden: false,
          required: false
        },
        note: {
          disabled: false,
          hidden: false,
          required: false
        },
        store: {
          disabled: false,
          hidden: false,
          required: false
        },
        acquisitionType: {
          disabled: false,
          hidden: false,
          required: false
        },
        acquisitionReason: {
          disabled: false,
          hidden: false,
          required: false
        },
        modelNumber: {
          disabled: false,
          hidden: false,
          required: false
        }
      }, obj);

      this.tabs = that.tabs;
      this.account = that.account;
      this.note = that.note;
      this.store = that.store;
      this.acquisitionType = that.acquisitionType;
      this.acquisitionReason = that.acquisitionReason;
      this.modelNumber = that.modelNumber;

      this.clone = function clone() {
        return new RequisitionItemTabsStateModel(this);
      };
    }
  }
)();
