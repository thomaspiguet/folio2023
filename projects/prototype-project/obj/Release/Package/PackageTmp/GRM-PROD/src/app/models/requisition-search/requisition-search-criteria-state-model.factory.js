(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-search')
      .factory('RequisitionSearchCriteriaStateModel', RequisitionSearchCriteriaStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchCriteriaStateModelFactory() {
      return RequisitionSearchCriteriaStateModel;
    }

    function RequisitionSearchCriteriaStateModel(obj) {
        var that = _.extend({
          client: {
            hidden: false
          },
          clear: {
            disabled: false
          },
          search: {
            disabled: false
          }
        }, obj);

        this.client = that.client;
        this.clear = that.clear;
        this.search = that.search;

        this.clone = function clone() {
          return new RequisitionSearchCriteriaStateModel(this);
        };
    }
  }
)();
