;(
  function() {
    'use strict';

    angular
      .module('app.models.authorization')
      .factory('AuthorizationListDataModel', AuthorizationListDataModelFactory)
    ;

    /* @ngInject */
    function AuthorizationListDataModelFactory(uuid4) {

      // stips attributes beginning with "$$" from payload
      function authorizationDetailsInstance(payload) {
        return _
          .chain(payload)
          .omitBy(function(value, key) {
            return key.startsWith('$$');
          })
          .value()
        ;
      }

      function AuthorizationListDataModel(payload) {
        var that = _.extend({
          selectAll: false,
          authorizations: [],
          count: 0,
          modelId: undefined,
          sorting: undefined,
          searchCriteriaApplied: false,
          scrollPosition: 0,
          selectedRowId: undefined
        }, payload);

        // a unique id for this model instance
        this.modelId = uuid4.generate();
        this.selectAll = that.selectAll;
        this.count = that.count;
        this.sorting = that.sorting;
        this.searchCriteriaApplied = that.searchCriteriaApplied;
        this.scrollPosition = that.scrollPosition;
        this.selectedRowId = that.selectedRowId;

        //
        // transformations to be applied to given payload
        //
        // the key attribute in each sub object will be the new named key, replacing the object's named key
        // if provided, the transformer function will be applied to the given key
        //
        var authorizationTransformations = {
          nature: { key: 'natureCode', transformer: _.toString }, // nature will become natureCode, and will be transformed to a string object
          requisitionRequester: { key: 'requester' },
          status: { key: 'statusCode', transformer: _.toString },
          type: { key: 'typeCode', transformer: _.toString },
        };

        // apply to all authorizations in payload
        var authorizations = _.map(that.authorizations, function(authorization) {

          if (authorization.authorizationDetails && authorization.authorizationDetails.length) {
            // make sure no '$$' attributes are copied
            authorization.authorizationDetails = _.map(authorization.authorizationDetails, function(authorizationDetails) {
              return authorizationDetailsInstance(authorizationDetails);
            });
          }

          // no model id... this is a payload resulting from an api call - create model for the first time
          if (_.isNil(that.modelId)) {

            // authorization.selected = false; // authorization is not selected
            // authorization.expanded = true; // authorization is expanded

            return _
              .chain(authorization)
              .mapValues(function (value, key) {
                if (authorizationTransformations[key] && authorizationTransformations[key].transformer) {
                  return authorizationTransformations[key].transformer(value);
                }
                return value;
              })
              .mapKeys(function(value, key) {
                if (authorizationTransformations[key] && authorizationTransformations[key].key) {
                  return authorizationTransformations[key].key;
                }
                return key;
              })
              .value()
            ;
          }
          // existing model being copied... only strip '$$' attributes
          else {
            return _
              .chain(authorization)
              .omitBy(function(value, key) {
                return key.startsWith('$$');
              })
              .value()
            ;
          }
        });
        this.authorizations = authorizations;
      }

      return AuthorizationListDataModel;
    }
  }
)();
