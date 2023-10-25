(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionHeaderActionsStateModel', RequisitionHeaderActionsStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionHeaderActionsStateModelFactory() {
      return RequisitionHeaderActionsStateModel;
    }

    function RequisitionHeaderActionsStateModel(obj) {
      var that = _.extend({
        quickHeaderEntry: {
          disabled: false,
          hidden: false
        },
        requisitionTemplate: {
          disabled: false,
          hidden: false
        },
        attachFile: {
          disabled: true,
          hidden: false
        },
        moreActions: {
          disabled: true,
          hidden: false,
          manageAuthorizers : {
            add : {
              hidden: false,
              disable:false
            },
            replace : {
              hidden: false,
              disable:false
            }
          }
        }
      }, obj);

      this.quickHeaderEntry = that.quickHeaderEntry;
      this.requisitionTemplate = that.requisitionTemplate;
      this.attachFile = that.attachFile;
      this.moreActions = that.moreActions;

      this.clone = function clone() {
        return new RequisitionHeaderActionsStateModel(this);
      };
    }
  }
)();
