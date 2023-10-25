(
  function() {
    'use strict';

    angular
        .module('app.models.requisition')
        .factory('RequisitionAuthorizerManagementModel', RequisitionAuthorizerManagementModelFactory);

    /* @ngInject */
    function RequisitionAuthorizerManagementModelFactory() {
      return RequisitionAuthorizerManagementModel;

      function RequisitionAuthorizerManagementModel(obj) {
        var that = _.extend({
            authorizer: undefined,
            authorizerFrom: undefined,
            authorizerTo: undefined
        },
        obj);

        this.authorizer = that.authorizer;
        this.authorizerFrom = that.authorizerFrom;
        this.authorizerTo = that.authorizerTo;

        this.clone = function clone() {
          return new RequisitionAuthorizerManagementModel(this);
        };
      }
    }
  }
)();
