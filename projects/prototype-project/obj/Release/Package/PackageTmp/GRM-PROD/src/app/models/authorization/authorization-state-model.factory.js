;(
  function() {
    'use strict';

    angular
      .module('app.models.authorization')
      .factory('AuthorizationStateModel', AuthorizationStateModelFactory)
    ;

    /* @ngInject */
    function AuthorizationStateModelFactory() {
      var pristineState = {
        amountRangeId: undefined,
        amountRanges: [],
        selectAll: false,
        selection: [],
        expansion: [],
        associatedAuthorizationsSectionExpansion: [],
        sorting: {
          by: ['authorizationId'],
          descending: false
        },
        searchCriteria: {
          requisitionId: undefined,
          requisitionRequester: undefined,
          requiredOnFrom: null,
          requiredOnTo: null,
          toAuthorizeSince: undefined
        },
        searchCriteriaApplied: false,
        technicalsSelected: false,
        scrollPosition: 0,
        selectedRowId: undefined
      };

      function AuthorizationStateModel(obj) {
        var that = _.extend({}, _.cloneDeep(pristineState), obj);

        this.amountRangeId = that.amountRangeId;
        this.amountRanges = that.amountRanges;
        this.selectAll = that.selectAll;
        this.selection = that.selection;
        this.expansion = that.expansion;
        this.associatedAuthorizationsSectionExpansion = that.associatedAuthorizationsSectionExpansion;
        this.sorting = that.sorting;
        this.searchCriteria = that.searchCriteria;
        this.searchCriteriaApplied = that.searchCriteriaApplied;
        this.technicalsSelected = that.technicalsSelected;
        this.scrollPosition = that.scrollPosition;
        this.selectedRowId = that.selectedRowId;

        this.clone = function clone() {
          return new AuthorizationStateModel(this);
        };

        this.reset = function reset() {
          return new AuthorizationStateModel();
        };
        this.getPristineState = function getPristineState() {
          return _.extend({}, pristineState);
        };
      }

      return AuthorizationStateModel;
    }
  }
)();
