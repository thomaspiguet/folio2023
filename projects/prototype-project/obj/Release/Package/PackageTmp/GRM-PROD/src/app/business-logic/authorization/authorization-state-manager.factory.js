;(
  function() {
    'use strict';

    angular
      .module('app.business-logic.authorization')
      .factory('AuthorizationStateManager', AuthorizationStateManagerFactory)
    ;

    /* @ngInject */
    function AuthorizationStateManagerFactory(
      AuthorizationStateModel
    ) {
      var self = this;
      var stateModel = new AuthorizationStateModel();

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          clearState: false
        }, configParams);

        if (config.clearState) {
          stateModel = new AuthorizationStateModel();
        }

        if (config.amountRangeId) {
          stateModel.amountRangeId = config.amountRangeId;
        }

        // Expanded sections are not preserved in restored state
        self.clearExpansionState();
      };

      self.getStateModel = function getStateModel() {
        return stateModel;
      };

      self.getSelectionCount = function getSelectionCount() {
        return stateModel.selection.length;
      };

      self.getSelectedIds = function getSelectedIds() {
        return stateModel.selection;
      };

      self.updateSortingState = function updateSortingState(payload) {
        var aModel = stateModel.clone();
        aModel.sorting = payload.sorting;
        stateModel = aModel;
      };

      self.updateSelectionState = function updateSelectionState(payload) {
        var aModel = stateModel.clone();
        if (payload.selectedIds) {
          payload.selectedIds.map(function iteratee(id) {
            if (aModel.selection.indexOf(id) < 0) {
              aModel.selection.push(id);
            }
          });
        }
        else if (payload.deselectedIds) {
          var pos;
          payload.deselectedIds.map(function iteratee(id) {
            pos = aModel.selection.indexOf(id);
            if (pos >= 0) {
              aModel.selection.splice(pos, 1);
            }
          });
        }
        aModel.selectAll = payload.selectAll || false;
        stateModel = aModel;
      };

      self.cleanUpSelectionState = function cleanUpSelectionState(authorizations) {
        var aModel = stateModel.clone();
        var newSelection = [];
        aModel.selection.forEach(function onAuthorizationIds(authorizationId) {
          authorizations.forEach(function onAuthorizations(authorization) {
            if (authorization.id === authorizationId) {
              newSelection.push(authorizationId);
            }
          });
        });
        aModel.selection = newSelection;
        aModel.selectAll = newSelection.length === authorizations.length;
        stateModel = aModel;
      };

      self.clearSelectionState = function clearSelectionState() {
        var aModel = stateModel.clone();
        aModel.selection = [];
        aModel.selectAll = false;
        stateModel = aModel;
      };

      self.updateRequisitionedProductsExpansionState = function updateRequisitionedProductsExpansionState(payload) {
        var aModel = stateModel.clone();
        if (payload.expandedId) {
          if (aModel.expansion.indexOf(payload.expandedId) < 0) {
            aModel.expansion.push(payload.expandedId);
          }
        }
        else if (payload.collapsedId) {
          var pos = aModel.expansion.indexOf(payload.collapsedId);
          if (pos >= 0) {
            aModel.expansion.splice(pos, 1);
          }
        }

        stateModel = aModel;
      };

      self.updateRelatedAuthorizationsExpansionState = function updateRelatedAuthorizationsExpansionState(payload) {
        var aModel = stateModel.clone();
        if (payload.expandedId) {
          if (aModel.associatedAuthorizationsSectionExpansion.indexOf(payload.expandedId) < 0) {
            aModel.associatedAuthorizationsSectionExpansion.push(payload.expandedId);
          }
        }
        else if (payload.collapsedId) {
          var pos = aModel.associatedAuthorizationsSectionExpansion.indexOf(payload.collapsedId);
          if (pos >= 0) {
            aModel.associatedAuthorizationsSectionExpansion.splice(pos, 1);
          }
        }

        stateModel = aModel;
      };

      self.clearExpansionState = function clearExpansionState() {
        var aModel = stateModel.clone();
        aModel.expansion = [];
        aModel.associatedAuthorizationsSectionExpansion = [];
        stateModel = aModel;
      };

      self.updateFilteringState = function updateFilteringState(payload) {
        var aModel = stateModel.clone();
        if (payload.amountRanges) {
          aModel.amountRanges = _.arrayCopy(payload.amountRanges);
        }

        if (!_.isNil(aModel.amountRangeId)) {
          _.forEach(aModel.amountRanges, function iteratee(amountRange) {
            if (amountRange.id === aModel.amountRangeId) {
              amountRange.selected = true;
            }
          });
        }

        // if (payload.technicalsSelected || aModel.amountRangeId === 'technicals') {
        //   aModel.technicalsSelected = true;
        // }
        aModel.technicalsSelected = payload.technicalsSelected || aModel.amountRangeId === 'technicals';

        // Clear this as it should only matter when initializing facet
        aModel.amountRangeId = undefined;

        stateModel = aModel;
      };

      self.clearFilteringState = function clearFilteringState() {
        var aModel = stateModel.clone();
        aModel.amountRanges = [];
        aModel.technicalsSelected = false;
        stateModel = aModel;
      };

      self.updateSearchCriteriaState = function updateSearchCriteriaState(payload) {
        var aModel = stateModel.clone();

        if (payload.searchCriteria) {
          aModel.searchCriteria = _.cloneDeep(_.omitBy(_.extend(stateModel.searchCriteria, payload.searchCriteria), _.isFunction));
        }

        stateModel = aModel;
      };

      self.setSearchCriteriaAppliedState = function setSearchCriteriaAppliedState(value) {
        var aModel = stateModel.clone();
        aModel.searchCriteriaApplied = value;
        stateModel = aModel;
      };

      self.getSearchCriteriaAppliedState = function getSearchCriteriaAppliedState() {
        return true === stateModel.searchCriteriaApplied;
      };
      
      self.updateScrollPosition = function updateScrollPosition(payload) {
        stateModel.scrollPosition = payload.scrollPosition;
      };
      
      self.updateRowSelection = function updateRowSelection(payload) {
        stateModel.selectedRowId = payload.selectedRowId;
      };
      return self;
    }
  }
)();
