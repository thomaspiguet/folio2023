(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-search')
      .factory('RequisitionSearchViewModel', requisitionSearchViewModelFactory)
    ;

    /* @ngInject */
    function requisitionSearchViewModelFactory() {

      var pristineModel = {
        paging: {
          size: 20,
          offset: 0,
          total: 0
        },
        sorting: {
          by: ['requisitionId'],
          descending: false
        }
      };

      function RequisitionSearchViewModel(obj) {
        var that = _.extend({}, obj, pristineModel);

        this.paging = that.paging;
        this.sorting = that.sorting;

        this.clone = function clone() {
          return new RequisitionSearchViewModel(this);
        };

        this.reset = function reset() {
          return new RequisitionSearchViewModel();
        };
      }

      return RequisitionSearchViewModel;
    }
  }
)();
