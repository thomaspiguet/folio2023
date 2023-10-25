;(
  function() {
    'use strict';

    angular
      .module('app.business-logic.authorization')
      .factory('AuthorizationBusinessLogic', AuthorizationBusinessLogicFactory)
    ;

    /* @ngInject */
    function AuthorizationBusinessLogicFactory(
      $log,
      $q,
      ApplicationParameters,
      AuthorizationApiService,
      AuthorizationDisplayLogicManager,
      AuthorizationModelManager,
      AuthorizationStateManager,
      DynamicLookupService,
      NotificationHandler,
      UserProfileService,
      uuid4
    ) {
      var self = this;
      var displayLogic = AuthorizationDisplayLogicManager;
      var modelManager = AuthorizationModelManager;
      var stateManager = AuthorizationStateManager;

      // Action that may be reported by this business logic handler
      Object.defineProperty(this, 'Events', {
        value: {
          AUTHORIZED: 'AUTHORIZED',
          DECLINED: 'DECLINED'
        }
      });

      /**
       * Initialize this business logic manager.
       */
      self.initialize = function initialize() {

        // Delegate to own function since this is a commandable treatment
        setupAmountRangeFilterGroups();

        // Initialize search criteria, using preserved state if any
        modelManager.synchronizeAuthorizationSearchCriteriaDataModel(stateManager.getStateModel().searchCriteria);

        // Then fetch authorizations - this will build the list model
        self.fetchAuthorizationRequisitionGroups();
      };

      self.authorizeSelectedAuthorizations = function authorizeSelectedAuthorizations() {
        $log.log('business::authorizing...');

        var deferred = $q.defer();
        var ids = stateManager.getSelectedIds(); // modelManager.getAuthorizationSelectedIds();

        var config = {
          routeParams: {
            groupIds: ids
          },
          requestConfig: {
            blockUI: true,
            showSpinner: false
          }
        };

        // Authorizes groups
        AuthorizationApiService
          .authorizeGroups(config)
          .then(
            function success(response) {
              // Here, we resolve the promise right away to turn down spinning button.
              // Since at this point, autorization process is successfull, the remaining
              // will still execute while blocking the application anyway...
              deferred.resolve();

              stateManager.clearSelectionState();
              stateManager.clearExpansionState();
              // stateManager.clearFilteringState();
              // modelManager.clearAmountRangeFilterSelection();

              // Refetch remaining authorization groups...
              return searchAuthorizations();
            },
            function failure(reason) {
              if (reason.data) {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
              deferred.reject(reason);
            }
          )
        ;

        return deferred.promise;
      };

      self.refuseSelectedAuthorizations = function refuseSelectedAuthorizations(note) {
        $log.log('business::refusing...');

        var deferred = $q.defer();
        var ids = stateManager.getSelectedIds(); // modelManager.getAuthorizationSelectedIds();

        var config = {
          routeParams: {
            groupIds: ids
          },
          data: {
            note: note
          },
          requestConfig: {
            blockUI: true,
            showSpinner: false
          }
        };

        // Refuse groups
        AuthorizationApiService
          .refuseGroups(config)
          .then(
            function success(response) {
              // Here, we resolve the promise right away to turn down spinning button.
              // Since at this point, autorization process is successfull, the remaining
              // will still execute while blocking the application anyway...
              deferred.resolve();

              stateManager.clearSelectionState();
              stateManager.clearExpansionState();
              // stateManager.clearFilteringState();
              // modelManager.clearAmountRangeFilterSelection();

              // Refetch remaining authorization groups...
              searchAuthorizations();
            },
            function failure(reason) {
              if (reason.data) {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
              deferred.reject(reason);
            }
          )
        ;

        return deferred.promise;
      };

      //
      // Amount range filter groups
      //

      /**
       * Search event handler
       *
       * @param {object} payload - a search configuration object containing search parameters (sorting info, criteria)
       */
      self.onFilterAuthorizationRequisitionGroups = function onFilterAuthorizationRequisitionGroups(payload) {
        stateManager.updateFilteringState(payload);
        modelManager.synchronizeAuthorizationAmountRangeDataModel(payload);
        modelManager.computeAuthorizationListDataModel(payload);
      };

      //
      // Search criteria
      //

      self.synchronizeSearchCriteria = function synchronizeSearchCriteria(payload) {
        stateManager.updateSearchCriteriaState(payload);
        modelManager.synchronizeAuthorizationSearchCriteriaDataModel(payload.searchCriteria);
        displayLogic.synchronize();
      };

      self.onSearchAuthorizationRequisitionGroups = function onSearchAuthorizationRequisitionGroups() {

        stateManager.clearSelectionState();
        stateManager.clearExpansionState();
        stateManager.clearFilteringState();
        modelManager.clearAmountRangeFilterSelection();
        stateManager.setSearchCriteriaAppliedState(true);
        modelManager.getAuthorizationListDataModel().searchCriteriaApplied = true;
        searchAuthorizations()
          .then(
            function success() {
              // stateManager.setSearchCriteriaAppliedState(true);
              // modelManager.getAuthorizationListDataModel().searchCriteriaApplied = true;
              displayLogic.toggleRightPanel();
            },
            function failure(reason) {
              if (reason.data) {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
            }
          )
        ;
      };

      self.onClearSearchCriteria = function onClearSearchCriteria() {

        modelManager.resetAuthorizationSearchCriteriaDataModel();
        stateManager.clearSelectionState();
        stateManager.clearExpansionState();
        stateManager.clearFilteringState();
        modelManager.clearAmountRangeFilterSelection();
        stateManager.setSearchCriteriaAppliedState(false);
        modelManager.getAuthorizationListDataModel().searchCriteriaApplied = false;
        searchAuthorizations()
          .then(
            function success() {
              // stateManager.setSearchCriteriaAppliedState(false);
              // modelManager.getAuthorizationListDataModel().searchCriteriaApplied = false;
            },
            function failure(reason) {
              if (reason.data) {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
            }
          )
        ;
      };

      //
      // Authorization groups
      //

      /**
       * Fetch the complete list of authorization requisition groups for the current requester
       */
      self.fetchAuthorizationRequisitionGroups = function fetchAuthorizationRequisitionGroups(payload) {
        return searchAuthorizations();
      };

      self.onAuthorizationSelection = function onAuthorizationSelection(payload) {
        stateManager.updateSelectionState(payload);
        modelManager.computeAuthorizationListDataModel(payload);
      };

      self.expandOneAuthorization = function expandOneAuthorization(payload) {
        var promise = $q.when;
        var config = [];
        if (!_.isNil(payload.expandedId)) {
          var viewModel = modelManager.getViewModel();
          var target = _.find(viewModel.authorizations, function iteratee(authorization) {
            return authorization.authorizationGroupId === payload.expandedId;
          });
          if (target) {
            config = target.authorizationDetails;
            if (_.isNil(target.authorizationDetails) || !target.authorizationDetails.length) {
              promise = AuthorizationApiService.getRequisitionGroupDetails;
              config = {
                routeParams: {
                  authorizationGroupId: target.authorizationGroupId
                },
                requestConfig: {
                  blockUI: true,
                  showSpinner: true
                }
              };
            }
          }
        }

        promise(config)
          .then(
            function success(response) {
              if (response.length) {
                modelManager.mapAuthorizationGroupDetails(payload.expandedId, response);
              }
              stateManager.updateRequisitionedProductsExpansionState(payload);
              modelManager.computeAuthorizationListDataModel(payload);
            },
            function failure(reason) {
            }
          )
        ;
      };

      self.expandOneAssociatedAuthorizationSection = function expandOneAssociatedAuthorizationSection(payload) {
        var promise = $q.when;
        var config = [];
        if (!_.isNil(payload.expandedId)) {
          var viewModel = modelManager.getViewModel();
          var target = _.find(viewModel.authorizations, function iteratee(authorization) {
            return authorization.authorizationGroupId === payload.expandedId;
          });
          if (target) {
            config = target.associatedGroups;
            if (_.isNil(target.associatedGroups) || !target.associatedGroups.length) {
              promise = AuthorizationApiService.getRequisitionGroupAuthorizerApprovals;
              config = {
                routeParams: {
                  authorizationGroupId: target.authorizationGroupId
                },
                requestConfig: {
                  blockUI: true,
                  showSpinner: true
                }
              };
            }
          }
        }

        promise(config)
          .then(
            function success(response) {
              if (response.length) {
                modelManager.mapAuthorizationApprovals(payload.expandedId, response);
              }
              stateManager.updateRelatedAuthorizationsExpansionState(payload);
              modelManager.computeAuthorizationListDataModel(payload);
            },
            function failure(reason) {
            }
          )
        ;
      };

      /**
       * Sort event handler
       *
       * @param {object} payload - a search configuration object containing search parameters (sorting info, criteria)
       */
      self.onSortAuthorizationRequisitionGroups = function onSortAuthorizationRequisitionGroups(payload) {
        stateManager.updateSortingState(payload);
        modelManager.computeAuthorizationListDataModel(payload);
      };

      self.onScrollAuthorizationList = function onScrollAuthorizationList(payload) {
        stateManager.updateScrollPosition(payload);
      };

      self.onRowSelection = function onRowSelection(payload) {
        stateManager.updateRowSelection(payload);
      };

      //
      // Private
      //

      /**
       * A private generic search function which should serve all search case variants
       */
      function searchAuthorizations() {
        var searchCriteria = modelManager.getAuthorizationSearchCriteriaDataModel().getSearchableCriteria();
        var config = {
          routeParams: {
            requesterId: UserProfileService.getCurrentProfile().id
          },
          criteria: {
            requisitionId: searchCriteria.requisitionId,
            requisitionRequesterId: searchCriteria.requisitionRequesterId,
            requiredOnFrom: searchCriteria.requiredOnFrom,
            requiredOnTo: searchCriteria.requiredOnTo,
            daysInAutorization: searchCriteria.toAuthorizeSince,
            permission: searchCriteria.permission
          },
          requestConfig: {
            blockUI: true,
            showSpinner: true
          }
        };
        var deferred = $q.defer();
        AuthorizationApiService
          .getAuthorizationRequisitionGroups(config)
          .then(
            function success(response) {
              if (stateManager.getSearchCriteriaAppliedState()) {
                toggleAmountRangeSelection(response);
              }
              modelManager.synchronize(response);
              displayLogic.synchronize();

              deferred.resolve();
            },
            function failure(reason) {
              // if (reason.data) {
              //   NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              // }
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }

      function toggleAmountRangeSelection(payload) {
        // var amountRanges = _.arrayCopy(ApplicationParameters.getApplicationParameters().requisitionParameters.authorizationAmountRanges);
        var amountRanges = _.arrayCopy(
          _.filter(ApplicationParameters.getApplicationParameters().requisitionParameters.authorizationAmountRanges, function predicate(aar) {
            return false === aar.isTechnicalGroup;
          })
        );
        var technicalsSelected = false;

        _.forEach(payload.authorizations, function onAuthorizations(authorization) {
          if (authorization.typeCode === DynamicLookupService.getAuthorizationStatuses()._2.code) {
            technicalsSelected = true;
          }
          else {
            _.forEach(amountRanges, function onAmountRanges(amountRange) {
              if (amountRange.minimumAmount <= authorization.amount && amountRange.maximumAmount > authorization.amount) {
                amountRange.selected = true;
              }
            });
          }
        });

        var params = {
          modelId: uuid4.generate(), // ouf...
          amountRanges: amountRanges,
          technicalsSelected: technicalsSelected
        };

        stateManager.updateFilteringState(params);
        modelManager.synchronizeAuthorizationAmountRangeDataModel(params);
      }

      function setupAmountRangeFilterGroups() {
        // See if there are amount ranges preserved in state...
        var amountRanges = stateManager.getStateModel().amountRanges;

        if (_.isNil(amountRanges) || !amountRanges.length) {
          // ... if not, get 'em from the application parameters
          amountRanges = _.arrayCopy(ApplicationParameters.getApplicationParameters().requisitionParameters.authorizationAmountRanges);
          stateManager.updateFilteringState({
            amountRanges: amountRanges
          });
        }

        // Build amount range filters data model
        modelManager.synchronizeAuthorizationAmountRangeDataModel({
          amountRanges: _.arrayCopy(amountRanges)
        });

        // Apply preserved state, if any
        _.forEach(stateManager.getStateModel().amountRanges, function onState(stateAmountRange) {
          _.forEach(modelManager.getAuthorizationAmountRangeDataModel().amountRanges, function onModel(modelAmountRange) {
            if (stateAmountRange.id === modelAmountRange.id) {
              modelAmountRange.selected = stateAmountRange.selected;
            }
          });
        });
        modelManager.getAuthorizationAmountRangeDataModel().technicalsSelected = stateManager.getStateModel().technicalsSelected;
      }

      return self;
    }
  }
)();
