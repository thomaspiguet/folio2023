(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-template')
      .factory('RequisitionTemplateItemsStateModel', RequisitionTemplateItemsStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateItemsStateModelFactory() {
      return RequisitionTemplateItemsStateModel;

      function RequisitionTemplateItemsStateModel(obj) {
        var that = _.extend({
          addButton: {
            disabled: false,
            hidden: false,
            required: false
          },
          scheduleFrequency: {
            disabled: false,
            hidden: false,
            required: false
          },
          scheduleDay: {
            disabled: false,
            hidden: false,
            required: false
          },
          store: {
            disabled: false,
            hidden: false,
            required: false
          }
        }, obj);

        this.addButton = that.addButton;
        this.scheduleFrequency = that.scheduleFrequency;
        this.scheduleDay = that.scheduleDay;
        this.store = that.store;

        this.clone = function clone() {
          return new RequisitionTemplateItemsStateModel(this);
        };
      }
    }

  }
)();
