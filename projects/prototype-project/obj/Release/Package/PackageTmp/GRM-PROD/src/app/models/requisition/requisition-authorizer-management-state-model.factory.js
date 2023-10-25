(
  function() {
    'use strict';

    angular
      .module('app.models.requisition')
      .factory('RequisitionAuthorizerManagementStateModel', RequisitionAuthorizerManagementStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionAuthorizerManagementStateModelFactory(UserProfileService) {
      return RequisitionAuthorizerManagementStateModel;

      function RequisitionAuthorizerManagementStateModel(obj) {
        var that = _.extend({
          authorizer: {
            disabled: false,
            required: true
          },
          authorizerFrom: {
            disabled: false,
            required: true
          },
          authorizerTo: {
            disabled: false,
            required: true
          },
          addAuthorizer: {
            disabled: false
          },
          replaceAuthorizer: {
            disabled: false
          }
        }, obj);

        this.authorizer = that.authorizer;
        this.authorizerFrom = that.authorizerFrom;
        this.authorizerTo = that.authorizerTo;
        this.addAuthorizer = that.addAuthorizer;
        this.replaceAuthorizer = that.replaceAuthorizer;

        this.clone = function clone() {
          return new RequisitionAuthorizerManagementStateModel(this);
        };
      }
    }
  }
)();
