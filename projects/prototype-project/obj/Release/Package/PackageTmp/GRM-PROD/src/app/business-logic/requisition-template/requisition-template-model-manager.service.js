(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-template')
      .factory('RequisitionTemplateModelManager', RequisitionTemplateModelManagerFactory)
    ;

    /* @ngInject */
    function RequisitionTemplateModelManagerFactory(
        $filter,
        $log,
        RequisitionTemplateHeaderModel,
        RequisitionTemplateItemsModel,
        RequisitionTemplateObjectService,
        RequisitionTemplateViewModel,
        RequisitionTemplateItemObjectService
      ) {

      var self = this;
      var translator = $filter('translate');
      var newRequisitionTemplateLabel = 'newMasculine';

      var requisitionTemplateHeaderModel, pristineRequisitionTemplateHeaderModel;
      var requisitionTemplateItemsModel, pristineTemplateItemsModel;
      var requisitionTemplateViewModel, pristineTemplateViewModel;

      this.initialize = function initialize() {
        requisitionTemplateHeaderModel = new RequisitionTemplateHeaderModel();
        requisitionTemplateItemsModel = new RequisitionTemplateItemsModel();
        requisitionTemplateViewModel = new RequisitionTemplateViewModel({
          requisitionTemplateLabel: translator(newRequisitionTemplateLabel)
        });

        pristineRequisitionTemplateHeaderModel = requisitionTemplateHeaderModel.clone();
        pristineTemplateItemsModel = requisitionTemplateItemsModel.clone();
        pristineTemplateViewModel = requisitionTemplateViewModel.clone();
      };

      this.getViewModel = function getViewModel() {
        return requisitionTemplateViewModel;
      };

      this.getRequisitionTemplateHeaderModel = function getRequisitionTemplateHeaderModel() {
        return requisitionTemplateHeaderModel;
      };

      this.getRequisitionTemplateItemsModel = function getRequisitionTemplateItemsModel() {
        return requisitionTemplateItemsModel;
      };

      //Get all id's of a product list
      self.getRequisitionTemplateItemsIds = function getProductCartItemsIds() {
        var result = [];
        requisitionTemplateItemsModel.requisitionTemplateItems.forEach(function (item) {
          result.push(item.productId);
        });

        return result;
      };

      self.isRequisitionTemplateInactive = function isRequisitionTemplateInactive() {
        if (_.isNil(pristineRequisitionTemplateHeaderModel.id)) {
          return false;
        }
        return false === pristineRequisitionTemplateHeaderModel.active;
      };

      this.synchronizeRequisitionTemplateHeaderModel = function synchronizeRequisitionTemplateHeaderModel(model) {
        requisitionTemplateHeaderModel = model.clone();
        if (_.isNil(model.department)) {
          requisitionTemplateHeaderModel.client = undefined;
        }
      };

      this.getRequisitionTemplateObject = function getRequisitionTemplateObject() {
        var obj = RequisitionTemplateObjectService.newInstance();

        obj.id = requisitionTemplateHeaderModel.id;
        obj.name = requisitionTemplateHeaderModel.name;
        obj.isActive = requisitionTemplateHeaderModel.active;
        obj.isAutomaticGeneration = requisitionTemplateHeaderModel.isAutomaticGeneration;
        obj.site = requisitionTemplateHeaderModel.site;
        obj.department = requisitionTemplateHeaderModel.department;
        obj.address = requisitionTemplateHeaderModel.address;
        obj.deliveryLocation = requisitionTemplateHeaderModel.deliveryLocation;
        obj.requester = requisitionTemplateHeaderModel.requester;
        obj.modifiedOn = requisitionTemplateHeaderModel.modifiedOn;
        obj.client = requisitionTemplateHeaderModel.client;

        return obj;
      };

      this.getRequisitionTemplateItemsObject = function getRequisitionTemplateItemsObject() {
        var obj = RequisitionTemplateItemObjectService.newInstance();
        obj.requisitionTemplateItems = requisitionTemplateItemsModel.requisitionTemplateItems.filter(function(e) { return !_.isNil(e.code); });
        return obj;
      };

      this.setRequisitionTemplateViewModels = function setRequisitionTemplateViewModels(obj) {
        if (_.isNil(obj)) {
          return;
        }

        // Requisition template header initialization
        var rthm = new RequisitionTemplateHeaderModel();
        rthm.id = obj.requisitionTemplate.id;
        rthm.name = obj.requisitionTemplate.name;
        rthm.active = obj.requisitionTemplate.isActive;
        rthm.isAutomaticGeneration = obj.requisitionTemplate.isAutomaticGeneration;
        rthm.site = obj.requisitionTemplate.site;
        rthm.department = obj.requisitionTemplate.department;
        rthm.address = obj.requisitionTemplate.address;
        rthm.deliveryLocation = obj.requisitionTemplate.deliveryLocation;
        rthm.requester = obj.requisitionTemplate.requester;
        rthm.modifiedOn = obj.requisitionTemplate.modifiedOn;
        rthm.modifiedByCode = obj.requisitionTemplate.modifiedByCode;
        rthm.modifiedByDesc = obj.requisitionTemplate.modifiedByDesc;
        rthm.client = obj.requisitionTemplate.client;

        // Requisition template items model initialization
        var rtim = new RequisitionTemplateItemsModel();
        rtim.requisitionTemplateItems = obj.requisitionTemplate.requisitionTemplateItems;
        //If theres one or more items, set the current item in the itemsModel as the first.
        if (rtim.requisitionTemplateItems.length >= 0) {
          var targetItem = obj.requisitionTemplate.requisitionTemplateItems[0];
          if (!_.isNil(obj.itemId)) {
            targetItem = _.find(obj.requisitionTemplate.requisitionTemplateItems, function iterator(item) {
              return String(item.id) === obj.itemId;
            });
          }
          rtim.requisitionTemplateItem = targetItem;
        }

        // Requisition template view model
        var vm = new RequisitionTemplateViewModel();
        vm.requisitionTemplateLabel = _.isNil(rthm.id) ? translator(newRequisitionTemplateLabel) : rthm.id;

        // Reassign view models
        requisitionTemplateHeaderModel = rthm;
        requisitionTemplateItemsModel = rtim;
        requisitionTemplateViewModel = vm;

        // Reassign pristine models
        pristineRequisitionTemplateHeaderModel = requisitionTemplateHeaderModel.clone();
        pristineTemplateItemsModel = requisitionTemplateItemsModel.clone();
        pristineTemplateViewModel = requisitionTemplateViewModel.clone();
      };

      self.fetchProductInfoListIntoTemplateItemsModel = function fetchProductInfoListIntoTemplateItemsModel(productInfo, index) {
        //here, keep values of field that are not received from "ProductInfo" service.
        var lineNumber = requisitionTemplateItemsModel.requisitionTemplateItems[index].lineNumber;
        var quantity = requisitionTemplateItemsModel.requisitionTemplateItems[index].quantity;

        _.extend(requisitionTemplateItemsModel.requisitionTemplateItems[index], productInfo);

        requisitionTemplateItemsModel.requisitionTemplateItems[index].lineNumber = lineNumber;
        requisitionTemplateItemsModel.requisitionTemplateItems[index].quantity = quantity;
        requisitionTemplateItemsModel.requisitionTemplateItems[index].frequencyId = 1; // Ignore scheduling
      };

      self.addTemplateItem = function addTemplateItem(obj) {
        self.extendTemplateItemsModel(obj);
      };

      self.addTemplateItems = function addTemplateItems(obj) {
        var model = requisitionTemplateItemsModel;//Use shorter variable name for requisitionTemplateItemsModel
        var length;

        _.forEach(obj,
          function iterator(productInfo) {
            //Check if product already exists
            var exists = _.some(model.requisitionTemplateItems, function (item) {
              return item.productId === productInfo.productId;
            });

            //Add product if it does not already exist
            if (!exists) {
              length = model.requisitionTemplateItems.push(RequisitionTemplateItemObjectService.newInstance());
              _.extend(model.requisitionTemplateItems[length - 1], productInfo);
            }
          },
          this);

        if (angular.isDefined(length)) {
          model.requisitionTemplateItem = model.requisitionTemplateItems[length - 1];//focus on the last new element
        }
      };

      self.removeTemplateItem = function removeTemplateItem(obj) {
        self.extendTemplateItemsModel(obj);
      };

      self.extendTemplateItemsModel = function extendTemplateItemsModel(obj) {
        _.extend(requisitionTemplateItemsModel, obj);
      };

      self.clearTemplateItemsModel = function clearTemplateItemsModel() {
        requisitionTemplateItemsModel = new RequisitionTemplateItemsModel();
      };

      self.clearTemplateItem = function clearTemplateItem(index) {
        var newItem = RequisitionTemplateItemObjectService.newInstance();
        requisitionTemplateItemsModel.requisitionTemplateItem = newItem;
        requisitionTemplateItemsModel.requisitionTemplateItems[index] = newItem;
      };

      self.syncTemplateItemsModel = function syncTemplateItemsModel() {
        requisitionTemplateItemsModel = requisitionTemplateItemsModel.clone();
      };
      return this;
    }
  }
)();
