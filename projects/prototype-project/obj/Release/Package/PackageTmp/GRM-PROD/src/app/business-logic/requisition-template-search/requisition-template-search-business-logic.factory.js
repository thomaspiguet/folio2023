(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-template-search')
      .factory('RequisitionTemplateSearchBusinessLogic', RequisitionTemplateSearchBusinessLogicFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateSearchBusinessLogicFactory(
      $log,
      ActionBarConstants,
      NotificationService,
      RequisitionTemplateApiService,
      RequisitionTemplateSearchDisplayLogicManager,
      RequisitionTemplateSearchModelManager,
      RequisitionTemplateSearchStateManager
    ) {
      var self = this;

      var displayLogic = RequisitionTemplateSearchDisplayLogicManager;
      var modelManager = RequisitionTemplateSearchModelManager;
      var stateManager = RequisitionTemplateSearchStateManager;
      var actions = ActionBarConstants;

      Object.defineProperty(this, 'Events', {
        value: {
          CRITERIAS_CLEARED: 'CRITERIAS_CLEARED',
        }
      });

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          id: undefined,
          notificationCallback: function noop() { /*Do nothing*/ } // TODO : use this where appropriate
        }, configParams);

        self.notificationCallback = config.notify;
      };

      self.onSearchModeChange = function onSearchModeChange(mode) {
        // modelManager.initialize();
        modelManager.changeSearchMode(mode);
        modelManager.resetHeaderListDataModel();
        modelManager.resetProductListDataModel();
        displayLogic.synchronize();
        updateState();
      };

      self.synchronizeSearchCriteria = function synchronizeSearchCriteria(model) {
        modelManager.synchronizeCriteriaModel(model);
        displayLogic.synchronize();
        updateState();
      };

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

      function search(searchConfig) {
        displayLogic.setSearchingState(true);
        if (true === searchConfig.clearResults) {
          modelManager.clearResults();
          displayLogic.synchronize();
        }

        var api = RequisitionTemplateApiService;
        var criteriaModel = modelManager.getCriteriaDataModel();
        var viewModel = modelManager.getRequisitionTemplateSearchViewModel();
        var mode = criteriaModel.searchModes.header === criteriaModel.searchMode ? api.SEARCH_RESULTS_AS_HEADERS : api.SEARCH_RESULTS_AS_PRODUCTS;

        var cfg = {
          criteria: _.extend({}, {
            templateId: criteriaModel.templateId,
            templateDescription: criteriaModel.templateDescription,
            siteId: criteriaModel.site ? criteriaModel.site.id : undefined,
            departmentId: criteriaModel.department ? criteriaModel.department.id : undefined,
            addressId: criteriaModel.address ? criteriaModel.address.id : undefined,
            requesterId: criteriaModel.requester ? criteriaModel.requester.id : undefined,
            clientId: criteriaModel.client ? criteriaModel.client.id : undefined,
            isActive: criteriaModel.activeIndicators.all === criteriaModel.isActive ? undefined : criteriaModel.activeIndicators.active === criteriaModel.isActive ? true : false,
            isAutomaticGeneration: criteriaModel.automaticGenerationValues.all === criteriaModel.isAutomaticGeneration ? undefined : criteriaModel.automaticGenerationValues.yes === criteriaModel.isAutomaticGeneration ? true : false,
            productCode: criteriaModel.productCode,
            productDescription: criteriaModel.productDescription,
            productStoreId: criteriaModel.productStore ? criteriaModel.productStore.id : undefined,
            isProductInvalid: criteriaModel.invalidProductValues.all === criteriaModel.isProductInvalid ? undefined : criteriaModel.invalidProductValues.yes === criteriaModel.isProductInvalid ? true : false
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
            modelManager.getRequisitionTemplateSearchViewModel()
          ),
          _.isFunction
        );

        stateManager.updateState(stateObj);
      }

      return self;
    }
  }
)();
