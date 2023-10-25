(
  function() {
    'use strict';

    angular
      .module('app.models.product')
      .factory('ProductListStateModel', ProductListStateModelFactory)
    ;

    /* @ngInject */
    function ProductListStateModelFactory(UserProfileService) {
      return ProductListStateModel;

      function ProductListStateModel(obj) {
        var that = _.extend({
          hidden: true,
          isInitialized: false,
          showProductsList: true,
          showCatalogsList: false
        }, obj);

        // TODO: assign properties
        this.hidden = that.hidden;
        this.isInitialized = that.isInitialized;
        this.showProductsList = that.showProductsList;
        this.showCatalogsList = that.showCatalogsList;

        this.clone = function clone() {
          return new ProductListStateModel(this);
        };
      }
    }

  }
)();
