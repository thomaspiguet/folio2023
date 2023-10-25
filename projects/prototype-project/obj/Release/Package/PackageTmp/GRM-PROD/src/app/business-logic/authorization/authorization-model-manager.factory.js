; (
  function () {
    'use strict';

    angular
      .module('app.business-logic.authorization')
      .factory('AuthorizationModelManager', AuthorizationModelManagerFactory)
    ;

    /* @ngInject */
    function AuthorizationModelManagerFactory(
      $filter,
      AuthorizationAmountRangeDataModel,
      AuthorizationListDataModel,
      AuthorizationSearchCriteriaDataModel,
      AuthorizationStateManager,
      AuthorizationStateModel,
      AuthorizationViewModel,
      DynamicLookupService
    ) {
      var self = this;
      var viewModel;
      var authorizationAmountRangeDataModel;
      var authorizationListDataModel;
      var authorizationSearchCriteriaDataModel;

      self.initialize = function initialize(obj) {
        viewModel = new AuthorizationViewModel(obj);
        self.resetAuthorizationAmountRangeDataModel(obj);
        self.resetAuthorizationListDataModel(obj);
        self.resetAuthorizationSearchCriteriaDataModel(obj);
      };

      self.synchronize = function synchronize(payload) {
        // declare work list
        var authorizationList = payload.authorizations;

        // this adds properties if needed (typically descriptions, derived from payload's id/code attributes)
        authorizationList = extendAuthorizations(authorizationList);

        // synchronize view model
        synchronizeViewModel({ authorizations: authorizationList });

        // clear selection from authorization instances
        authorizationList = clearAuthorizationSelection(authorizationList);

        // filter
        authorizationList = filterAuthorizations(authorizationList);

        // sort
        authorizationList = sortAuthorizations(authorizationList);

        // selection
        authorizationList = selectAuthorizations(authorizationList);

        // expansion
        authorizationList = expandAuthorizations(authorizationList);

        // synchronize authorization list model
        authorizationListDataModel = new AuthorizationListDataModel({
          authorizations: authorizationList,
          count: payload.count,
          selectAll: AuthorizationStateManager.getStateModel().selectAll,
          sorting: AuthorizationStateManager.getStateModel().sorting,
          searchCriteriaApplied: AuthorizationStateManager.getStateModel().searchCriteriaApplied,
          scrollPosition: AuthorizationStateManager.getStateModel().scrollPosition,
          selectedRowId: AuthorizationStateManager.getStateModel().selectedRowId
        });

        // self.clearAmountRangeFilterSelection();

        // synchronize amount range counts
        synchronizeAuthorizationAmountRangeCounts();
      };

      //
      // View model
      //
      self.getViewModel = function getViewModel() {
        return viewModel;
      };

      //
      // Authorization amount range
      //
      self.getAuthorizationAmountRangeDataModel = function getAuthorizationAmountRangeDataModel() {
        return authorizationAmountRangeDataModel;
      };

      self.synchronizeAuthorizationAmountRangeDataModel = function synchronizeAuthorizationAmountRangeDataModel(payload) {
        var aModel = new AuthorizationAmountRangeDataModel(payload);
        var stateModel = AuthorizationStateManager.getStateModel();

        // We've got fresh data, let's preserve selections from old model if any...
        if (!payload.modelId && authorizationAmountRangeDataModel.modelId) {
          // Let's update range counts only...
          _.forEach(aModel.amountRanges, function iterator(range) {
            range.selected = _.find(authorizationAmountRangeDataModel.amountRanges, function(item) {
              return item.id === range.id;
            }).selected;
          });

          aModel.technicalsSelected = authorizationAmountRangeDataModel.technicalsSelected;
        }
        else {
          // Let's update range counts only...
          if (stateModel.amountRangeId) {
            _.forEach(aModel.amountRanges, function iterator(range) {
                range.selected = stateModel.amountRangeId === range.id;
            });

            aModel.technicalsSelected = stateModel.amountRangeId === 'technicals';
          }
        }

        authorizationAmountRangeDataModel = aModel;
      };

      self.resetAuthorizationAmountRangeDataModel = function resetAuthorizationAmountRangeDataModel(payload) {
        authorizationAmountRangeDataModel = new AuthorizationAmountRangeDataModel(payload);
      };

      self.clearAmountRangeFilterSelection = function clearAmountRangeFilterSelection() {
        var aModel = authorizationAmountRangeDataModel.clone();

        _.forEach(aModel.amountRanges, function iteratee(amountRange) {
          amountRange.selected = false;
        });
        aModel.technicalsSelected = false;

        authorizationAmountRangeDataModel = aModel;
      };

      //
      // Search criteria
      //
      self.getAuthorizationSearchCriteriaDataModel = function getAuthorizationSearchCriteriaDataModel() {
        return authorizationSearchCriteriaDataModel;
      };

      self.synchronizeAuthorizationSearchCriteriaDataModel = function synchronizeAuthorizationSearchCriteriaDataModel(payload) {
        authorizationSearchCriteriaDataModel = new AuthorizationSearchCriteriaDataModel(payload);
      };

      self.resetAuthorizationSearchCriteriaDataModel = function resetAuthorizationSearchCriteriaDataModel() {
        authorizationSearchCriteriaDataModel = new AuthorizationSearchCriteriaDataModel();
      };

      //
      // Authorization list
      //
      self.getAuthorizationListDataModel = function getAuthorizationListDataModel() {
        return authorizationListDataModel;
      };

      self.synchronizeAuthorizationListDataModel = function synchronizeAuthorizationListDataModel(payload) {
        authorizationListDataModel = new AuthorizationListDataModel(payload);
      };

      self.computeAuthorizationListDataModel = function computeAuthorizationListDataModel(payload) {
        // get raw list
        var authorizations = viewModel.authorizations;

        // clear selection from authorization instances
        authorizations = clearAuthorizationSelection(authorizations);

        // filter
        authorizations = filterAuthorizations(authorizations);

        // sort
        authorizations = sortAuthorizations(authorizations);

        // selection
        authorizations = selectAuthorizations(authorizations);

        // expansion
        authorizations = expandAuthorizations(authorizations);

        // if filtering has been applied, the selection may need to be adjusted
        AuthorizationStateManager.cleanUpSelectionState(authorizations);

        self.synchronizeAuthorizationListDataModel({
          authorizations: authorizations,
          selectAll: AuthorizationStateManager.getStateModel().selectAll,
          modelId: authorizationListDataModel.modelId,
          sorting: AuthorizationStateManager.getStateModel().sorting,
          searchCriteriaApplied: AuthorizationStateManager.getStateModel().searchCriteriaApplied,
          scrollPosition: AuthorizationStateManager.getStateModel().scrollPosition,
          selectedRowId: AuthorizationStateManager.getStateModel().selectedRowId
        });

        // synchronize amount range counts
        // synchronizeAuthorizationAmountRangeCounts();
      };

      self.resetAuthorizationListDataModel = function resetAuthorizationListDataModel(payload) {
        authorizationListDataModel = new AuthorizationListDataModel(payload);
        authorizationListDataModel.scrollPosition = AuthorizationStateManager.getStateModel().scrollPosition || 0;
        authorizationListDataModel.selectedRowId = AuthorizationStateManager.getStateModel().selectedRowId;
      };

      self.mapAuthorizationGroupDetails = function mapAuthorizationGroupDetails(authorizationGroupId, authorizationGroupDetails) {
        // update single source of truth: view model
        var target = _.find(viewModel.authorizations, function predicate(authorization) {
          return authorization.authorizationGroupId === authorizationGroupId;
        });
        if (!_.isNil(target)) {
          target.authorizationDetails = authorizationGroupDetails;
        }
      };

      self.mapAuthorizationApprovals = function mapAuthorizationApprovals(authorizationGroupId, authorizationApprovals) {
        // update single source of truth: view model
        var target = _.find(viewModel.authorizations, function predicate(authorization) {
          return authorization.authorizationGroupId === authorizationGroupId;
        });
        if (!_.isNil(target)) {
          authorizationApprovals = extendAuthorizationApprovals(authorizationApprovals);
          target.associatedGroups = authorizationApprovals;
        }
      };

      //
      // Private
      //

      function synchronizeViewModel(payload) {
        var aModel = viewModel.clone();

        if (!_.isNil(payload.authorizations)) {
          aModel.authorizations = payload.authorizations;
        }

        viewModel = aModel;
      }

      function filterAuthorizations(authorizations) {
        var selectedAmountRanges = authorizationAmountRangeDataModel.getSelectedAmountRanges();
        var filteredAuthorizations = [];

        // No filter selected and technicals isn't selected either...
        if (!selectedAmountRanges.length && !authorizationAmountRangeDataModel.technicalsSelected) {
          // ... display complete list
          filteredAuthorizations = authorizations;
        }
        else {
          _.forEach(authorizations, function onAuthorizations(authorization) {
            if (DynamicLookupService.getAuthorizationTypes()._2.code === String(authorization.typeCode)) {
              if (authorizationAmountRangeDataModel.technicalsSelected) {
                filteredAuthorizations.push(authorization);
              }
            }
            else {
              _.forEach(selectedAmountRanges, function onAmountRanges(amountRange) {
                if (amountRange.minimumAmount <= authorization.amount && amountRange.maximumAmount >= authorization.amount) {
                  filteredAuthorizations.push(authorization);
                }
              });
            }
          });
        }
        return filteredAuthorizations;
      }

      function sortAuthorizations(authorizations) {
        var sortedAuthorizations = authorizations;
        var sorting = AuthorizationStateManager.getStateModel().sorting;
        if (sorting.by.length) {
          sortedAuthorizations = $filter('orderBy')(sortedAuthorizations, sorting.by[0], sorting.descending);
        }
        return sortedAuthorizations;
      }

      function selectAuthorizations(authorizations) {
        var selectedAuthorizations = authorizations;
        var selection = AuthorizationStateManager.getSelectedIds();
        _.forEach(selectedAuthorizations, function iteratee(authorization) {
          authorization.selected = selection.indexOf(authorization.id) > -1;
        });

        return selectedAuthorizations;
      }

      function clearAuthorizationSelection(authorizations) {
        var unselectedAuthorizations = authorizations;
        unselectedAuthorizations.forEach(function iteratee(authorization) {
          authorization.selected = false;
        });
        return unselectedAuthorizations;
      }

      function expandAuthorizations(authorizations) {
        var expandedAuthorizations = authorizations;
        var expansion = AuthorizationStateManager.getStateModel().expansion;
        var associatedAuthorizationsExpansion = AuthorizationStateManager.getStateModel().associatedAuthorizationsSectionExpansion;
        _.forEach(expandedAuthorizations, function iteratee(authorization) {
            authorization.expanded = expansion.indexOf(authorization.authorizationGroupId) >= 0;
            authorization.expandedAssociatedAuthorizationsSection = associatedAuthorizationsExpansion.indexOf(authorization.authorizationGroupId) >= 0;
        });

        return expandedAuthorizations;
      }

      function extendAuthorizations(authorizations) {
        var now = Date.now();
        _.forEach(authorizations, function iteratee(authorization) {

          // Map additional attributes
          if (authorization.natureCode) {
            authorization.natureDescription = DynamicLookupService.getNaturesOfAuthorization().getDescriptionByCode(String(authorization.natureCode));
          }
          if (authorization.typeCode) {
            authorization.typeDescription = DynamicLookupService.getRequisitionTypes().getDescriptionByCode(String(authorization.typeCode));
          }
          if (authorization.statusCode) {
            authorization.statusDescription = DynamicLookupService.getAuthorizationStatuses().getDescriptionByCode(String(authorization.statusCode));
          }

          authorization.delay = now - Date.parse(authorization.toAuthorizeSince);

          // Add custom attributes
          authorization.expanded = false;
          authorization.selected = false;
        });
        return authorizations;
      }

      function extendAuthorizationApprovals(authorizationApprovals) {
        _.forEach(authorizationApprovals, function iteratee(authorizationApproval) {
          if (authorizationApproval.authorizationStatus) {
            authorizationApproval.statusDescription = DynamicLookupService.getAuthorizationStatuses().getDescriptionByCode(String(authorizationApproval.authorizationStatus));
          }
          if (authorizationApproval.exceptionSource) {
            authorizationApproval.exceptionSourceDescription = DynamicLookupService.getAuthorizationExceptionSources().getDescriptionByCode(String(authorizationApproval.exceptionSource));
          }
        });
        return authorizationApprovals;
      }

      function synchronizeAuthorizationAmountRangeCounts() {
        var aModel = authorizationAmountRangeDataModel.clone();
        aModel.totalCount = 0;
        aModel.technicalCount = 0;
        aModel.amountRanges.map(function iteratee(amountRange) { amountRange.count = 0; });

        _.forEach(viewModel.authorizations, function onAuthorizations(authorization) {
          if (authorization.typeCode === DynamicLookupService.getAuthorizationStatuses()._2.code) {
            aModel.technicalCount++;
          }
          else {
            _.forEach(aModel.amountRanges, function onRanges(amountRange) {
              if (amountRange.minimumAmount <= authorization.amount && amountRange.maximumAmount > authorization.amount) {
                amountRange.count++;
              }
            });
          }
          aModel.totalCount++;
        });
        authorizationAmountRangeDataModel = aModel;
      }

      return self;
    }
  }
)();
