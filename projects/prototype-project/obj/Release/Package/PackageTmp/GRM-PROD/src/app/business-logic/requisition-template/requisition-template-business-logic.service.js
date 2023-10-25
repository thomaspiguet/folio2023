(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-template')
      .factory('RequisitionTemplateBusinessLogic', RequisitionTemplateBusinessLogicFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateBusinessLogicFactory(
        $log,
        $timeout,
        $q,
        ActionBarConstants,
        FormService,
        NotificationHandler,
        ProductParamModel,
        RequisitionTemplateApiService,
        RequisitionTemplateDisplayLogicManager,
        RequisitionTemplateItemsStates,
        RequisitionTemplateModelManager,
        RequisitionTemplateProductInfoApi,
        RequisitionTemplateStateManager,
        UrlHelper
      ) {

      var self = this;
      var displayLogicManager = RequisitionTemplateDisplayLogicManager;
      var modelManager = RequisitionTemplateModelManager;
      var stateManager = RequisitionTemplateStateManager;
      var actions = ActionBarConstants;
      var itemsListStates = RequisitionTemplateItemsStates;

      Object.defineProperty(this, 'Events', {
        value: {
          NEW_REQUISITION_TEMPLATE: 'NEW_REQUISITION_TEMPLATE',
          SAVE_REQUISITION_TEMPLATE : 'SAVE_REQUISITION_TEMPLATE',
          ON_PRODUCT_SEARCH: 'ON_PRODUCT_SEARCH'
        }
      });

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          id: undefined,
          iid: undefined,
          notificationCallback: function noop() { /*Do nothing*/ } // TODO : use this where appropriate
        }, configParams);

        if (!_.isNil(config.id)) {
          self.getRequisitionTemplate({
            requisitionTemplateId: config.id,
            itemId: config.iid
          });
        }

        self.notificationCallback = config.notificationCallback;
      };

      self.searchProducts = function searchProducts() {
        self.notificationCallback({
          event: self.Events.ON_PRODUCT_SEARCH,
          params: {
            productParamModel: new ProductParamModel({
              parentView: 'RequisitionTemplate',
              site: modelManager.getRequisitionTemplateHeaderModel().site,
              department: modelManager.getRequisitionTemplateHeaderModel().department,
              deliveryLocation: modelManager.getRequisitionTemplateHeaderModel().deliveryLocation,
              client: modelManager.getRequisitionTemplateHeaderModel().client,
              productIds: modelManager.getRequisitionTemplateItemsIds()
            })
          }
        });
      };

      self.createRequisitionTemplate = function createRequisitionTemplate() {
        stateManager.setNewMode();
        modelManager.initialize();
        displayLogicManager.initialize();
        self.notificationCallback({
          event: self.Events.NEW_REQUISITION_TEMPLATE
        });
      };

      self.saveRequisitionTemplate = function saveRequisitionTemplate() {
        stateManager.setCurrentActionState(actions.saving);

        var requisitionTemplateObj = modelManager.getRequisitionTemplateObject();
        requisitionTemplateObj.requisitionTemplateItems = modelManager.getRequisitionTemplateItemsObject().requisitionTemplateItems;
        var params = {
          requisitionTemplate: requisitionTemplateObj
        };

        var action = RequisitionTemplateApiService.create;
        var message = 'requisitionTemplateSaved';
        if (!_.isNil(requisitionTemplateObj.id)) {
          message = 'requisitionTemplateUpdated';
          action = RequisitionTemplateApiService.update;
        }

        action(params)
          .then(
            function success(requisitionTemplate) {
              NotificationHandler.success({ messageOrKey: message });

              // Update models
              modelManager.setRequisitionTemplateViewModels({
                requisitionTemplate: requisitionTemplate
              });

              // Update state
              stateManager.setEditMode();
              FormService.setPristine();
              stateManager.setCurrentActionState(actions.idleSuccess);

              // Sync display logic
              displayLogicManager.synchronize();

              self.notificationCallback({
                event: self.Events.SAVE_REQUISITION_TEMPLATE,
                params: {
                  id: modelManager.getRequisitionTemplateHeaderModel().id
                }
              });
            },
            function failure(reason) {
              NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              stateManager.setCurrentActionState(actions.idleError);
            }
          )
          .finally(
            function onFinally() {
              // stateManager.setCurrentActionState(actions.idle);
            }
          )
        ;
      };

      self.getRequisitionTemplate = function getRequisitionTemplate(obj) {
        if (_.isNil(obj) || _.isNil(obj.requisitionTemplateId)) {
          return;
        }

        stateManager.setCurrentActionState(actions.loading);

        RequisitionTemplateApiService
          .getById(obj.requisitionTemplateId)
          .then(
            function success(requisitionTemplate) {
              modelManager.setRequisitionTemplateViewModels({
                requisitionTemplate: requisitionTemplate,
                itemId: obj.itemId
              });
            },
            function failure(reason) {
              NotificationHandler.error({ messageOrKey: reason.description, translate: false });
            }
          )
          .finally(
            function onFinally() {
              stateManager.setCurrentActionState(actions.idle);
            }
          )
        ;
      };

      self.deleteRequisitionTemplate = function deleteRequisitionTemplate(id) {
        NotificationHandler.confirm({
          messageOrKey: 'confirmRequisitionTemplateDeletionMsg',
          btnAction: 'delete'
        }).then(
            function success(response) {
              stateManager.setCurrentActionState(actions.deleting);

              RequisitionTemplateApiService
                .delete(id)
                .then(
                  function success(response) {
                    stateManager.setCurrentActionState(actions.idleSuccess);
                    self.createRequisitionTemplate();
                  },
                  function failure(reason) {
                    NotificationHandler.error({ messageOrKey: reason.description, translate: false });
                    stateManager.setCurrentActionState(actions.idleError);
                  }
                )
              ;
            }
          )
        ;
      };

      self.cancelRequisitionTemplate = function cancelRequisitionTemplate() {
        stateManager.setCurrentActionState(actions.cancelling);

        $timeout(function onTimeout() {
          stateManager.setCurrentActionState(actions.idle);
        }, 3000);
      };

      self.synchronizeRequisitionTemplateHeader = function synchronizeRequisitionTemplateHeader(obj) {
        modelManager.synchronizeRequisitionTemplateHeaderModel(obj.model);
        displayLogicManager.synchronize();
      };

      self.addTemplateItem = function addTemplateItem(obj) {
        RequisitionTemplateModelManager.addTemplateItem(obj);
        FormService.setDirty();
        // Sync display logic
        displayLogicManager.synchronize();
      };

      self.addTemplateItems = function addTemplateItems(obj) {
        var deferred = $q.defer();
        var headerModel = RequisitionTemplateModelManager.getRequisitionTemplateHeaderModel();

        var params = {
          products: obj,
          siteId: headerModel.site.id,
          departmentId: headerModel.department ? headerModel.department.id : null,
          deliveryLocationId: headerModel.deliveryLocation ? headerModel.deliveryLocation.id : null
        };

        stateManager.setCurrentItemsListState(itemsListStates.fetching);
        RequisitionTemplateProductInfoApi.getProducts(params)
          .then(
            function success(response) {
              if (!_.isEmpty(response)) {
                //Browse the entire list of product received and add it to the template line if it does not already exist.
                RequisitionTemplateModelManager.addTemplateItems(response);
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
            RequisitionTemplateModelManager.syncTemplateItemsModel();
            // Sync display logic
            displayLogicManager.synchronize();
            stateManager.setCurrentItemsListState(itemsListStates.idle);
          });
        return deferred.promise;
      };

      self.removeTemplateItem = function removeTemplateItem(obj) {
        RequisitionTemplateModelManager.removeTemplateItem(obj);
        FormService.setDirty();
        // Sync display logic
        displayLogicManager.synchronize();
      };

      self.extendTemplateItemsModel = function extendTemplateItemsModel(obj) {
        RequisitionTemplateModelManager.extendTemplateItemsModel(obj);
        // Sync display logic
        displayLogicManager.synchronize();
      };

      self.getProductInfo = function getProductInfo(obj) {
        var deferred = $q.defer();
        var headerModel = RequisitionTemplateModelManager.getRequisitionTemplateHeaderModel();
        var params = {
          productCode: obj.productCode,
          productId: obj.productId,
          storeId: obj.storeId,
          siteId: headerModel.site.id,
          clientId: headerModel.client ? headerModel.client.id : null,
          departmentId: headerModel.department ? headerModel.department.id : null,
          deliveryLocationId: headerModel.deliveryLocation ? headerModel.deliveryLocation.id : null
        };
        stateManager.setCurrentItemsListState(itemsListStates.fetching);
        RequisitionTemplateProductInfoApi.getProduct(params)
          .then(
            function success(products) {
              if (!_.isEmpty(products)) {
                RequisitionTemplateModelManager.fetchProductInfoListIntoTemplateItemsModel(products[0], obj.index);
                // Sync display logic
                displayLogicManager.synchronize();
                deferred.resolve();
              }
            },
            function failure(reason) {
              RequisitionTemplateModelManager.clearTemplateItem(obj.index);
              if (!_.isNil(reason)) {
                NotificationHandler.error({ messageOrKey: reason.description, translate: false });
              }
              deferred.reject();
            })
          .finally(function done() {
            RequisitionTemplateModelManager.syncTemplateItemsModel();
            // Sync display logic
            displayLogicManager.synchronize();
            stateManager.setCurrentItemsListState(itemsListStates.idle);
          });
          return deferred.promise;
      };

      return this;
    }
  }
)();
