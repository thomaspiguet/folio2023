(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition')
      .factory('RequisitionEditDispatcher', RequisitionEditDispatcherFactory)
    ;

    /* @ngInject */
    function RequisitionEditDispatcherFactory(
      $log,
      $state,
      AuthorizersManagementActions,
      AuthorizersManagementPopupResolver,
      ActionBarConstants,
      DeliveryLocationEditorPopupResolver,
      DynamicLookupService,
      FormService,
      InteractionModes,
      NotificationHandler,
      PopupService,
      ProductStatisticsPopupResolver,
      RequisitionBusinessLogic,
      RequisitionDisplayLogicManager,
      RequisitionHeaderActions,
      RequisitionHeaderActionsActions,
      RequisitionItemListActions,
      RequisitionItemNavigatorActions,
      RequisitionItemTabsActions,
      RequisitionModelManager,
      RequisitionStateManager,
      RequisitionUncataloguedProductActions,
      UncataloguedProductPopupResolver,
      UserProfileService
    ) {
      var self = this;
      var businessLogic = RequisitionBusinessLogic;
      var displayLogic = RequisitionDisplayLogicManager;
      var modelManager = RequisitionModelManager;
      var stateManager = RequisitionStateManager;
      var userProfileId = UserProfileService.getCurrentProfile().id;

      // **************
      // Global actions
      //

      // (re) initialize this service to its default state
      self.initialize = function initialize(configParams) {
        var config = _.extend({
          id: undefined,
          iid: undefined,
          uncataloguedProductSavedValues: undefined
        }, configParams);

        // Init state manager
        stateManager.initialize({
          mode: _.isNil(config.id) ? InteractionModes.New : InteractionModes.Edit
        });

        // Init model manager
        modelManager.initialize({
          uncataloguedProductSavedValues: config.uncataloguedProductSavedValues
        });

        // Init display logic manager
        displayLogic.initialize({
          //
        });

        // Init business logic manager
        businessLogic.initialize({
          id: config.id,
          iid: config.iid,
          notify: self.notificationHandler
        });
      };

      self.notificationHandler = function notificationHandler(configObj) {
        if (_.isNil(configObj) || _.isNil(configObj.event)) {
          return;
        }
        var urlParams;
        switch (configObj.event) {
          case RequisitionBusinessLogic.Events.REQUISITION_DELETED:
          case RequisitionBusinessLogic.Events.CREATING_REQUISITION: {
            $state.go('^.create');
            break;
          }
          case RequisitionBusinessLogic.Events.REQUISITION_SAVED: {
            $state.go('^.update', {
              id: configObj.params.id,
              uncataloguedProductSavedValues: configObj.params.uncataloguedProductSavedValues
            });
            break;
          }
          case RequisitionBusinessLogic.Events.ON_PRODUCT_SEARCH: {
            $state.go('.product-search', configObj.params);
            break;
          }
        }
      };

      // New requisition event handler
      self.onCreateRequisition = function onCreateRequisition($event) {
        if ($event) {
          $event.preventDefault();
        }
        businessLogic.createRequisition();
      };

      // Indicates current mode (new/edit)
      self.isCreateMode = function isCreateMode() {
        return stateManager.isNewMode();
      };

      // Return the current requisition label
      self.getRequisitionLabel = function getRequisitionLabel() {
        return modelManager.getRequisitionViewModel().requisitionLabel;
      };

      self.getRequisitionItemListModelRecomputeTriggerValue = function getRequisitionItemListModelRecomputeTriggerValue() {
        return businessLogic.getItemModelRecomputeTriggerValue();
      };

      // Return the total amount for the current requisition
      self.getRequisitionTotalAmount = function getRequisitionTotalAmount() {
        return businessLogic.computeRequisitionTotalAmount();
      };

      // Return the current product id
      self.getCurrentProductId = function getCurrentProductId() {
        var res;
        var target = modelManager.getRequisitionItemListModel().selectedRequisitionItem();
        if (!_.isNil(target)) {
          if (!_.isUndefined(target.code) || target.isUncataloguedProduct) {
            res = target.code || null;
          }
        }
        return res;
      };

      //
      // Requisition header actions
      //
      self.getRequisitionHeaderActionsModel = function getRequisitionHeaderActionsModel() {
        return modelManager.getRequisitionHeaderActionsModel();
      };

      self.onRequisitionHeaderActionsAction = function onRequisitionHeaderActionsAction(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (RequisitionHeaderActionsActions.onQuickHeaderEntry === action) {
            businessLogic.quickHeaderEntry(modelManager.getRequisitionHeaderModel().id);
          }
          else if (RequisitionHeaderActionsActions.onToggleRequisitionTemplate === action) {
            businessLogic.toggleRequisitionTemplate();
          }
          else if (RequisitionHeaderActionsActions.onAddAuthorizer === action) {
            //TODO: <<<TEMP>>> here we must/should? compare the global requisition object model with its pristine instance.
            if (FormService.isDirty()) {
              NotificationHandler.warn({ messageOrKey: 'pleaseSave' });
            } else {
              openAuthorizersManagement('add');
            }
          }
          else if (RequisitionHeaderActionsActions.onReplaceAuthorizer === action) {
            //TODO: <<<TEMP>>> here we must/should? compare the global requisition object model with its pristine instance.
            if (FormService.isDirty()) {
              NotificationHandler.warn({ messageOrKey: 'pleaseSave' });
            } else {
              openAuthorizersManagement('replace');
            }
          }
          else {
            $log.warn('Unknown/unsupported action [' + action + ']');
          }
        }
      };

      //
      // Requisition actions bar
      //

      // Action bar action handler (complete, save, cancel, etc...)
      self.onRequisitionActionBarAction = function onRequisitionActionBarAction(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (ActionBarConstants.delete === action) {
            businessLogic.deleteRequisition();
          }
          else if (ActionBarConstants.cancel === action) {
            businessLogic.cancelRequisition();
          }
          else if (ActionBarConstants.save === action) {
            businessLogic.saveRequisition();
          }
          else if (ActionBarConstants.complete === action) {
            businessLogic.completeRequisition();
          }
          else {
            $log.warn('Unknown/unsupported action [' + action + ']');
          }
        }
      };

      // Provides the current action state (saving, completing, deleting, etc...)
      self.getCurrentActionState = function getCurrentActionState() {
        return stateManager.getCurrentActionBarState();
      };

      self.getRequisitionActionBarStateModel = function getRequisitionActionBarStateModel() {
        return displayLogic.getRequisitionActionBarStateModel();
      };

      //
      // Requisition header actions
      //
      self.getRequisitionHeaderActionsStateModel = function getRequisitionHeaderActionsStateModel() {
        return displayLogic.getRequisitionHeaderActionsStateModel();
      };

      //
      // Requisition header
      //
      self.getRequisitionHeaderModel = function getRequisitionHeaderModel() {
        return modelManager.getRequisitionHeaderModel();
      };

      self.getRequisitionHeaderStateModel = function getRequisitionHeaderStateModel() {
        return displayLogic.getRequisitionHeaderStateModel();
      };

      self.onRequisitionHeaderEdit = function onRequisitionHeaderEdit(obj) {
        var model = obj.model;
        if (!_.isNil(model)) {
          businessLogic.synchronizeRequisitionHeader(obj.model);
        }
      };

      self.onRequisitionHeaderAction = function onRequisitionHeaderAction(obj) {
        $log.log(obj);
        var action = obj.action;
        if (!_.isNil(action)) {
          if (RequisitionHeaderActions.toggleDeliveryLocationCreation === action) {
            manageDeliveryLocationCreation(obj.value);
          }
          else {
            $log.error('Unsupported (RequisitionHeader) action [' + action + ']');
          }
        }
      };

      //
      // Requisition progress
      //
      self.getRequisitionProgressModel = function getRequisitionProgressModel() {
        return modelManager.getRequisitionProgressModel();
      };

      //
      // Requisition item list
      //
      self.getRequisitionItemListModel = function getRequisitionItemListModel() {
        return modelManager.getRequisitionItemListModel();
      };

      self.getRequisitionItemListStateModel = function getRequisitionItemListStateModel() {
        return displayLogic.getRequisitionItemListStateModel();
      };

      self.onRequisitionItemListAction = function onRequisitionItemListAction(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (RequisitionItemListActions.onSearchProducts === action) {
            businessLogic.searchProducts(obj.model);
          }
          else if (RequisitionItemListActions.onSelectRequisitionItem === action) {
            businessLogic.selectRequisitionItem(obj.requisitionItemUuid);
          }
          else if (RequisitionItemListActions.onAddRequisitionItem === action) {
            businessLogic.addRequisitionItem();
          }
          else if (RequisitionItemListActions.onAddRequisitionItems === action) {
            businessLogic.addRequisitionItems(obj.model);
          }
          else if (RequisitionItemListActions.onRemoveRequisitionItem === action) {
            businessLogic.removeRequisitionItem(obj.requisitionItemUuid);
          }
          else if (RequisitionItemListActions.onSearchProductInfo === action) {
            businessLogic.searchProductInfo({
              requisitionItemUuid: obj.requisitionItemUuid,
              productCode: obj.productCode
            });
          }
          else if (RequisitionItemListActions.onCreateUncataloguedProduct === action) {
            editUncataloguedProduct(true);
          }
          else if (RequisitionItemListActions.onEditUncataloguedProductItem === action) {
            editUncataloguedProduct(false, obj.uuid);
          }
          else if (RequisitionItemListActions.onItemDueDateChanged === action) {
            businessLogic.onItemDueDateChanged(obj.dueDate, obj.uuid);
          }
          else {
            $log.warn('Unknown/unsupported action [' + action + ']');
          }
        }
      };

      self.onRequisitionItemListEdit = function onRequisitionItemListEdit(obj) {
        businessLogic.synchronizeRequisitionItemList(obj.model);
      };

      //
      // Item navigator
      //
      self.onRequisitionItemNavigatorAction = function onRequisitionItemNavigatorAction(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (RequisitionItemNavigatorActions.onPrevious === action) {
            businessLogic.selectPreviousRequisitionItem(obj.requisitionId);
          }
          else if (RequisitionItemNavigatorActions.onNext === action) {
            businessLogic.selectNextRequisitionItem(obj.requisitionId);
          }
          else {
            $log.warn('Unknown/unsupported action [' + action + ']');
          }
        }
      };

      self.getRequisitionItemNavigatorStateModel = function getRequisitionItemNavigatorStateModel() {
        return displayLogic.getRequisitionItemNavigatorStateModel();
      };

      //
      // Tabs
      //
      self.getRequisitionItemTabsStateModel = function getRequisitionItemTabsStateModel() {
        return displayLogic.getRequisitionItemTabsStateModel();
      };

      self.getRequisitionItemTabsModel = function getRequisitionItemTabsModel() {
        return modelManager.getRequisitionItemTabsModel();
      };

      self.onRequisitionItemTabsAction = function onRequisitionItemTabsAction(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (RequisitionItemTabsActions.onSelectAuthorizationsTab === action) {
            businessLogic.onSelectAuthorizationsTab();
          }
          else if (RequisitionItemTabsActions.onDeselectAuthorizationsTab === action) {
            businessLogic.onDeselectAuthorizationsTab();
          }
          else if (RequisitionItemTabsActions.onViewConsumptionStatisticsForProduct === action) {
            viewProductConsumptionStatistics(obj.requisitionItemUuid);
          }
          else if (RequisitionItemTabsActions.onStoreChanged === action) {
            businessLogic.onItemStoreChanged(obj.storeId, obj.uuid);
          }
          else {
            $log.warn('Unknown/unsupported action [' + action + ']');
          }
        }
      };

      self.onRequisitionItemTabsEdit = function onRequisitionItemTabsEdit(obj) {
        businessLogic.synchronizeRequisitionItemTabs(obj.model);
      };

      self.onAuthorizersManagementAction = function onAuthorizersManagementAction(obj) {
        var action = obj.action;
        if (!_.isNil(action)) {
          if (AuthorizersManagementActions.addAuthorizer === action) {
            businessLogic.addAuthorizer(obj.model);
          }
          else if (AuthorizersManagementActions.replaceAuthorizer === action) {
            businessLogic.replaceAuthorizer(obj.model);
          }
          else {
            $log.error('Unknown action [' + obj.action + ']');
          }
        }
      };

      self.onUncataloguedProductAction = function onUncataloguedProductAction(obj) {
        if (RequisitionUncataloguedProductActions.onAddProduct === obj.action) {
          businessLogic.addUncataloguedProduct(obj.model).then(function () {
            displayLogic.synchronize();
          }).catch(function (error) {
            $log.error(error);
          });
        }
        else if (RequisitionUncataloguedProductActions.onEditProduct === obj.action) {
          businessLogic.editUncataloguedProduct(obj.model).then(function () {
            displayLogic.synchronize();
          }).catch(function (error) {
            $log.error(error);
          });
        }
        else if (RequisitionUncataloguedProductActions.onCancelProductEdition === obj.action ||
          RequisitionUncataloguedProductActions.onClosePrestine === obj.action) {
          businessLogic.cancelUncataloguedProductEdition(obj.model);
        }
        else {
          $log.error('Unknown action [' + obj.action + ']');
        }
      };

      /**
       * Create a non catalogued product
       */
      function editUncataloguedProduct(isNewItem, uuid) {
        PopupService
          .popup({
            templateUrl: 'requisition-uncatalogued-product-popup-container.template.html',
            controllerAs: '$ctrl',
            resolve: {
              presetResolver: function() {
                modelManager.computeRequisitionUncataloguedProductModel(isNewItem, uuid);
                var presetData = {
                  dataModel: modelManager.getRequisitionUncataloguedProductModel(),
                  savedValuesModel: modelManager.getRequisitionViewModel().uncataloguedProductSavedValues,
                  stateModel: displayLogic.getRequisitionUncataloguedProductStateModel(isNewItem),
                  interactionMode: undefined,
                  configuration : {
                    requesterId: modelManager.getRequisitionHeaderModel().requester.id,
                    requisitionTypeCode: modelManager.getRequisitionHeaderModel().type,
                    department: modelManager.getRequisitionHeaderModel().department
                  }
                };

                // Check if item status is modifable
                var isModifiableUncataloguedProduct = isNewItem;
                if (!isNewItem) {
                  var itemStatus = modelManager.getRequisitionItemListModel().selectedRequisitionItem().status;

                  if (itemStatus === '1' ||
                    itemStatus === '2' ||
                    itemStatus === '2A' ||
                    itemStatus === '2B' ||
                    itemStatus === '2C' ||
                    itemStatus === '2F' ||
                    itemStatus === '2X' ||
                    itemStatus === '2R') {
                    isModifiableUncataloguedProduct = true;
                  }
                }

                // Compute interactionMode
                if (InteractionModes.ReadOnly === stateManager.getMode() || !isModifiableUncataloguedProduct) {
                  presetData.interactionMode = InteractionModes.ReadOnly;
                } else if (isNewItem) {
                  presetData.interactionMode = InteractionModes.New;
                } else {
                  presetData.interactionMode = InteractionModes.Edit;
                }

                return presetData;
              }
            },
            bindToController: true,
            controller: /* @ngInject */function EditUncataloguedProductController($log, $scope, $uibModalInstance, presetResolver) {

              var ctrl = this;

              // Initialize models
              ctrl.dataModel = presetResolver.dataModel;
              ctrl.savedValuesModel = presetResolver.savedValuesModel;
              ctrl.stateModel = presetResolver.stateModel;
              ctrl.configuration = presetResolver.configuration;
              ctrl.interactionMode = presetResolver.interactionMode;

              ctrl.actionHandler = function actionHandler(obj) {
                if (RequisitionUncataloguedProductActions.onAddProduct === obj.action) {
                  businessLogic.addUncataloguedProduct(obj.model)
                  .then(
                    function success(response) {
                      // Kind of reset the uncatalogued product current facet
                      modelManager.computeRequisitionUncataloguedProductModel(true);
                      displayLogic.synchronize();

                      ctrl.dataModel = modelManager.getRequisitionUncataloguedProductModel();
                      ctrl.stateModel = displayLogic.getRequisitionUncataloguedProductStateModel(true);
                      ctrl.interactionMode = InteractionModes.New;
                    },
                    function failure(reason) {
                      $log.log(reason);
                    }
                  );
                }
                else if (RequisitionUncataloguedProductActions.onSaveCurrentValues === obj.action) {
                  modelManager.synchronizeRequisitionViewModel({
                    requisitionId: modelManager.getRequisitionHeaderModel().id,
                    uncataloguedProductSavedValues: obj.model
                  });
                }
                else if (RequisitionUncataloguedProductActions.onAddProductAndClose === obj.action) {
                  businessLogic.addUncataloguedProduct(obj.model)
                  .then(
                    function success(response) {
                      $log.log(response);
                      displayLogic.synchronize();
                      $uibModalInstance.close(obj.action);
                    },
                    function failure(reason) {
                      $log.log(reason);
                    }
                  );
                }
                else if (RequisitionUncataloguedProductActions.onEditProduct === obj.action) {
                  businessLogic.editUncataloguedProduct(obj.model)
                  .then(
                    function success(response) {
                      $log.log(response);
                      displayLogic.synchronize();
                      $uibModalInstance.close(obj.action);
                    },
                    function failure(reason) {
                      $log.log(reason);
                    }
                  );
                }
                else if (RequisitionUncataloguedProductActions.onCancelProductEdition === obj.action ||
                  RequisitionUncataloguedProductActions.onClosePrestine === obj.action) {
                  businessLogic.cancelUncataloguedProductEdition(obj.model);
                  // TODO: Check whether to put a promise or not...
                  $uibModalInstance.dismiss(obj.action);
                }
                else if (RequisitionUncataloguedProductActions.fetchDefaultValues === obj.action) {
                  return businessLogic.fetchUncataloguedProductDefaultValues(obj.model,
                      obj.params);
                }
                else if (RequisitionUncataloguedProductActions.fetchDefaultBuyer === obj.action) {
                  return businessLogic.fetchUncataloguedProductDefaultValues(obj.model,
                      obj.params,
                      true);
                }
                else {
                  $log.error('Unknown action [' + obj.action + ']');
                }
              };
            }
          })
          // TODO: for demonstration purposes - not really needed at the moment
          .result
          .then(
            function success(response) {
              $log.log(response);
            },
            function failure(reason) {
              $log.log(reason);
            }
          )
        ;
      }

      function viewProductConsumptionStatistics(uuid) {
        PopupService
          .popup({
            size: 'xl',
            component: 'genericPopup',
            resolve: ProductStatisticsPopupResolver.computeAndGet(uuid)
          });
      }

      //action = 'add' or 'replace'
      function openAuthorizersManagement(action) {
        PopupService
          .popup({
            component: 'genericPopup',
            resolve: AuthorizersManagementPopupResolver.computeAndGet(action)
          })
          .result
          .then(
            function success(response) {
              if (!_.isUndefined(response.action)) {
                self.onAuthorizersManagementAction(response);
              }
            },
            function failure(reason) {
              $log.log(reason);
            }
          );
      }

      function manageDeliveryLocationCreation(initialValue) {
        PopupService
          .popup({
            component: 'genericPopup',
            resolve: DeliveryLocationEditorPopupResolver.computeAndGet(initialValue)
          });
      }

      return self;
    }
  }
)();
