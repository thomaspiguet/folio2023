(
  function() {
    'use strict';

    angular
      .module('app.models.authorization')
      .factory('AuthorizationSearchCriteriaStateModel', AuthorizationSearchCriteriaStateModelFactory)
    ;

    /* @ngInject */
    function AuthorizationSearchCriteriaStateModelFactory() {
      return AuthorizationSearchCriteriaStateModel;
    }

    function AuthorizationSearchCriteriaStateModel(obj) {
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
          return new AuthorizationSearchCriteriaStateModel(this);
        };
    }
  }
)();
