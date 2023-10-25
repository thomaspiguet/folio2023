(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-item-tabs')
      .component('requisitionItemTabs', requisitionItemTabs())
    ;

    function requisitionItemTabs() {
      var cdo = {
        templateUrl: 'requisition-item-tabs.template.html',
        controller: RequisitionItemTabsController,
        bindings: {
          actionHandler: '&',
          editHandler: '&',
          requisitionItemTabsModel: '<model',
          stateModel: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionItemTabsController($log, AccountApiService, InteractionModes, RequisitionItemTabsActions) {
      var ctrl = this;

      // ----------------
      // life cycle hooks
      //
      this.$onInit = function onInit() {
        ctrl.model = ctrl.requisitionItemTabsModel.clone();
        ctrl.authorizationsPagedList = [];
        ctrl.authorizationsCompleteList = [];
        ctrl.nbAuthorizationsPerPage = 4;
        ctrl.currentTab = 0;

        bindAuthorizations();
      };

      this.$onChanges = function onChanges(changesObj) {
        ctrl.model = ctrl.requisitionItemTabsModel.clone();
        bindAuthorizations();
      };

      // -----
      // utils
      //
      this.notifyModelChange = function notifyModelChange() {
        ctrl.editHandler({
          obj: {
            model: ctrl.model
          }
        });
      };

      this.onSelectTab = function onSelectTab($event, which) {
        if (which !== ctrl.currentTab) {
          ctrl.currentTab = which;

          if (4 === which) {
            ctrl.actionHandler({
              obj: {
                action: RequisitionItemTabsActions.onSelectAuthorizationsTab
              }
            });
          }
        }
      };

      this.onDeselectTab = function onDeselectTab($event, which) {
        if (4 === ctrl.currentTab) {
          ctrl.actionHandler({
            obj: {
              action: RequisitionItemTabsActions.onDeselectAuthorizationsTab
            }
          });
        }
      };

      // -----------
      // product tab
      //
      this.getStoreSiteId = function getStoreSiteId() {
        return ctrl.model.isMsiProduct ? null : ctrl.model.headerSiteId;
      };

      this.storeChange = function storeChange() {

        if (ctrl.state === InteractionModes.ReadOnly) {
          return;
        }

        // As long as current item
        if (!_.isNil(ctrl.model.uuid)) {
          // Whenever item store is changed, advises container...
          if (!_.isNil(ctrl.model.store)) {
            ctrl.actionHandler({
              obj: {
                action: RequisitionItemTabsActions.onStoreChanged,
                storeId: ctrl.model.store.id,
                uuid: ctrl.model.uuid
              }
            });
          }
          else {
            ctrl.model.store = undefined;
            ctrl.notifyModelChange();
          }
        }
      };

      this.accountChange = function accountChange() {

        // TODO - all this has to move up to the business logic layer

        if (ctrl.state === InteractionModes.ReadOnly) {
          return;
        }

        //TODO : AccountApiService is deprecated, please use allowFetchDefaultProjectActivity instead
        if (!_.isNil(ctrl.model.account)) {
          AccountApiService
            .getDefaultProjectActivitiy(ctrl.model.account.id)
            .then(
              function success(result) {
                ctrl.model.projectActivity = result ? result : undefined;
                ctrl.notifyModelChange();
              }
            );
        }
        else {
          ctrl.model.projectActivity = undefined;
          ctrl.notifyModelChange();
        }
      };

      // Product consumption stats display toggler
      this.onViewConsumptionStatisticsForProduct = function onViewConsumptionStatisticsForProduct($event) {
        if ($event) {
          $event.preventDefault();
        }
        ctrl.actionHandler({
          obj: {
            action: RequisitionItemTabsActions.onViewConsumptionStatisticsForProduct,
            requisitionItemUuid: ctrl.model.uuid
          }
        });
      };

      // ------------------
      // authorizations tab
      //
      function bindAuthorizations() {
        ctrl.authorizationsCompleteList = ctrl.model.authorizations;
      }

      // ----------------
      // fixed assets tab
      //
      this.onAcquisitionTypeChange = function onAcquisitionTypeChange() {
        ctrl.notifyModelChange();
      };
      this.onAcquisitionReasonChange = function onAcquisitionReasonChange() {
        ctrl.notifyModelChange();
      };
      this.onModelNumberChange = function onModelNumberChange() {
        ctrl.notifyModelChange();
      };
    }
  }
)();
