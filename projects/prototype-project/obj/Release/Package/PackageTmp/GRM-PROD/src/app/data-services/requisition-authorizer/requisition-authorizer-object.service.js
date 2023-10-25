(
  function() {
    'use strict';

    angular
      .module('app.dataservices')
      .factory('RequisitionAuthorizerObjectService', RequisitionAuthorizerObjectServiceFactory)
    ;

    /* @ngInject */
    function RequisitionAuthorizerObjectServiceFactory() {
      return {
        newInstance: newInstance,
        toObject: toObject
      };

      function newInstance() {
        return new Authorizer();
      }

      function toObject(dto) {
        return new Authorizer(dto);
      }

      function Authorizer(dto) {
        var that = _.extend({
          id: undefined,
          code: undefined,
          description: undefined,
          amount: undefined,
          nonCataloguedAmount: undefined,
          isNonCataloguedToAuthorize: undefined
        }, dto);

        this.id = that.id;
        this.code = that.code;
        this.description = that.description;
        this.amount = that.amount;//(Inv. and DP)
        this.nonCataloguedAmount = that.nonCataloguedAmount;/*Non-catalogued*/
        this.isNonCataloguedToAuthorize = that.isNonCataloguedToAuthorize;
      }
    }
  }
)();
