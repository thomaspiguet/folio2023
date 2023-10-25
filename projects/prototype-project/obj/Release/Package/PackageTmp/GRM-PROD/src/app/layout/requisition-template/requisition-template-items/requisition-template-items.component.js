(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template.requisition-template-items')
      .component('requisitionTemplateItems', requisitionTemplateItems())
    ;

    function requisitionTemplateItems() {
      var cdo = {
        controller: RequisitionTemplateItemsController,
        templateUrl: 'requisition-template-items.template.html',
        bindings: {
          actionHandler: '&',
          checkHandler: '&',
          editHandler: '&',
          itemsListState: '<',
          requisitionTemplateItemsModel: '<model',
          requisitionTemplateItemsStateModel: '<stateModel',
          departmentId: '<',
          siteId: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionTemplateItemsController($log,
                                                $timeout,
                                                $filter,
                                                RequisitionTemplateItemObjectService,
                                                RequisitionTemplateItemsActions,
                                                RequisitionTemplateItemsStates,
                                                NotificationHandler,
                                                InteractionModes,
                                                SystemLookupService,
                                                FormService) {

      var CONST_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

      var ctrl = this;

      this.stateModel = undefined;
      this.model = undefined;
      this.currentIndex = 0;
      this.scheduleVisible = true;
      this.$onInit = function onInit() {
        syncModels();
      };

      this.$onChanges = function onChanges(changesObj) {
        syncModels();
      };

      //DOM related functions
      this.$postLink = function() {
        //Jquery here .. no angular way to scroll just inside a container ..
        ctrl.scrollTo = function scrollTo(top) {
          var tbody = new Clay('#requisition-template-item-table tbody');
          var scrollingContainer = angular.element(tbody.selector);
          var scrollHeight;
          if (!_.isNil(top) && top) {
            //Scroll to top
            scrollHeight = 0;
          }
          else {
            //Scroll to bottom
            scrollHeight = scrollingContainer[0].scrollHeight;
          }
          scrollingContainer.scrollTop(scrollHeight);
        };

        ctrl.setFocus = function setFocus($index, itemPrefix) {
          var productCodeInput = angular.element('#code_' + $index);
          productCodeInput.focus();
        };

        ctrl.setFocusOnQuantity = function setFocus($index) {
          var quantityElement = angular.element('#quantity_' + $index);
          quantityElement.focus();
        };

        ctrl.scrollToAndFocus = function scrollToAndFocus($index, $last) {
          if ($last) {
            //We don't have selected item
            if (_.isNil(ctrl.model.requisitionTemplateItem))
            {
              ctrl.scrollTo(true);//Scroll to top of the table
              return;
            }

            //Wait until angular cycle finshed and item id rendered in DOM
            $timeout(function () {
              //If is a new line we put focus on it
              if (_.isNil(ctrl.model.requisitionTemplateItem.id)) {
                ctrl.scrollTo();
                ctrl.setFocus($index);
              } else {
                //Scroll the element with id into the visible area of the browser window
                ctrl.scrollToItemId(ctrl.model.requisitionTemplateItem.id);
              }
            });
          }
        };
      };

      ctrl.scrollToItemId = function scrollToSelected(iid) {
        var tbody = new Clay('#requisition-template-item-table tbody');
        var scrollingContainer = angular.element(tbody.selector);
        var selectedRow = scrollingContainer.find('tr#item' + iid + ':first');
        if (_.isNil(selectedRow)) {
          scrollingContainer.scrollTop(0);
        } else {
          scrollingContainer.scrollTop(selectedRow.position().top);
        }
      };

      ctrl.getFrequency = function getFrequency(item) {
        // Get localized frequency string from system lookup service
        return SystemLookupService.requisitionTemplateAutoGenerationFrequencies.getDescriptionById(item.frequencyId);
      };

      //Filters******
      // Filter the code input so only alphanum characters are allowed
      this.alphaNumOnlyCode = function alphaNumOnlyCode() {
        if (!_.isNil(ctrl.model.requisitionTemplateItem.code)) {
          ctrl.model.requisitionTemplateItem.code = $filter('alphaNumeric')(ctrl.model.requisitionTemplateItem.code);
        }
      };

      //Filter the line number so only numeric characters are allowed
      this.numOnlyLineNumber = function numOnlyLineNumber() {
        if (!_.isNil(ctrl.model.requisitionTemplateItem.lineNumber)) {
          ctrl.model.requisitionTemplateItem.lineNumber = $filter('numeric')(ctrl.model.requisitionTemplateItem.lineNumber);
        }
      };

      //******
      this.storeChange = function storeChange() {
        if (!_.isNil(ctrl.model.requisitionTemplateItem)) {

          if ((_.isNil(ctrl.model.requisitionTemplateItem.store) ? undefined : ctrl.model.requisitionTemplateItem.store.id) !==
          (_.isNil(ctrl.model.requisitionTemplateItem.storeDB) ? undefined : ctrl.model.requisitionTemplateItem.storeDB.id)) {

            if ((!_.isNil(ctrl.model.requisitionTemplateItem.store) && ctrl.model.requisitionTemplateItem.productType === 'I') ||
            (_.isNil(ctrl.model.requisitionTemplateItem.store) && ctrl.model.requisitionTemplateItem.productType === 'D')) {

              ctrl.model.requisitionTemplateItem.storeDB = ctrl.model.requisitionTemplateItem.store;
              ctrl.actionHandler({
                  obj: {
                    action: RequisitionTemplateItemsActions.onSearchProductInfo,
                    productCode: ctrl.model.requisitionTemplateItem.code,
                    productId: ctrl.model.requisitionTemplateItem.productId,
                    storeId: _.isNil(ctrl.model.requisitionTemplateItem.store) ? undefined : ctrl.model.requisitionTemplateItem.store.id,
                    index: ctrl.currentIndex
                  }
                }).then(function () {
                /*If productInfo is called with success, and product type is "Inventory", we need to recalculate quantity (if specified), in case store multiple has changed.
                  We also need to reverify if the new calculated quantity exceed the maximum quantity in alert for the new store.*/
                  if (ctrl.model.requisitionTemplateItem.productType === 'I') {
                    var item = ctrl.model.requisitionTemplateItem;
                    if (!_.isNil(item.quantity)) {
                      item.quantity = adjustQuantityWithMultiple(item.quantity, item.multiple);
                      checkForQuantityInAlert(item);
                      notifyModelChanged();
                    }
                  }
                });

            } else {
              notifyModelChanged();
            }
          }
        }
      };

      // Whether or not the given item is selected
      this.isItemSelected = function isItemSelected(item) {
        return ctrl.model.requisitionTemplateItem === item;
      };

      //Private functions
      function notifyModelChanged() {
        ctrl.editHandler({
          obj: {
            model: ctrl.model
          }
        });
      }

      function syncModels() {
        ctrl.model =  ctrl.requisitionTemplateItemsModel.clone();
        ctrl.stateModel = ctrl.requisitionTemplateItemsStateModel;
      }

      //TODO : It is a good idea to create a more generic helper function instead, and reuse that functionality where it is needed.
      function adjustQuantityWithMultiple(qty, multiple) {
        var adjustedQty = qty;
        if (!_.isNil(multiple)) {
          if (adjustedQty % multiple !== 0) {
            var integer = Math.floor(adjustedQty / multiple) * multiple;
            var rest = adjustedQty % multiple;
            if (rest >= (multiple / 2)) {
                adjustedQty = integer + multiple;
            }
            else {
              adjustedQty = integer;
              if (adjustedQty === 0) {
                adjustedQty = integer + multiple;
              }
            }
          }
        }
        return adjustedQty;
      }

      this.showShadowListItem = function showShadowListItem() {
        return ctrl.model.requisitionTemplateItems.length === 0;
      };

      /**
       * Toggle current Frequency in a cyclic manner. Always gets the next
       * frequency until the last available, after which it falls back to the
       * first frequency.
       */
      ctrl.toggleFrequency = function toggleFrequency(item, index) {
        // Find frequency array index that fits with the current frequency Id
        var i = _.findIndex(SystemLookupService.requisitionTemplateAutoGenerationFrequencies, function(f) {
          return f.id === item.frequencyId;
        });

        // Just make sure we found it...
        if (i >= 0 && i < SystemLookupService.requisitionTemplateAutoGenerationFrequencies.length) {
          $log.info('toggle of frequency.');
          ++i;
          if (i >= SystemLookupService.requisitionTemplateAutoGenerationFrequencies.length) {
            i = 0;
          }

          // Whenever frequency is not None, make sure quantity is defined
          if (i > 0 && _.isNil(item.quantity)) {
            item.quantity = 0;
            ctrl.setFocusOnQuantity(index);
          }

          ctrl.model.requisitionTemplateItem.frequencyId = SystemLookupService.requisitionTemplateAutoGenerationFrequencies[i].id;
          FormService.setDirty();
          notifyModelChanged();
        } else {
          // Never supposed to happen !
          $log.error('Unable to find Frequency index for id: ' + item.frequencyId + ' !');
        }
      };

      ctrl.toggleDayActivation = function toggleDayActivation(dayIndex, item) {
        // Just make sure item properties for days of week got the names
        // defined in CONST_DAYS...
        if (!_.isNil(item[CONST_DAYS[dayIndex]])) {
          //item[CONST_DAYS[dayIndex]] = !item[CONST_DAYS[dayIndex]];
          ctrl.model.requisitionTemplateItem[CONST_DAYS[dayIndex]] = !ctrl.model.requisitionTemplateItem[CONST_DAYS[dayIndex]];
          FormService.setDirty();
          notifyModelChanged();
        } else {
          $log.error('Property \'' + CONST_DAYS[dayIndex] + '\' not found in current item structure!');
        }
      };

      function isAnyDaySelected(item) {
        return item[CONST_DAYS[0]] ||
        item[CONST_DAYS[1]] ||
        item[CONST_DAYS[2]] ||
        item[CONST_DAYS[3]] ||
        item[CONST_DAYS[4]] ||
        item[CONST_DAYS[5]] ||
        item[CONST_DAYS[6]];
      }

      ctrl.isQuantityRequired = function isQuantityRequired(item) {
        return item.frequencyId > 1;
      };

      ctrl.isScheduleFrequencyDisabled = function isScheduleFrequencyDisabled(item) {
        if (_.isNil(item.productType) || item.productType === 'D') { //|| !isAnyDaySelected(item)) {
          return true;
        }

        return ctrl.stateModel.scheduleFrequency.disabled;
      };

      ctrl.isScheduleDayDisabled = function isScheduleDayDisabled(item) {
        if (_.isNil(item.productType) || item.productType === 'D') {
          return true;
        }

        return ctrl.stateModel.scheduleDay.disabled;
      };

      this.showInvalidityReason = function showInvalidityReason(item) {
        if (!_.isNil(item)) {
          if (!_.isNil(item.invalidityReason) && item.invalidityReason !== '') {
            return true;
          }
        }
        return false;
      };

      this.isFetchingProductInfo = function isFetchingProductInfo() {
        return ctrl.itemsListState === RequisitionTemplateItemsStates.fetching;
      };

      function checkForQuantityInAlert(item) {
          if (!_.isNil(item.distributionUnitQtyInAlert)) {
            if (item.quantity > item.distributionUnitQtyInAlert) {
              NotificationHandler.info({
                messageOrKey: 'requisitionQtyInAlert',
                params: item.distributionUnitQtyInAlert
              });
            }
          }
      }

      this.onLineNumberChange = function onLineNumberChange(item) {
        //ctrl.model.requisitionTemplateItem.lineNumber = item.lineNumber;
        notifyModelChanged();
      };

      this.onQuantityChange = function onQuantityChange($index, item) {

        //Adjust quantity if there's a "multiple" set for the store (or if it is a distribution center product)
        if (!_.isNil(ctrl.model.requisitionTemplateItem.multiple)) {
          ctrl.model.requisitionTemplateItem.quantity =
          adjustQuantityWithMultiple(item.quantity,
          ctrl.model.requisitionTemplateItem.multiple);
        }
        else if (!_.isNil(item.quantity)) {
          ctrl.model.requisitionTemplateItem.quantity = Math.round(item.quantity);
        }

        notifyModelChanged();

        if (ctrl.model.requisitionTemplateItem.productType === 'I') {
          checkForQuantityInAlert(ctrl.model.requisitionTemplateItem);
        }
      };

      // Search for product info
      this.searchProductInfo = function searchProductInfo($event, $index) {
        if ($event) {
          $event.preventDefault();
        }
        // Remove product from lists is code is left empty
        if (_.isNil(ctrl.model.requisitionTemplateItems[$index].code) || _.isEmpty(ctrl.model.requisitionTemplateItems[$index].code)) {
          ctrl.model.requisitionTemplateItems[$index] = RequisitionTemplateItemObjectService.newInstance();
          ctrl.model.requisitionTemplateItem = ctrl.model.requisitionTemplateItems[$index];
          notifyModelChanged();
          return;
        }
        else {
          //ctrl.model.searching = true;
          ctrl.actionHandler({
            obj : {
              action : RequisitionTemplateItemsActions.onSearchProductInfo,
              productCode: ctrl.model.requisitionTemplateItems[$index].code,
              index: $index
            }
          });
        }
      };

      // Add button action handler
      ctrl.onAddLine = function onAddLine($event) {
        if ($event) {
          $event.preventDefault();
        }

        var length = ctrl.model.requisitionTemplateItems.push(RequisitionTemplateItemObjectService.newInstance());
        ctrl.model.requisitionTemplateItem = ctrl.model.requisitionTemplateItems[length - 1];
        //Inform parent
        ctrl.actionHandler({
          obj : {
            action : RequisitionTemplateItemsActions.onAddRequisitionTemplateItem,
            model: ctrl.model
          }
        });
      };

      ctrl.toggleSchedule = function toggleSchedule() {
        ctrl.scheduleVisible = !ctrl.scheduleVisible;
      };

      ctrl.isScheduleVisible = function isScheduleVisible() {
        return ctrl.scheduleVisible;
      };

      // Delete button action handler
      ctrl.onDeleteLine = function onDeleteLine($event, $index) {
        if ($event) {
          $event.preventDefault();
        }
        var index = $index;

        var newArray = ctrl.model.requisitionTemplateItems.splice(index, 1);
        if (newArray.length >= 1) {
          if (index === 0) {
            ctrl.model.requisitionTemplateItem = ctrl.model.requisitionTemplateItems[index];
            ctrl.setFocus(index);
          }
          else {
            index -= 1;
            ctrl.model.requisitionTemplateItem = ctrl.model.requisitionTemplateItems[index];
            ctrl.setFocus(index);
          }
        }
        else {//No more items in array
          index = undefined;
          ctrl.model.requisitionTemplateItem = undefined;
        }
        //Inform parent
        ctrl.actionHandler({
          obj : {
            action : RequisitionTemplateItemsActions.onRemoveRequisitionTemplateItem,
            model: ctrl.model
          }
        });
      };

      // Select product line handler
      this.onSelectProductLine = function onSelectProductLine($index) {
        ctrl.currentIndex = $index;
        ctrl.model.requisitionTemplateItem = ctrl.model.requisitionTemplateItems[$index];
        notifyModelChanged();

        // Useless ?
        /*ctrl.actionHandler({
          obj : {
            action : RequisitionTemplateItemsActions.onSelectRequisitionTemplateItem,
            selectedIndex: $index
          }
        });*/
      };

      ctrl.onSearchProducts = function onSearchProducts($event) {
        if ($event) {
          $event.preventDefault();
        }

        ctrl.actionHandler({
          obj: {
            action: RequisitionTemplateItemsActions.onSearchProducts
          }
        });
      };

      ctrl.hasStatusIndicators = function hasStatusIndicators() {
        if (_.isNil(ctrl.model) || _.isNil(ctrl.model.requisitionTemplateItem)) {
          return false;
        }
        return ctrl.model.requisitionTemplateItem.isMsiProduct ||
          !_.isNil(ctrl.model.requisitionTemplateItem.distributionCenterId) ||
          !_.isNil(ctrl.model.requisitionTemplateItem.crossDockingId) ||
          ctrl.model.requisitionTemplateItem.isMultipleStore ||
          ctrl.model.requisitionTemplateItem.isMultipleFormat ||
          ctrl.model.requisitionTemplateItem.isMultipleContract > 0 ||
          ctrl.model.requisitionTemplateItem.isMultipleCatalog > 0
        ;
      };
    }
  }
)();
