(
  function() {
    'use strict';

    angular
      .module('app.dataservices.authorization')
      .factory('AuthorizationObjectService', AuthorizationObjectService)
    ;

    /* @ngInject */
    function AuthorizationObjectService() {
      function newInstance() {
        return new Authorization();
      }

      function toObject(dto) {
        return new Authorization(dto);
      }

      function Authorization(dto) {
        var that = _.extend({
          authorizationAmount: undefined, // montant
          authorizationCompletionStatus: undefined,
          authorizationGroupAmount: undefined, // mnt grp
          authorizationGroupId: undefined,
          authorizationGroupStatus: undefined, // active
          authorizationId: undefined,
          authorizationOverrideRequesterId: undefined,
          authorizationOverrideRequesterName: undefined, // Excep. : par
          authorizationOverrideRequesterNumber: undefined,
          authorizationSourceCode: undefined, // type
          authorizationStatusCode: undefined, // statut
          authorizationTypeCode: undefined, // nature
          authorizedOn: undefined, // autorisé le
          authorizerEmail: undefined, // courriel
          authorizerId: undefined,
          authorizerName: undefined, // autorisateur
          authorizerNote: undefined,
          authorizerPhoneExtension: undefined, // poste
          authorizerPhoneNumber: undefined, // téléphone
          authorizerRequesterNumber: undefined,
          departmentId: undefined,
          exceptionTypeCode: undefined, // source
          exceptionValueExplanation: undefined, // explication
          exceptionValueId: undefined,
          id: undefined,
          origin: undefined, // origine
          priorityOrder: undefined,
          productId: undefined,
          requisitionId: undefined,
          requisitionItemId: undefined,
          storeItemLineId: undefined,
          substituteRequesterId: undefined,
          value: undefined // valeur
        }, dto);

        this.amount = that.authorizationAmount;
        this.authorizationId = that.authorizationId;
        this.authorizedOn = that.authorizedOn;
        this.authorizerEmail = that.authorizerEmail;
        this.authorizerId = that.authorizerId;
        this.authorizerName = that.authorizerName;
        this.authorizerNote = that.authorizerNote;
        this.authorizerPhoneExtension = that.authorizerPhoneExtension;
        this.authorizerPhoneNumber = that.authorizerPhoneNumber;
        this.authorizerRequesterNumber = that.authorizerRequesterNumber;
        this.completionStatus = that.authorizationCompletionStatus;
        this.departmentId = that.departmentId;
        this.exceptionTypeCode = that.exceptionTypeCode;
        this.exceptionValueExplanation = that.exceptionValueExplanation;
        this.exceptionValueId = that.exceptionValueId;
        this.groupAmount = that.authorizationGroupAmount;
        this.groupId = that.authorizationGroupId;
        this.groupStatus = that.authorizationGroupStatus;
        this.id = that.id;
        this.origin = that.origin;
        this.overrideRequesterId = that.authorizationOverrideRequesterId;
        this.overrideRequesterName = that.authorizationOverrideRequesterName;
        this.overrideRequesterNumber = that.authorizationOverrideRequesterNumber;
        this.priorityOrder = that.priorityOrder;
        this.productId = that.productId;
        this.requisitionId = that.requisitionId;
        this.requisitionItemId = that.requisitionItemId;
        this.sourceCode = that.authorizationSourceCode;
        this.statusCode = that.authorizationStatusCode;
        this.storeItemLineId = that.storeItemLineId;
        this.substituteRequesterId = that.substituteRequesterId;
        this.typeCode = that.authorizationTypeCode;
        this.value = that.value;
      }

      return {
        newInstance: newInstance,
        toObject: toObject
      };
    }
  }
)();
