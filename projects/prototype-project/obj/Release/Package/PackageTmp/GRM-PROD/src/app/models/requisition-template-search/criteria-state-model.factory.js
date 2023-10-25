(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-template-search')
      .factory('CriteriaStateModel', CriteriaStateModelFactory)
    ;

    /* @ngInject */
    function CriteriaStateModelFactory() {
      return CriteriaStateModel;
    }

    function CriteriaStateModel(obj) {
        var that = _.extend({
          clear: {
            disabled: false
          },
          search: {
            disabled: false
          }
        }, obj);

        this.clear = that.clear;
        this.search = that.search;

        this.clone = function clone() {
          return new CriteriaStateModel(this);
        };
    }
  }
)();
