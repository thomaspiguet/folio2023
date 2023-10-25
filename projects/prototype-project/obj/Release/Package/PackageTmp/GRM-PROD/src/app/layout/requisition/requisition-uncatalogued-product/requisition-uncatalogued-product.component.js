(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-uncatalogued-product')
      .component('requisitionUncataloguedProduct', requisitionUncataloguedProduct())
    ;

    function requisitionUncataloguedProduct() {
      var cdo = {
        templateUrl: 'requisition-uncatalogued-product.template.html',
        controller: RequisitionUncataloguedProductController,
        bindings: {
          actionHandler: '&',
          savedValuesModel: '<',
          stateModel: '<',
          dataModel: '<model',
          configuration: '<',
          interactionMode: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionUncataloguedProductController(
        $q,
        $log,
        $scope,
        $timeout,
        DynamicLookupService,
        InteractionModes,
        NonCataloguedDefaultValuesApi,
        RequisitionUncataloguedProductActions
      ) {

      // Privates...
      var deferredAccountFetch;
      var deferredSecondaryCodeFetch;
      var isApplyingSavedValues = false;

      var ctrl = this;

      ctrl.$onInit = function() {
        //Flag used to ignored "onSelect" action when "feeding" dropdowns values.
        ctrl.isFetchingDefaultValues = false;

        // Recompute state model from internal interaction mode
        if (InteractionModes.ReadOnly === ctrl.interactionMode) {
          ctrl.stateModel.isUpdateable = false;
          ctrl.stateModel.account.disabled = true;
          ctrl.stateModel.buyer.disabled = true;
          ctrl.stateModel.cost.disabled = true;
          ctrl.stateModel.description.disabled = true;
          ctrl.stateModel.distributionUnit.disabled = true;
          ctrl.stateModel.distributionUnit.required = false;
          ctrl.stateModel.notifyBuyerToCreateProduct.disabled = true;
          ctrl.stateModel.noteForBuyer.disabled = true;
          ctrl.stateModel.projectActivity.disabled = true;
          ctrl.stateModel.quantity.disabled = true;
          ctrl.stateModel.secondaryCode.disabled = true;
          ctrl.stateModel.statisticalUnit.disabled = true;
          ctrl.stateModel.statisticalUnit.required = false;
          ctrl.stateModel.vendor.disabled = true;
          ctrl.stateModel.vendorItemCode.disabled = true;
          ctrl.stateModel.taxScheme.disabled = true;
          ctrl.stateModel.unspscClassification.disabled = true;
        }

        setProjectActivityAccountId();
      };

      function getUncataloguedProductDefaultValues(params, assignBuyerOnly) {
        var deferred = $q.defer();
        var _params = _.extend({
          departmentId : !_.isNil(ctrl.configuration.department) ?
              ctrl.configuration.department.id : null,
          siteId : !_.isNil(ctrl.configuration.site) ?
              ctrl.configuration.site.id : null,
          vendorId : !_.isNil(ctrl.dataModel.vendor) ?
              ctrl.dataModel.vendor.id : null,
          segmentCode : !_.isNil(ctrl.dataModel.segment) ?
              ctrl.dataModel.segment.code : null,
          familyCode : !_.isNil(ctrl.dataModel.family) ?
              ctrl.dataModel.family.code : null,
          classCode : !_.isNil(ctrl.dataModel.class) ?
              ctrl.dataModel.class.code : null,
          unspscClassificationId : !_.isNil(ctrl.dataModel.unspscClassification) ?
              ctrl.dataModel.unspscClassification.id : null
        }, params);

        var promise = assignBuyerOnly ?
            NonCataloguedDefaultValuesApi.getDefaultBuyer(_params) :
            NonCataloguedDefaultValuesApi.getDefaultValues(_params);

        promise.then(
            function success(response) {
              deferred.resolve(response.data);
            },
            function failure(reason) {
              $log.error(reason);
              deferred.reject(reason);
            }
        );
        return deferred.promise;
      }

      function fetchDefaultValues(triggeredFrom) {

        if (!isApplyingSavedValues) {

          var params = {};
          // var assignAccount = true;
          var assignAccount = DynamicLookupService.getRequisitionTypes()._1.code === ctrl.configuration.requisitionTypeCode;
          var assignSecondaryCode = true;

          /*only if gathering of default values is triggered from secondary code field*/
          if (triggeredFrom === 'secondaryCode') {
            params.secondaryCodeId = !_.isNil(ctrl.dataModel.secondaryCode) ?
                ctrl.dataModel.secondaryCode.id : null;
            assignSecondaryCode = false;
          } else if (triggeredFrom === 'account') {
            params.secondaryCodeId = !_.isNil(ctrl.dataModel.secondaryCode) ?
                ctrl.dataModel.secondaryCode.id : null;
            params.accountId = !_.isNil(ctrl.dataModel.account) ?
                ctrl.dataModel.account.id : null;
            assignSecondaryCode = false;
            assignAccount = false;
          }

          if (ctrl.interactionMode === InteractionModes.Edit || triggeredFrom === 'vendor') {
            //If we are editing the product, or we changed vendor, we always just want to fetch the default buyer.
            getUncataloguedProductDefaultValues(params, true).then(
                function (buyer) {
                  //never override entered buyer if default one is not set/null, otherwise override it.
                  if (!_.isNil(buyer)) {
                    ctrl.dataModel.buyer = buyer;
                  }
                });
          } else {
            ctrl.isFetchingDefaultValues = true;
            deferredAccountFetch = $q.defer();
            deferredSecondaryCodeFetch = $q.defer();
            //If we are creating the product, we want to get all default values.
            getUncataloguedProductDefaultValues(params, false).then(
                function (defaults) {
                  //never override entered account if default one is not set/null.
                  if (!_.isNil(defaults.account) && assignAccount && ctrl.dataModel.account !== defaults.account) {
                      ctrl.dataModel.account = defaults.account;
                  } else {
                    //No account assignment will occur, so, do not wait for its assignment.
                    deferredAccountFetch.resolve();
                  }
                  if (assignSecondaryCode && ctrl.dataModel.secondaryCode !== defaults.secondaryCode) {
                    ctrl.dataModel.secondaryCode = defaults.secondaryCode;
                  } else {
                    //No secondary code assignment will occur, so, do not wait for its assignment.
                    deferredSecondaryCodeFetch.resolve();
                  }
                  if (!_.isNil(defaults.buyer)) {
                    ctrl.dataModel.buyer = defaults.buyer;
                  }

                  ctrl.dataModel.projectActivity = defaults.projectActivity;

                  //Wait until secondary code AND account assignment are done.
                  $q.all([deferredAccountFetch.promise,
                    deferredSecondaryCodeFetch.promise
                  ]).then(function () {
                    ctrl.isFetchingDefaultValues = false;
                  });
                }
            ).catch(function() {
              ctrl.isFetchingDefaultValues = false;
            });
          }
          return ctrl.isFetchingDefaultValues;
        }
      }

      function handleEvent(action, $event, model) {
        if ($event) {
          $event.preventDefault();
        }

        return ctrl.actionHandler({
          obj : {
            action : action,
            model: model ? model : ctrl.dataModel
          }
        });
      }

      function setProjectActivityAccountId() {
        if (!_.isNil(ctrl.dataModel.account)) {
          ctrl.projectActivityAccountId = ctrl.dataModel.account.id;
        } else {
          ctrl.projectActivityAccountId = null;
        }
      }

      ctrl.fetchDefaultAccount = function fetchDefaultAccount() {
        //fetch default account on select secondary code only if in edit mode and if value is null.
        return ctrl.interactionMode === InteractionModes.Edit && 
          _.isNil(ctrl.dataModel.account) && 
          DynamicLookupService.getRequisitionTypes()._1.code === ctrl.configuration.requisitionTypeCode
        ;
      };

      ctrl.fetchDefaultProjectActivity = function fetchDefaultProjectActivity() {
        //fetch default projectActivity on select account only if in edit mode. always override it.
        //TODO : custom validator to not override project/activity, but to set it "invalid"
        return !isApplyingSavedValues && ctrl.interactionMode === InteractionModes.Edit;
      };

      //
      // Fields changes section...
      //

      ctrl.onSelectSecondaryCode = function onSelectSecondaryCode() {
        if (!ctrl.isFetchingDefaultValues) {
          if (!_.isNil(ctrl.dataModel.secondaryCode)) {
            if (!fetchDefaultValues('secondaryCode')) {
              // If secondary code is accompanied by it's default account, set it right away
              // unless account has already been set by the user
              if (!_.isNil(ctrl.dataModel.secondaryCode.account) && _.isNil(ctrl.dataModel.account)) {
                ctrl.dataModel.account = ctrl.dataModel.secondaryCode.account;
              }
            }
          }
        } else {
          if (!_.isNil(deferredSecondaryCodeFetch)) {
            deferredSecondaryCodeFetch.resolve();
          }
        }
      };

      ctrl.onSelectAccount = function onSelectAccount() {
        setProjectActivityAccountId();
        if (!ctrl.isFetchingDefaultValues) {
          if (!_.isNil(ctrl.dataModel.account)) {
            if (!fetchDefaultValues('account')) {
              // If selected account came with a default project/activity, set it now
              // otherwise, set it empty unless it already had a value (still paired with current account)
              if (!_.isNil(ctrl.dataModel.account.projectActivity)) {
                ctrl.dataModel.projectActivity = ctrl.dataModel.account.projectActivity;
              } else if (_.isNil(ctrl.dataModel.projectActivity)) {
                ctrl.dataModel.projectActivity = null;
              }
            }
          }
        } else {
          if (!_.isNil(deferredAccountFetch)) {
            deferredAccountFetch.resolve();
          }
        }
      };

      ctrl.onSelectUnspscClassification = function () {
        if (ctrl.stateModel.unspscClassification.active) {
          if (!_.isNil(ctrl.dataModel.unspscClassification)) {
            fetchDefaultValues('unspscClassification');
          }
        }
      };

      function areEqual(value1, value2) {
        return value1 === value2 || _.isEqual(value1, value2) || (_.isNil(value1) && _.isNil(value2));
      }

      ctrl.isSavedValuesEqualCurrentValues = function($event) {
        if (!_.isNil(ctrl.savedValuesModel)) {
          return areEqual(ctrl.savedValuesModel.account, ctrl.dataModel.account) &&
          areEqual(ctrl.savedValuesModel.buyer, ctrl.dataModel.buyer) &&
          areEqual(ctrl.savedValuesModel.class, ctrl.dataModel.class) &&
          areEqual(ctrl.savedValuesModel.cost, ctrl.dataModel.cost) &&
          areEqual(ctrl.savedValuesModel.description, ctrl.dataModel.description) &&
          areEqual(ctrl.savedValuesModel.distributionUnit, ctrl.dataModel.distributionUnit) &&
          areEqual(ctrl.savedValuesModel.family, ctrl.dataModel.family) &&
          areEqual(ctrl.savedValuesModel.noteForBuyer, ctrl.dataModel.noteForBuyer) &&
          areEqual(ctrl.savedValuesModel.notifyBuyerToCreateProduct, ctrl.dataModel.notifyBuyerToCreateProduct) &&
          areEqual(ctrl.savedValuesModel.projectActivity, ctrl.dataModel.projectActivity) &&
          areEqual(ctrl.savedValuesModel.quantity, ctrl.dataModel.quantity) &&
          areEqual(ctrl.savedValuesModel.secondaryCode, ctrl.dataModel.secondaryCode) &&
          areEqual(ctrl.savedValuesModel.segment, ctrl.dataModel.segment) &&
          areEqual(ctrl.savedValuesModel.statisticalUnit, ctrl.dataModel.statisticalUnit) &&
          areEqual(ctrl.savedValuesModel.taxScheme, ctrl.dataModel.taxScheme) &&
          areEqual(ctrl.savedValuesModel.unspscClassification, ctrl.dataModel.unspscClassification) &&
          areEqual(ctrl.savedValuesModel.vendor, ctrl.dataModel.vendor) &&
          areEqual(ctrl.savedValuesModel.vendorItemCode, ctrl.dataModel.vendorItemCode);
        }
        return false;
      };

      ctrl.onBackupCurrentValues = function($event) {
        $log.log('onBackupCurrentValues called...');

        ctrl.savedValuesModel = {};
        ctrl.savedValuesModel.account = ctrl.dataModel.account;
        ctrl.savedValuesModel.buyer = ctrl.dataModel.buyer;
        ctrl.savedValuesModel.class = ctrl.dataModel.class;
        ctrl.savedValuesModel.cost = ctrl.dataModel.cost;
        ctrl.savedValuesModel.description = ctrl.dataModel.description;
        ctrl.savedValuesModel.distributionUnit = ctrl.dataModel.distributionUnit;
        ctrl.savedValuesModel.family = ctrl.dataModel.family;
        ctrl.savedValuesModel.noteForBuyer = ctrl.dataModel.noteForBuyer;
        ctrl.savedValuesModel.notifyBuyerToCreateProduct = ctrl.dataModel.notifyBuyerToCreateProduct;
        ctrl.savedValuesModel.projectActivity = ctrl.dataModel.projectActivity;
        ctrl.savedValuesModel.quantity = ctrl.dataModel.quantity;
        ctrl.savedValuesModel.secondaryCode = ctrl.dataModel.secondaryCode;
        ctrl.savedValuesModel.segment = ctrl.dataModel.segment;
        ctrl.savedValuesModel.statisticalUnit = ctrl.dataModel.statisticalUnit;
        ctrl.savedValuesModel.taxScheme = ctrl.dataModel.taxScheme;
        ctrl.savedValuesModel.unspscClassification = ctrl.dataModel.unspscClassification;
        ctrl.savedValuesModel.vendor = ctrl.dataModel.vendor;
        ctrl.savedValuesModel.vendorItemCode = ctrl.dataModel.vendorItemCode;

        handleEvent(RequisitionUncataloguedProductActions.onSaveCurrentValues, $event, ctrl.savedValuesModel);
      };

      ctrl.onRestoreValuesFromBackup = function($event) {
        $log.log('onRestoreValuesFromBackup called...');

        if ($event) {
          $event.preventDefault();
        }

        if (!_.isNil(ctrl.savedValuesModel)) {

          isApplyingSavedValues = true;
          ctrl.dataModel.account = ctrl.savedValuesModel.account;

          // Special handling for projet activity account ID parameter mandatory for ProjectActivity auto complete...
          if (!_.isNil(ctrl.dataModel.account)) {
            ctrl.projectActivityAccountId = ctrl.dataModel.account.id;
          } else {
            ctrl.projectActivityAccountId = null;
          }

          ctrl.dataModel.buyer = ctrl.savedValuesModel.buyer;
          ctrl.dataModel.class = ctrl.savedValuesModel.class;
          ctrl.dataModel.cost = ctrl.savedValuesModel.cost;
          ctrl.dataModel.description = ctrl.savedValuesModel.description;
          ctrl.dataModel.distributionUnit = ctrl.savedValuesModel.distributionUnit;
          ctrl.dataModel.family = ctrl.savedValuesModel.family;
          ctrl.dataModel.noteForBuyer = ctrl.savedValuesModel.noteForBuyer;
          ctrl.dataModel.notifyBuyerToCreateProduct = ctrl.savedValuesModel.notifyBuyerToCreateProduct;
          ctrl.dataModel.projectActivity = ctrl.savedValuesModel.projectActivity;
          ctrl.dataModel.quantity = ctrl.savedValuesModel.quantity;
          ctrl.dataModel.secondaryCode = ctrl.savedValuesModel.secondaryCode;
          ctrl.dataModel.segment = ctrl.savedValuesModel.segment;
          ctrl.dataModel.statisticalUnit = ctrl.savedValuesModel.statisticalUnit;
          ctrl.dataModel.taxScheme = ctrl.savedValuesModel.taxScheme;
          ctrl.dataModel.unspscClassification = ctrl.savedValuesModel.unspscClassification;
          ctrl.dataModel.vendor = ctrl.savedValuesModel.vendor;
          ctrl.dataModel.vendorItemCode = ctrl.savedValuesModel.vendorItemCode;

          $scope.requisitionUncataloguedProductForm.$setPristine();

          $timeout(function onTimeout() {
            isApplyingSavedValues = false;
          }, 1000);
        }
      };

      ctrl.onSelectVendor = function () {
        if (!_.isNil(ctrl.dataModel.vendor)) {
          fetchDefaultValues('vendor');
        }
      };

      ctrl.onSelectSegment = function () {
        if (!_.isNil(ctrl.dataModel.segment)) {
          fetchDefaultValues('segment');
        }
      };

      ctrl.onSelectFamily = function () {
        if (!_.isNil(ctrl.dataModel.family)) {
          fetchDefaultValues('family');
        }
      };

      ctrl.onSelectClass = function () {
        if (!_.isNil(ctrl.dataModel.class)) {
          fetchDefaultValues('class');
        }
      };

      //
      // Conditional expressions section...
      //

      ctrl.isStatisticalUnitSet = function isStatisticalUnitSet() {
        return !_.isNil(ctrl.dataModel.statisticalUnit);
      };

      ctrl.isAccountSet = function isAccountSet() {
        return !_.isNil(ctrl.dataModel.account);
      };

      ctrl.isUnspscClassificationSet = function isUnspscClassificationSet() {
        return !_.isNil(ctrl.dataModel.unspscClassification);
      };

      // Action buttons availability
      ctrl.isRestoreValuesActionHidden = function isRestoreValuesActionHidden() {
        return ctrl.interactionMode === InteractionModes.ReadOnly;
      };

      ctrl.isRestoreValuesActionDisabled = function isRestoreValuesActionDisabled() {
        return _.isNil(ctrl.savedValuesModel) || ctrl.isSavedValuesEqualCurrentValues();
      };

      ctrl.isBackupValuesActionHidden = function isBackupValuesActionHidden() {
        return false; // always available
      };

      ctrl.isBackupValuesActionDisabled = function isBackupValuesActionDisabled() {
        return ctrl.isSavedValuesEqualCurrentValues();
      };

      ctrl.isCancelActionHidden = function isCancelActionHidden() {
        return ctrl.interactionMode === InteractionModes.ReadOnly;
      };

      ctrl.isCloseActionHidden = function isCloseActionHidden() {
        return ctrl.interactionMode !== InteractionModes.ReadOnly;
      };

      ctrl.isConfirmAddActionHidden = function isConfirmAddActionHidden() {
        return ctrl.interactionMode === InteractionModes.ReadOnly || ctrl.interactionMode === InteractionModes.Edit;
      };

      ctrl.isConfirmAddActionDisabled = function isConfirmAddActionDisabled() {
        // Confirm is enabled when form is dirty AND valid
        return $scope.requisitionUncataloguedProductForm.$pristine || $scope.requisitionUncataloguedProductForm.$invalid;
      };

      ctrl.isConfirmAddAndCloseActionHidden = function isConfirmAddAndCloseActionHidden() {
        return ctrl.interactionMode === InteractionModes.ReadOnly || ctrl.interactionMode === InteractionModes.Edit;
      };

      ctrl.isConfirmAddAndCloseActionDisabled = function isConfirmAddAndCloseActionDisabled() {
        // Confirm is enabled when form is dirty AND valid
        return $scope.requisitionUncataloguedProductForm.$pristine || $scope.requisitionUncataloguedProductForm.$invalid;
      };

      ctrl.isConfirmEditActionHidden = function isConfirmEditActionHidden() {
        return ctrl.interactionMode !== InteractionModes.Edit;
      };

      ctrl.isConfirmEditActionDisabled = function isConfirmEditActionDisabled() {
        return $scope.requisitionUncataloguedProductForm.$pristine || $scope.requisitionUncataloguedProductForm.$invalid;
      };

      //
      // Event handlers section
      //
      ctrl.onActionConfirmEdit = function onActionConfirmEdit($event) {
        handleEvent(RequisitionUncataloguedProductActions.onEditProduct, $event);
      };

      ctrl.onActionAdd = function onActionAdd($event) {
        handleEvent(RequisitionUncataloguedProductActions.onAddProduct, $event);
      };

      ctrl.onActionAddAndClose = function onActionAddAndClose($event) {
        handleEvent(RequisitionUncataloguedProductActions.onAddProductAndClose, $event);
      };

      ctrl.onActionCancel = function onActionCancel($event) {
        handleEvent(RequisitionUncataloguedProductActions.onCancelProductEdition, $event);
      };

      ctrl.onActionClose = function onActionClose($event) {
        handleEvent(RequisitionUncataloguedProductActions.onClosePrestine, $event);
      };
    }
  }
)();
