;(
  function() {
    'use strict';

    angular
      .module('app.models.authorization')
      .factory('AuthorizationSearchCriteriaDataModel', AuthorizationSearchCriteriaDataModelFactory)
    ;

    /* @ngInject */
    function AuthorizationSearchCriteriaDataModelFactory() {
      return AuthorizationSearchCriteriaDataModel;
    }

    function AuthorizationSearchCriteriaDataModel(obj) {
      var that = _.extend({
        requisitionId: undefined,
        requisitionRequester: undefined,
        requiredOnFrom: null,
        requiredOnTo: null,
        toAuthorizeSince: undefined
      }, obj);

      this.requisitionId = that.requisitionId;
      this.requisitionRequester = that.requisitionRequester;
      this.requiredOnFrom = that.requiredOnFrom;
      this.requiredOnTo = that.requiredOnTo;
      this.toAuthorizeSince = that.toAuthorizeSince;

      this.clone = function clone() {
        return new AuthorizationSearchCriteriaDataModel(this);
      };

      this.isEmpty = function isEmpty() {
        return (_.isNil(this.requisitionId) || _.isEmpty(this.requisitionId)) &&
               (_.isNil(this.requisitionRequester) || _.isEmpty(this.requisitionRequester)) &&
                _.isNil(this.requiredOnFrom) &&
                _.isNil(this.requiredOnTo) &&
               (_.isNil(this.toAuthorizeSince) || _.isEmpty(this.toAuthorizeSince));
      };

      this.getSearchableCriteria = function getSearchableCriteria() {
        var criteria = {
          requisitionId: this.requisitionId,
          requisitionRequesterId: !_.isNil(this.requisitionRequester) ? this.requisitionRequester.id : undefined,
          requiredOnFrom: _.isNil(this.requiredOnFrom) ? undefined : this.requiredOnFrom,
          requiredOnTo: _.isNil(this.requiredOnTo) ? undefined : this.requiredOnTo,
          toAuthorizeSince: this.toAuthorizeSince
        };

        return criteria;
      };
    }
  }
)();
