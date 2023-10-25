(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition')
      .factory('RequisitionBusinessLogic', RequisitionBusinessLogicFactory)
    ;

    /* @ngInject */
    function RequisitionBusinessLogicFactory(
        $log,
        $q,
        ActionBarConstants,
        ApplicationActions,
        AuthorizationApiService,
        DeliveryLocationApiService,
        FormService,
        NotificationHandler,
        ProductInfoApi,
        ProductParamModel,
        RequisitionApiService,
        RequisitionDisplayLogicManager,
        RequisitionModelManager,
        RequisitionStateManager,
        RequisitionTemplateProductApi,
        UrlHelper,
        UserProfileService,
        uuid4
    ) {
      var self = this;

      // A few shortcuts
      var displayLogic = RequisitionDisplayLogicManager;
      var modelManager = RequisitionModelManager;
      var stateManager = RequisitionStateManager;
      var itemModelRecomputeTriggerValue = null;

      // TODO move to state management?
      var authorizationsTabSelected = false;

      // Action that may be reported by this business logic handler
      Object.defineProperty(this, 'Events', {
        value: {
          SAVING_REQUISITION: 'SAVING_REQUISITION',
          REQUISITION_SAVED: 'REQUISITION_SAVED',
          CREATING_REQUISITION: 'CREATING_REQUISITION',
          REQUISITION_CREATED: 'REQUISITION_CREATED',
          DELETING_REQUISITION: 'DELETING_REQUISITION',
          REQUISITION_DELETED: 'REQUISITION_DELETED',
          LOADING_STARTED: 'LOADING_STARTED',
          LOADING_FINISHED: 'LOADING_FINISHED',
          ON_PRODUCT_SEARCH: 'ON_PRODUCT_SEARCH'
        }
      });

      /**
       * Initialize this business logic handler
       *
       * @param {object} configParams - an object with the following properties:
       * - id: the id of an existing requisition object to be loaded
       * - notify: a callback function used to "broadcast" events occurring in this service
       */
      self.initialize = function initialize(configParams) {
        var config = _.extend({
          id: undefined,
          iid: undefined,
          notify: function noop() { /*Do nothing*/ } // TODO : use this where appropriate
        }, configParams);

        // TODO improve - sync with promises?
        if (!_.isNil(config.id)) {
          self.fetchRequisition({
            requisitionId: config.id,
            itemId: config.iid
          });
        }
        else {
          displayLogic.synchronize();
        }

        // assign notification callback
        self.notify = config.notify;
      };

      /**
       * Select the previous requisition item from navigation component
       */
      self.selectPreviousRequisitionItem = function selectPreviousRequisitionItem() {
        var targetItem = modelManager.selectPreviousItem();

        if (!_.isNil(targetItem)) {
          if (false === authorizationsTabSelected) {
            modelManager.synchronizeRequisitionItemTabsModel({
              uuid: targetItem.uuid
            });
            displayLogic.synchronize();
          } else {
            var params = [];
            var promise = $q.when;
            var targetAggregate = modelManager.getRequisitionItemAggregate(targetItem.uuid);

            if (!_.isNil(targetAggregate) && targetAggregate.id !== 0) {
              promise = fetchAuthorizations;
              params = targetAggregate.id;
            }

            var authorizations;
            promise(params)
              .then(
                function success(response) {
                  authorizations = response;
                },
                function failure(reason) {
                  NotificationHandler.error({ messageOrKey: reason.description, translate: false });
                }
              )
              .finally(function onFinally() {
                modelManager.synchronizeRequisitionItemTabsModel({
                  uuid: targetItem.uuid,
                  authorizations: authorizations
                });
                displayLogic.synchronize();
              })
            ;
          }
        }
      };

      /**
       * Select the next requisition item from navigation component
       */
      self.selectNextRequisitionItem = function selectNextRequisitionItem() {
        var targetItem = modelManager.selectNextItem();

        if (!_.isNil(targetItem)) {
          if (false === authorizationsTabSelected) {
            modelManager.synchronizeRequisitionItemTabsModel({
              uuid: targetItem.uuid
            });
            displayLogic.synchronize();
          } else {
            var params = [];
            var promise = $q.when;
            var targetAggregate = modelManager.getRequisitionItemAggregate(targetItem.uuid);

            if (!_.isNil(targetAggregate) && targetAggregate.id !== 0) {
              promise = fetchAuthorizations;
              params = targetAggregate.id;
            }

            var authorizations;
            promise(params)
              .then(
                function success(response) {
                  authorizations = response;
                },
                function failure(reason) {
                  NotificationHandler.error({ messageOrKey: reason.description, translate: false });
                }
              )
              .finally(function onFinally() {
                modelManager.synchronizeRequisitionItemTabsModel({
                  uuid: targetItem.uuid,
                  authorizations: authorizations
                });
                displayLogic.synchronize();
              })
            ;
          }
        }
      };

      /**
       * Compute the current requisition total amount, for the current requisition
       *
       * @returns {number} - The requisition total amount
       */
      self.computeRequisitionTotalAmount = function computeRequisitionTotalAmount() {
        var total = 0;
        var requisitionItems = modelManager.getRequisitionItemListModel().requisitionItems || [];
        _.forEach(requisitionItems, function onRequisitionItem(requisitionItem) {
          total += requisitionItem.computeSubTotal();
        });
        return total;
      };

      /**
       * Quick header action handler
       */
      self.quickHeaderEntry = function quickHeaderEntry() {
        var cfgObj = {
          department: UserProfileService.getCurrentProfile().department,
          deliveryLocation: UserProfileService.getCurrentProfile().deliveryLocation,
          requester: {
            id: UserProfileService.getCurrentProfile().id,
            code: UserProfileService.getCurrentProfile().number,
            description: UserProfileService.getCurrentProfile().name,
            phoneExtension: UserProfileService.getCurrentProfile().phoneExtension
          },
          splitOnUniqueOrder: UserProfileService.getCurrentProfile().settings.requisitionSpecific.isUniqueRequisitionPerOrder
        };

        // Take preset site and address from department if any...
        if (!_.isNil(cfgObj.department)) {
          cfgObj.site = cfgObj.department.site;
          cfgObj.address = cfgObj.department.address;
        }

        modelManager.presetRequisitionHeaderModel(cfgObj);
        FormService.setDirty();
        displayLogic.synchronize();
      };

      /**
       * Requisition template selector toggle action handler
       */
      self.toggleRequisitionTemplate = function toggleRequisitionTemplate() {
        displayLogic.toggleRequisitionTemplate();
      };

      /**
       * Fetch the requisition instance for given requisition identifier
       *
       * @param {object} obj - An object exposition :
       *  - requisitionId: the requisition identifier used to fetch a requisition instance
       *  - productId: a product identifier used to preselect a product from the fetched requisition instance
       */
      self.fetchRequisition = function fetchRequisition(obj) {
        if (_.isNil(obj) || _.isNil(obj.requisitionId)) {
          return;
        }

        stateManager.setCurrentState(ApplicationActions.loading);
        RequisitionApiService
          .read(obj.requisitionId, {params : {selectExpand: 'Items'}, blockUI: true })
          .then(
            function success(requisitionObject) {
              modelManager.synchronizeAllModels({
                requisition: requisitionObject,
                itemId: obj.itemId
              }, true);
              displayLogic.synchronize();
            },
            function failure(reason) {
              if (reason.data) {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
            }
          )
          .finally(
            function onFinally() {
              stateManager.setCurrentState(ApplicationActions.idle);
            }
          )
        ;
      };

      /**
       * Delete requisition action handler
       */
      self.deleteRequisition = function deleteRequisition() {
        $log.log('businesslogic.deleteRequisition');
        var requisitionId = modelManager.getRequisitionHeaderModel().id;
        if (!_.isNil(requisitionId)) {
          NotificationHandler.confirm({
            messageOrKey: 'confirmRequisitionDeletionMsg',
            btnAction: 'delete'
          }).then(function success() {
            stateManager.setCurrentActionBarState(ActionBarConstants.deleting);
            RequisitionApiService
              .delete(requisitionId)
              .then(
                function success(dto) {
                  NotificationHandler.success({
                    messageOrKey: 'requisitionDeletedMsg',
                    params: requisitionId
                  });

                  stateManager.setCurrentActionBarState(ActionBarConstants.idleSuccess);
                  stateManager.setNewMode();
                  modelManager.initialize();
                  displayLogic.initialize();

                  self.notify({
                    event: self.Events.REQUISITION_DELETED,
                    params: {
                      id: undefined
                    }
                  });
                },
                function failure(reason) {
                  NotificationHandler.error({ messageOrKey: reason.description, translate: false });
                  stateManager.setCurrentActionBarState(ActionBarConstants.idleError);
                }
              );
          });
        }
      };

      /**
       * Cancel requisition action handler
       */
      self.cancelRequisition = function cancelRequisition() {
        $log.log('businesslogic.cancelRequisition');
      };

      /**
       * Save action. This performs a save operation of the current requisition object currently held by the model manager.
       *
       * @see {@link RequisitionModelManager}
       */
      self.saveRequisition = function saveRequisition() {
        doSave(false);
      };

      /**
       * Complete requisition action handler
       */
      self.completeRequisition = function completeRequisition() {
        doSave(true);
      };

      /**
       * Create requisition action handler
       */
      self.createRequisition = function createRequisition() {

        if (FormService.isDirty()) {
          NotificationHandler
            .confirm({
              msg: 'unsavedChanges'
            })
            .then(
              function success(response) {
                doCreateRequisition();
              },
              function failure(reason) {
                $log.log(reason);
              }
            )
          ;
        }
        else {
          doCreateRequisition();
        }
      };

      /**
       * The actual handler to create a requisition
       */
      function doCreateRequisition() {
        // TODO: notify start?
        stateManager.setNewMode();
        modelManager.initialize();
        displayLogic.initialize();
        self.notify({
          event: self.Events.CREATING_REQUISITION
        });
      }

      /**
       * Synchronize the current requisition with given model object
       *
       * @param {object} model - The model used to perform the synchronization
       */
      self.synchronizeRequisitionHeader = function synchronizeRequisitionHeader(model) {
        var syncItems = !_.isNil(model.requisitionTemplate) &&
          modelManager.getRequisitionHeaderModel().requisitionTemplate !== model.requisitionTemplate;
        modelManager.synchronizeRequisitionHeaderModel(model);

        if (syncItems) {
          applyRequisitionTemplate(modelManager.getRequisitionHeaderModel().requisitionTemplate)
            .then(
              function success(response) {
                displayLogic.synchronize();
              },
              function failure(reason) {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
            )
          ;
        }
        else {
          displayLogic.synchronize();
        }
      };

      /**
       * Add a new requisition item to the current requisition object.
       */
      self.addRequisitionItem = function addRequisitionItem() {
        modelManager.addRequisitionItem();
        FormService.setDirty();
        displayLogic.synchronize();
      };

      /**
       * Add many requisition items to the current requisition object.
       */
      self.addRequisitionItems = function addRequisitionItems(obj) {
        var deferred = $q.defer();

        var rhm = modelManager.getRequisitionHeaderModel();
        var params = {
          products: obj,
          requiredOn: rhm.requiredOn || new Date(),
          siteId: rhm.site.id,
          departmentId: rhm.department.id,
          requesterId: rhm.requester.id,
          clientId: rhm.client ? rhm.client.id : null,
          deliveryLocationId: rhm.deliveryLocation ? rhm.deliveryLocation.id : null,
          requisitionType: rhm.type,
          itemRequiredOn: rhm.requiredOn || new Date(),
          isWeeklyConsommationDisplayed: rhm.isWeeklyConsommationDisplayed || false,
          requesterPermission: 'Z'
        };

        stateManager.setCurrentState(ApplicationActions.loading);
        ProductInfoApi
          .getProducts(params)
          .then(
            function success(response) {
              if (!_.isEmpty(response)) {
                // Browse the entire list of product received and add it to the template line if it does not already exist.
                modelManager.addRequisitionItems(response);
                FormService.setDirty();
              }
              deferred.resolve();
            },
            function failure(reason) {
              if (!_.isNil(reason)) {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
              deferred.reject();
            })
          .finally(function done() {
            // Sync display logic
            displayLogic.synchronize();
            stateManager.setCurrentState(ApplicationActions.idle);
          })
        ;
        return deferred.promise;
      };

      /**
       * Remove the given requisition item
       *
       * @param {string} requisitionItemUuid - The uuid used to find the requisition item to remove
       */
      self.removeRequisitionItem = function removeRequisitionItem(requisitionItemUuid) {
        modelManager.removeRequisitionItem(requisitionItemUuid);
        FormService.setDirty();
        displayLogic.synchronize();
      };

      /**
       * Search for product infos
       *
       * @param {object} params - A parameter object
       */
      self.searchProductInfo = function searchProductInfo(params) {

        stateManager.setCurrentState(ApplicationActions.searching);

        var rhm = modelManager.getRequisitionHeaderModel();
        var searchParams = {
          productCode: params.productCode,
          requiredOn: rhm.requiredOn || new Date(),
          siteId: rhm.site.id,
          departmentId: rhm.department.id,
          requesterId: rhm.requester.id,
          clientId: rhm.client ? rhm.client.id : null,
          deliveryLocationId: rhm.deliveryLocation ? rhm.deliveryLocation.id : null,
          requisitionType: rhm.type,
          itemRequiredOn: rhm.requiredOn || new Date(),
          isWeeklyConsommationDisplayed: rhm.isWeeklyConsommationDisplayed || false,
          requesterPermission: 'Z'
        };
        if (!_.isNil(rhm.requisitionTemplate)) {
          searchParams.requisitionTemplateId = rhm.requisitionTemplate.code;
        }

        ProductInfoApi.getProduct(searchParams)
          .then(
            function success(products) {
              if (!_.isNil(products) && !_.isEmpty(products)) {
                modelManager.assignProductInfo({
                  product: products[0],
                  requisitionItemUuid: params.requisitionItemUuid
                });

                displayLogic.synchronize();
              }
            },
            function failure(reason) {
              modelManager.clearProductInfo({
                requisitionItemUuid: params.requisitionItemUuid
              });
              if (reason && !reason.description) {
                NotificationHandler.error({ messageOrKey: reason, translate: false });
              } else {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
            }
          )
          .finally(function onFinally() {
            stateManager.setCurrentState(ApplicationActions.idle);
          })
        ;
      };

      /**
       * Add a new requisition item based on an uncatalogued product
       */
      self.addUncataloguedProduct = function addUncataloguedProduct(uncataloguedProductModel) {

        var deferred = $q.defer();

        modelManager.assignUncataloguedProduct(uncataloguedProductModel, true);
        deferred.resolve(true);

        return deferred.promise;
      };

      /**
       * Edit an existing requisition item based on an uncatalogued product
       */
      self.editUncataloguedProduct = function editUncataloguedProduct(uncataloguedProductModel) {

        var deferred = $q.defer();

        modelManager.assignUncataloguedProduct(uncataloguedProductModel, false);
        deferred.resolve(true);

        return deferred.promise;
      };

      /**
       * Cancel edition of a requisition item (uncatalogued product)
       */
      self.cancelUncataloguedProductEdition = function cancelUncataloguedProductEdition(uncataloguedProductModel) {
      };

      /**
       * Synchronize the requisition item list
       *
       * @param {object} requisitionItemListModel - The model used to synchronize
       */
      self.synchronizeRequisitionItemList = function synchronizeRequisitionItemList(requisitionItemListModel) {
        var result = modelManager.synchronizeRequisitionItemAggregatesFromRequisitionItemListModel(requisitionItemListModel);
        displayLogic.synchronize();

        var params;
        if (result.quantityGreaterThanAlertedQuantity && result.quantityGreaterThanAlertedQuantity.length) {
          params = result.quantityGreaterThanAlertedQuantity[0];
          if (result.quantityGreaterThanAlertedQuantity.length > 1) {
            _.forEach(result.quantityGreaterThanAlertedQuantity, function iteratee(code) {
              params = params.concat(', ').concat(code);
            });
          }
          NotificationHandler.warn({ messageOrKey: 'quantityGreaterThanAlertedQuantity', params: params });
        }
        else if (result.quantityGreaterThanPermittedQuantity && result.quantityGreaterThanPermittedQuantity.length) {
          params = result.quantityGreaterThanPermittedQuantity[0];
          if (result.quantityGreaterThanPermittedQuantity.length > 1) {
            _.forEach(result.quantityGreaterThanPermittedQuantity, function iteratee(code) {
              params = params.concat(', ').concat(code);
            });
          }
          NotificationHandler.warn({ messageOrKey: 'quantityGreaterThanPermittedQuantity', params: params });
        }
      };

      /**
       * Synchronize the requisition item tabs
       *
       * @param {object} requisitionItemTabsModel - The model used to synchronize
       */
      self.synchronizeRequisitionItemTabs = function synchronizeRequisitionItemTabs(requisitionItemTabsModel) {
        var result = modelManager.synchronizeRequisitionItemAggregateFromRequisitionItemTabsModel(requisitionItemTabsModel);
        modelManager.synchronizeRequisitionItemTabsModel(requisitionItemTabsModel);
        displayLogic.synchronize();

        var params;
        if (result.quantityGreaterThanAlertedQuantity && result.quantityGreaterThanAlertedQuantity.length) {
          params = result.quantityGreaterThanAlertedQuantity[0];
          if (result.quantityGreaterThanAlertedQuantity.length > 1) {
            _.forEach(result.quantityGreaterThanAlertedQuantity, function iteratee(code) {
              params = params.concat(', ').concat(code);
            });
          }
          NotificationHandler.warn({ messageOrKey: 'quantityGreaterThanAlertedQuantity', params: params });
        }
        else if (result.quantityGreaterThanPermittedQuantity && result.quantityGreaterThanPermittedQuantity.length) {
          params = result.quantityGreaterThanPermittedQuantity[0];
          if (result.quantityGreaterThanPermittedQuantity.length > 1) {
            _.forEach(result.quantityGreaterThanPermittedQuantity, function iteratee(code) {
              params = params.concat(', ').concat(code);
            });
          }
          NotificationHandler.warn({ messageOrKey: 'quantityGreaterThanPermittedQuantity', params: params });
        }
      };

      self.searchProducts = function searchProducts() {
        self.notify({
          event: self.Events.ON_PRODUCT_SEARCH,
          params: {
            productParamModel: new ProductParamModel({
              parentView: 'Requisition',
              requester: modelManager.getRequisitionHeaderModel().requester,
              department: modelManager.getRequisitionHeaderModel().department,
              site: modelManager.getRequisitionHeaderModel().site,
              deliveryLocation: modelManager.getRequisitionHeaderModel().deliveryLocation,
              client: modelManager.getRequisitionHeaderModel().client,
              productIds: modelManager.getRequisitionItemsIds()
            })
          }
        });
      };

      /**
       * Select the given requisition item
       *
       * @param {string} requisitionItemUuid - The uuid used to find the requisition item to be selected
       */
      self.selectRequisitionItem = function selectRequisitionItem(requisitionItemUuid) {
        if (false === authorizationsTabSelected) {
          modelManager.synchronizeSelectedRequisitionItem({
            requisitionItemUuid: requisitionItemUuid
          });
        }
        else {
          var params = [];
          var promise = $q.when;
          var targetAggregate = modelManager.getRequisitionItemAggregate(requisitionItemUuid);

          if (!_.isNil(targetAggregate) && targetAggregate.id !== 0) {
            promise = fetchAuthorizations;
            params = targetAggregate.id;
          }

          var authorizations;
          promise(params)
            .then(
              function success(response) {
                authorizations = response;
              },
              function failure(reason) {
                $log.error(reason);
              }
            )
            .finally(function onFinally() {
              modelManager.synchronizeSelectedRequisitionItem({
                requisitionItemUuid: requisitionItemUuid,
                authorizations: authorizations
              });
              displayLogic.synchronize();
            })
          ;
        }
      };

      // Return an arbitrary value used to ultimately trigger the onChanges angular hook
      // together with the binding mechanism (kind of a "brute force refresh"...)
      // --------------------------------------------------------------------------------
      // This value is changed only when explicitly necessary in the business process
      // implied when an item store is changed, otherwise, it would never change at all
      // in the application lifecycle...
      self.getItemModelRecomputeTriggerValue = function getItemModelRecomputeTriggerValue() {
        return itemModelRecomputeTriggerValue;
      };

      /**
      * Manages item due date changes
      *
      * @param {date} dueDate - the new item due date
      */
      self.onItemDueDateChanged = function onItemDueDateChanged(dueDate, uuid) {
        $log.log('business, due date changed !');
        //var uuid = modelManager.getRequisitionItemListModel().selectedRequisitionItem().uuid;
        var rim = modelManager.getRequisitionItemAggregate(uuid);

        // Refresh product info only for status < '1' and for product that is catalogued
        if ((!rim.status || rim.status === '1') && !rim.isUncataloguedProduct) {
          if (!_.isNil(dueDate) && (_.isNil(rim.dueDate) || rim.dueDate !== dueDate)) {
            stateManager.setCurrentState(ApplicationActions.searching);
            var rhm = modelManager.getRequisitionHeaderModel();

            var searchParams = {
              productCode: rim.productId.toString(),
              requiredOn: dueDate,//rhm.requiredOn || new Date(),
              productId: rim.productId,
              storeId: rim.storeId,
              siteId: rhm.site.id,
              departmentId: rhm.department.id,
              requesterId: rhm.requester.id,
              clientId: rhm.client ? rhm.client.id : null,
              deliveryLocationId: rhm.deliveryLocation ? rhm.deliveryLocation.id : null,
              requisitionType: rhm.type,
              itemRequiredOn: new Date(dueDate),
              isWeeklyConsommationDisplayed: rhm.isWeeklyConsommationDisplayed || false,
              requesterPermission: 'Z'
            };

            if (!_.isNil(rhm.requisitionTemplate)) {
              searchParams.requisitionTemplateId = rhm.requisitionTemplate.code;
            }

            ProductInfoApi.getProduct(searchParams)
              .then(
              function success(products) {
                if (!_.isNil(products) && !_.isEmpty(products)) {
                  // Reassign due date with user modification since getProduct nullify dueDate...
                  products[0].dueDate = dueDate;
                  modelManager.assignProductInfo({
                    product: products[0],
                    requisitionItemUuid: rim.uuid
                  }, true);

                  displayLogic.synchronize();

                  // Once the refreshed product has been assigned, generate a new
                  // trigger value for the item list component onChances hook to trigger
                  // and to compute any "post-update" business logic...
                  itemModelRecomputeTriggerValue = uuid4.generate();
                }
              },
              function failure(reason) {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
              )
              .finally(function onFinally() {
                stateManager.setCurrentState(ApplicationActions.idle);
              })
              ;
          }
        }
      };

      /**
      * Manages item store changed
      *
      * @param {number} storeId - the new stored ID
      */
      self.onItemStoreChanged = function onItemStoreChanged(storeId, itemUuid) {

        if (!_.isNil(itemUuid)) {
          var rhm = modelManager.getRequisitionHeaderModel();
          if (!_.isNil(modelManager.getRequisitionItemListModel().selectedRequisitionItem())) {
            var uuid = modelManager.getRequisitionItemListModel().selectedRequisitionItem().uuid;
            var rim = modelManager.getRequisitionItemAggregate(uuid);

            // Refresh current product only when store really got changed
            if (!_.isNil(storeId) && (_.isNil(rim.store) || rim.store.id !== storeId) && uuid === itemUuid) {
              stateManager.setCurrentState(ApplicationActions.searching);

              var searchParams = {
                productCode: rim.productId.toString(),
                requiredOn: rhm.requiredOn || new Date(),
                productId: rim.productId,
                storeId: storeId,
                siteId: rhm.site.id,
                departmentId: rhm.department.id,
                requesterId: rhm.requester.id,
                clientId: rhm.client ? rhm.client.id : null,
                deliveryLocationId: rhm.deliveryLocation ? rhm.deliveryLocation.id : null,
                requisitionType: rhm.type,
                itemRequiredOn: rhm.requiredOn || new Date(),
                isWeeklyConsommationDisplayed: rhm.isWeeklyConsommationDisplayed || false,
                requesterPermission: 'Z'
              };
              if (!_.isNil(rhm.requisitionTemplate)) {
                searchParams.requisitionTemplateId = rhm.requisitionTemplate.code;
              }

              ProductInfoApi.getProduct(searchParams)
                .then(
                function success(products) {
                  if (!_.isNil(products) && !_.isEmpty(products)) {
                    modelManager.assignProductInfo({
                      product: products[0],
                      requisitionItemUuid: rim.uuid
                    }, true);

                    displayLogic.synchronize();

                    // Once the refreshed product has been assigned, generate a new
                    // trigger value for the item list component onChances hook to trigger
                    // and to compute any "post-update" business logic...
                    itemModelRecomputeTriggerValue = uuid4.generate();
                  }
                },
                function failure(reason) {
                  NotificationHandler.error({ messageOrKey: reason.description, translate: false });
                }
                )
                .finally(function onFinally() {
                  stateManager.setCurrentState(ApplicationActions.idle);
                })
                ;
            }
          }
        }
      };

      self.onSelectAuthorizationsTab = function onSelectAuthorizationsTab() {
        authorizationsTabSelected = true;

        var uuid = modelManager.getRequisitionItemListModel().requisitionItemUuid;

        var params = [];
        var promise = $q.when;
        var targetAggregate = modelManager.getRequisitionItemAggregate(uuid);

        if (!_.isNil(targetAggregate) && targetAggregate.id !== 0) {
          promise = fetchAuthorizations;
          params = targetAggregate.id;
        }

        var authorizations;
        promise(params)
          .then(
            function success(response) {
              authorizations = response;
            },
            function failure(reason) {
              $log.error(reason);
            }
          )
          .finally(function onFinally() {
            modelManager.synchronizeSelectedRequisitionItem({
              requisitionItemUuid: uuid,
              authorizations: authorizations
            });
            displayLogic.synchronize();
          })
        ;
      };

      self.onDeselectAuthorizationsTab = function onDeselectAuthorizationsTab() {
        authorizationsTabSelected = false;
      };

      self.addAuthorizer = function addAuthorizer(model) {
        var requisitionId = modelManager.getRequisitionHeaderModel().id;
        return RequisitionApiService.addAuthorizer(requisitionId, model.authorizer.id)
          .then(
            function success(response) {
              UrlHelper.reload();
            },
            function failure(error) {
              NotificationHandler.error({ messageOrKey: error.description, translate: false });
            }
          );
      };

      self.replaceAuthorizer = function replaceAuthorizer(model) {
        var requisitionId = modelManager.getRequisitionHeaderModel().id;
        return RequisitionApiService.replaceAuthorizer(requisitionId, model.authorizerFrom.id, model.authorizerTo.id)
          .then(
            function success(response) {
              if (true === authorizationsTabSelected) {
                self.onSelectAuthorizationsTab();
              }
            },
            function failure(error) {
              NotificationHandler.error({ messageOrKey: error.description, translate: false });
            }
          );
      };

      self.createDeliveryLocation = function createDeliveryLocation(obj) {
        var deferred = $q.defer();
        DeliveryLocationApiService
          .create({
            departmentId: obj.departmentId,
            code: obj.code,
            description: obj.description
          })
          .then(
            function success(deliveryLocation) {
              // Sync header model to trigger bindings
              var rhm = modelManager.getRequisitionHeaderModel();
              rhm.deliveryLocation = deliveryLocation;
              modelManager.synchronizeRequisitionHeaderModel(rhm);

              deferred.resolve(deliveryLocation);
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      };

      function fetchAuthorizations(requisitionItemId) {
        return AuthorizationApiService.read({ requisitionItemId: requisitionItemId });
      }

      /**
       * Save the given requisition
       *
       * @param {RequisitionAggregateObject} requisitionObj - The requisition object instance to be saved
       * @param {boolean} complete - Whether or not to save the requisition as completed
       * @see {@link RequisitionObjectService}
       * @returns {promise}
       */
      function save(requisitionObj, complete) {
        var params = {
          userProfileId: UserProfileService.getCurrentProfile().id,
          complete: complete,
          requisition: requisitionObj,
          id: undefined
        };

        var action = RequisitionApiService.create;
        var message = 'requisitionInsertedMsg';
        if (!_.isNil(requisitionObj.id)) {
          message = 'requisitionUpdatedMsg';
          action = RequisitionApiService.update;
          params.id = requisitionObj.id;
        }

        return action(params);
      }

      function doSave(complete) {
        $log.log('businesslogic.save');
        stateManager.setCurrentActionBarState(true === complete ? ActionBarConstants.completing : ActionBarConstants.saving);

        var requisitionObj = modelManager.getRequisitionObject();

        var requisitionId;
        save(requisitionObj, complete)
          .then(
            function success(response) {
              requisitionId = response.id;

              // Reset model manager to its default state
              modelManager.initialize({ uncataloguedProductSavedValues: modelManager.getRequisitionViewModel().uncataloguedProductSavedValues });

              // Update models
              modelManager.synchronizeAllModels({
                requisition: response
              }, true);

              // Update state
              stateManager.setEditMode();

              // Form should now be in pristine state
              FormService.setPristine();

              // Reset action bar to idle state
              stateManager.setCurrentActionBarState(ActionBarConstants.idleSuccess);

              var promise = $q.when([]);
              if (true === authorizationsTabSelected) {
                if (response.requisitionItems.length > 0) {
                  promise = fetchAuthorizations(response.requisitionItems[0].id);
                }
              }
              return promise;
            }
          )
          .then(
            function success(authorizations) {
              if (authorizations.length > 0) {
                modelManager.synchronizeSelectedRequisitionItem({
                  requisitionItemUuid: modelManager.getRequisitionItemTabsModel().uuid, // use this model's uuid... could have been item list model
                  authorizations: authorizations
                });
              }

              // Sync display logic
              displayLogic.synchronize();

              // User notification
              var message = 'requisitionInsertedMsg';
              if (!_.isNil(requisitionObj.id)) {
                message = 'requisitionUpdatedMsg';
              }

              NotificationHandler.success({
                messageOrKey: message,
                params: requisitionId
              });

              self.notify({
                event: self.Events.REQUISITION_SAVED,
                params: {
                  id: requisitionId,
                  uncataloguedProductSavedValues: modelManager.getRequisitionViewModel().uncataloguedProductSavedValues
                }
              });
            },
            function failure(reason) {
              NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              stateManager.setCurrentActionBarState(ActionBarConstants.idleError);
            }
          )
        ;
      }

      /**
       * A helper to apply a selected requisition template to the current requisition
       *
       * @param {object} requisitionTemplateObj - The template instance to use
       */
      function applyRequisitionTemplate(requisitionTemplateObj) {
        var deferred = $q.defer();

        var headerModel = modelManager.getRequisitionHeaderModel();
        var params = {
          requiredOn: headerModel.requiredOn,
          siteId: headerModel.site.id,
          departmentId: headerModel.department.id,
          requisitionTemplateId: requisitionTemplateObj.code,
          requesterId: headerModel.requester.id,
          deliveryLocationId: headerModel.deliveryLocation ? headerModel.deliveryLocation.id : null,
          requisitionType: headerModel.type,
          clientId: headerModel.client ? headerModel.client.id : null,
          itemRequiredOn: headerModel.requiredOn,
          isWeeklyConsommationDisplayed: headerModel.isWeeklyConsommationDisplayed
        };

        RequisitionTemplateProductApi.get(params)
          .then(
            function success(response) {
              if (!_.isNil(response.warning) && response.warning !== '') {
                NotificationHandler.warn({ messageOrKey: response.warning, translate: false });
              }

              if (!_.isEmpty(response.data)) {
                modelManager.initializeRequisitionItemAggregates(response.data);
                modelManager.synchronizeRequisitionItemListModel();
                modelManager.synchronizeRequisitionItemTabsModel();
              }

              deferred.resolve();
            },
            function failure(reason) {
              // NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              deferred.reject(reason);
            }
          )
        ;

        return deferred.promise;
      }

      return self;
    }
  }
)();
