(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-search')
      .factory('RequisitionSearchBusinessLogic', RequisitionSearchBusinessLogicFactory)
    ;

    /* @ngInject */
    function RequisitionSearchBusinessLogicFactory(
      $log,
      $q,
      ApplicationActions,
      NotificationService,
      ActionBarConstants,
      RequisitionApiService,
      RequisitionSearchDisplayLogicManager,
      RequisitionSearchModelManager,
      RequisitionSearchStateManager
    ) {
      var self = this;

      var displayLogic = RequisitionSearchDisplayLogicManager;
      var modelManager = RequisitionSearchModelManager;
      var stateManager = RequisitionSearchStateManager;
      var actions = ActionBarConstants;

      Object.defineProperty(this, 'Events', {
        value: {
          CRITERIAS_CLEARED: 'CRITERIAS_CLEARED',
        }
      });

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          notificationCallback: function noop() { /*Do nothing*/ } // TODO : use this where appropriate
        }, configParams);

        self.notificationCallback = config.notify;
      };

      self.onSearchModeChange = function onSearchModeChange(mode) {
        // modelManager.initialize();
        modelManager.changeSearchMode(mode);
        modelManager.resetHeaderListDataModel();
        modelManager.resetHeaderDetailDataModel();
        modelManager.resetProductListDataModel();
        modelManager.resetProductDetailDataModel();
        displayLogic.synchronize();
        updateState();
      };

      self.synchronizeSearchCriteria = function synchronizeSearchCriteria(model) {
        modelManager.synchronizeCriteriaModel(model);
        displayLogic.synchronize();
        updateState();
      };

      function search(searchConfig) {
        displayLogic.setSearchingState(true);
        if (true === searchConfig.clearResults) {
          modelManager.clearResults();
          displayLogic.synchronize();
        }

        var api = RequisitionApiService;
        var criteriaModel = modelManager.getCriteriaDataModel();
        var viewModel = modelManager.getRequisitionSearchViewModel();
        var mode = criteriaModel.searchModes.header === criteriaModel.searchMode ? api.SEARCH_RESULTS_AS_HEADERS : api.SEARCH_RESULTS_AS_PRODUCTS;

        var cfg = {
          criteria: _.extend({}, {
            departmentId: !_.isNil(criteriaModel.department) ? criteriaModel.department.id : undefined,
            statuses: criteriaModel.statuses,
            includeCancelledRequisitions : criteriaModel.includeCancelledRequisitions,
            requesterId: !_.isNil(criteriaModel.requester) ? criteriaModel.requester.id : undefined,
            requisitionId: criteriaModel.requisitionId,
            siteId: !_.isNil(criteriaModel.site) ? criteriaModel.site.id : undefined,
            deliveryLocationId : !_.isNil(criteriaModel.deliveryLocation) ? criteriaModel.deliveryLocation.id : undefined,
            installationLocationId : !_.isNil(criteriaModel.installationLocation) ? criteriaModel.installationLocation.id : undefined,
            createdOnFrom : criteriaModel.createdOnFrom,
            createdOnTo : criteriaModel.createdOnTo,
            requisitionTypes : criteriaModel.requisitionTypes,
            clientId: !_.isNil(criteriaModel.client) ? criteriaModel.client.id : undefined,
            productCode: criteriaModel.productCode,
            productDescription: criteriaModel.productDescription,
            storeId: !_.isNil(criteriaModel.store) ? criteriaModel.store.id : undefined,
            orderId: criteriaModel.orderId,
            itemStatuses: criteriaModel.itemStatuses
          }),
          paging: viewModel.paging,
          sorting: viewModel.sorting,
          config: {
            blockUI: true,
            showSpinner: true
          }
        };

        api
          .search(cfg, mode)
          .then(
            function success(response) {
              if (api.SEARCH_RESULTS_AS_HEADERS === mode) {
                modelManager.synchronizeHeaderListDataModel(response.data);
              }
              else {
                modelManager.synchronizeProductListDataModel(response.data);
              }
              modelManager.synchronizeViewModel(response.data);
              modelManager.setPristineCriteriaDataModel();
              displayLogic.synchronize();
              updateState();

              // Display notification whenever search returns no results...
              if (response.data.items.length === 0) {
                NotificationService.warn({ messageOrKey: 'searchResultsEmpty', translate: true });
              }
            },
            function failure(reason) {
              if (reason.status === 413) { // Request Entity Too Large
                NotificationService.error({ messageOrKey: 'needMoreCriteria', translate: true });
              }
              else {
                NotificationService.error({ messageOrKey: reason.description, translate: false });
              }
            }
          )
          .finally(function onFinally() {
            displayLogic.setSearchingState(false);
          })
        ;
      }

      self.onSearch = function onSearch(searchConfig) {
        modelManager.synchronizeViewModelPaging(searchConfig);
        search(searchConfig);
      };

      self.onListSort = function onListSort(searchConfig) {
        modelManager.synchronizeViewModelSorting(searchConfig);
        search(searchConfig);
      };

      self.onListPage = function onListPage(searchConfig) {
        modelManager.synchronizeViewModelPaging(searchConfig);
        search(searchConfig);
      };

      self.onClearSearchCriteria = function onClearSearchCriteria() {
        //  Exclude the "Header / Product" display buttons from resetting search criteria
        //  because they are not part of the criteria, but rather how we want to see the results displayed.
        var actualSearchMode = modelManager.getCriteriaDataModel().searchMode;
        modelManager.resetCriteriaDataModel();
        var resetedModel = modelManager.getCriteriaDataModel();
        resetedModel.searchMode = actualSearchMode;
        self.synchronizeSearchCriteria(resetedModel);
        self.notificationCallback({
          event: self.Events.CRITERIAS_CLEARED
        });
      };

      self.updateHeaderDetailSection = function updateHeaderDetailSection(requisitionId) {
        var deffered = $q.defer();

        if (displayLogic.getHeaderListStateModel().detail.hidden || _.isNil(requisitionId))
        {
          modelManager.resetHeaderDetailDataModel();
          displayLogic.synchronize();
          deffered.resolve();
        }
        else
        {
          var api = RequisitionApiService;
          api
            .read(requisitionId)
            .then(
              function success(response) {
                modelManager.synchronizeHeaderDetailDataModel(response);
              },
              function failure(reason) {
                modelManager.resetHeaderDetailDataModel();
                $log.log(reason.description);
                //NotificationService.error({ messageOrKey: reason.description, translate: false });
              }
            )
            .finally(function onFinally() {
              displayLogic.synchronize();
              deffered.resolve();
            })
          ;
        }

        return deffered.promise;
      };

      self.updateProductDetailSection = function updateProductDetailSection(requisitionId, requisitionItemId) {
        var deffered = $q.defer();

        if (displayLogic.getProductListStateModel().detail.hidden || _.isNil(requisitionId) || _.isNil(requisitionItemId))
        {
          modelManager.resetProductDetailDataModel();
          displayLogic.synchronize();
          deffered.resolve();
        }
        else
        {
          // Read requisition first
          var api = RequisitionApiService;
          api
            .read(requisitionId)
            .then(
              function success(response) {
                var requisition = response;
                api
                  .readItem(requisitionItemId)
                  .then(
                    function success(response) {
                      modelManager.synchronizeProductDetailDataModel({ requisition: requisition, requisitionItem: response });
                    },
                    function failure(reason) {
                      modelManager.resetProductDetailDataModel();
                      $log.log(reason.description);
                      //NotificationService.error({ messageOrKey: reason.description, translate: false });
                    }
                  )
                  .finally(function onFinally() {
                    displayLogic.synchronize();
                  })
                ;
              },
              function failure(reason) {
                modelManager.resetProductDetailDataModel();
                $log.log(reason.description);
                //NotificationService.error({ messageOrKey: reason.description, translate: false });
              }
            )
            .finally(function onFinally() {
              displayLogic.synchronize();
              deffered.resolve();
            })
          ;
        }

        return deffered.promise;
      };

      /**
       * updateState - Wraps the update of the state in a centralized fashion
       */
      function updateState() {
        // Combine all involved model objects into one main object, omitting functions
        var stateObj = _.omitBy(
          _.merge({},
            modelManager.getCriteriaDataModel(),
            modelManager.getHeaderListDataModel(),
            modelManager.getProductListDataModel(),
            modelManager.getRequisitionSearchViewModel()
          ),
          _.isFunction
        );

        stateManager.updateState(stateObj);
      }

      return self;
    }
  }
)();
