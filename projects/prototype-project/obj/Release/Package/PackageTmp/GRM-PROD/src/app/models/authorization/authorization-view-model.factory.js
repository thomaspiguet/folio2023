;(
  function() {
    'use strict';

    angular
      .module('app.models.authorization')
      .factory('AuthorizationViewModel', AuthorizationViewModelFactory)
    ;

    /* @ngInject */
    function AuthorizationViewModelFactory() {
      var pristineModel = {
        // The complete, unfiltered authorization list
        authorizations: []
      };

      function AuthorizationViewModel(obj) {
        var that = _.extend({}, pristineModel, obj);

        this.authorizations = that.authorizations;

        this.clone = function clone() {
          return new AuthorizationViewModel(this);
        };

        this.reset = function reset() {
          return new AuthorizationViewModel();
        };
      }

      return AuthorizationViewModel;
    }
  }
)();
