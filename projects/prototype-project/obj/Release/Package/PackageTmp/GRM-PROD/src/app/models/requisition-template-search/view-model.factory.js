(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-template-search')
      .factory('ViewModel', viewModelFactory)
    ;

    /* @ngInject */
    function viewModelFactory() {
      return ViewModel;

      function ViewModel(obj) {
        var that = _.extend({
          paging: {
            size: 20,
            offset: 0,
            total: 0
          },
          sorting: {
            by: ['templateId'],
            descending: false
          }
        }, obj);

        this.paging = that.paging;
        this.sorting = that.sorting;

        this.clone = function clone() {
          return new ViewModel(this);
        };
      }
    }
  }
)();
