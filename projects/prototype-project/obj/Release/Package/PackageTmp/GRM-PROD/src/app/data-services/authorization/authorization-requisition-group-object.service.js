;(
  function() {
    'use strict';

    angular
      .module('app.dataservices.authorization')
      .factory('AuthorizationRequisitionGroupObjectService', AuthorizationRequisitionGroupObjectFactory)
    ;

    /* @ngInject */
    function AuthorizationRequisitionGroupObjectFactory() {

      function newInstance() {
        return new AuthorizationRequisitionGroupObject();
      }

      function toObject(dto) {
        return new AuthorizationRequisitionGroupObject(dto);
      }

      function AuthorizationRequisitionGroupObject(dto) {
        var that = _.extend({
          id: undefined,
          authorizationGroupId: undefined,
          nature: undefined,
          type: undefined,
          technicalOrigin: undefined,
          technicalValue: undefined,
          status: undefined,
          requisitionId: undefined,
          department: undefined,
          requisitionRequester: undefined,
          requiredOn: undefined,
          toAuthorizeSince: undefined,
          amount: undefined,
          explanation: undefined
        }, dto);
        
        this.id = that.id;
        this.authorizationGroupId = that.authorizationGroupId;
        this.natureCode = that.nature + '';
        this.typeCode = that.type + '';
        this.technicalOrigin = that.technicalOrigin;
        this.technicalValue = that.technicalValue;
        this.statusCode = that.status + '';
        this.requisitionId = that.requisitionId;
        this.department = that.department;
        this.requester = that.requisitionRequester;
        this.requiredOn = that.requiredOn;
        this.toAuthorizeSince = that.toAuthorizeSince;
        this.amount = that.amount;
        this.explanation = that.explanation;
      }

      return {
        newInstance: newInstance,
        toObject: toObject
      };
    }

  }
)();
