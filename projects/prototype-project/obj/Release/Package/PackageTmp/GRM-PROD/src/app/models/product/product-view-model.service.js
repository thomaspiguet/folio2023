(
  function() {
    'use strict';

    angular
      .module('app.models.product')
      .factory('ProductViewModel', ProductViewModelFactory)
    ;

    /* @ngInject */
    function ProductViewModelFactory() {
      function PristineModel() {
        this.paging = {
          size: 20,
          offset: 0,
          total: 0
        };
        this.sorting = {
          by: ['code'],
          descending: false
        };
      }

      function ProductViewModel(obj) {
        var that = _.extend({}, new PristineModel(), obj);

        this.paging = that.paging;
        this.sorting = that.sorting;

        this.clone = function clone() {
          return new ProductViewModel(this);
        };

        this.reset = function reset() {
          return new ProductViewModel();
        };
      }
      return ProductViewModel;
    }
  }

)();
