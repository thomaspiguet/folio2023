;(
  function() {
    'use strict';

    angular
      .module('app.dataservices.authorization')
      .service('RequisitionGroupsAuthorizerApprovalObjectService', RequisitionGroupsAuthorizerApprovalObjectServiceImpl)
    ;

    function RequisitionGroupsAuthorizerApprovalObjectServiceImpl() {
      function newInstance() {
        return new RequisitionGroupsAuthorizerApproval();
      }

      function toObject(dto) {
        return new RequisitionGroupsAuthorizerApproval(dto);
      }

      function RequisitionGroupsAuthorizerApproval(dto) {
        var that = _.extend({
          authorizationGroupId: undefined,
          authorizerAmount: undefined,
          requester: undefined, 
          exceptionRequester: undefined, 
          authorizedOn: undefined,
          authorizationStatus: undefined,
          exceptionSource: undefined
        }, dto);

        this.authorizationGroupId = that.authorizationGroupId;
        this.authorizerAmount = that.authorizerAmount;
        this.requester = that.requester;
        this.exceptionRequester = that.exceptionRequester;
        this.authorizedOn = that.authorizedOn;
        this.authorizationStatus = that.authorizationStatus;
        this.exceptionSource = that.exceptionSource;
      }

      return {
        newInstance: newInstance,
        toObject: toObject
      };
    }
  }
)();
