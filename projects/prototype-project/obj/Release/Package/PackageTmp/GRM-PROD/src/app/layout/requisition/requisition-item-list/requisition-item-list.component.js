(
  function () {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-item-list')
      .component('requisitionItemList', requisitionItemList())
      ;

    function requisitionItemList() {
      var cdo = {
        templateUrl: 'requisition-item-list.template.html',
        controller: RequisitionItemListController,
        bindings: {
          model: '<',
          stateModel: '<',
          actionHandler: '&',
          editHandler: '&',
          modelRecomputeTriggerWatch: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionItemListController(
      $filter,
      $log,
      $timeout,
      NotificationHandler,
      RequisitionItemListActions
    ) {
      var self = this;
      var oldFormatRelationBeforeDueDateChange;

      // Data model instance
      self.dataModel = undefined;

      // Initialization handler
      self.$onInit = function () {
        self.dataModel = self.model.clone();
      };

      // Bindings change notification handler
      self.$onChanges = function (changes) {
        self.dataModel = self.model.clone();

        // Whenever recomputing of internal model is triggered,
        // recalculate quantity
        if (!_.isNil(changes.modelRecomputeTriggerWatch) &&
          changes.modelRecomputeTriggerWatch.previousValue !== changes.modelRecomputeTriggerWatch.currentValue &&
          !_.isNil(changes.modelRecomputeTriggerWatch.currentValue)) {
          // Get current item from internal
          var item = _.find(self.dataModel.requisitionItems, function finder(ri) { return ri.uuid === self.dataModel.requisitionItemUuid; });
          // Make sure item is a valid item since modelRecomputeTriggerWatch should never change
          // unless the current item is refreshed from the outside
          if (!_.isNil(item)) {
            if (!_.isNil(item.code)) {
              recomputeQuantityFromFormat(item);
            } else {
              $log.warn('ItemList model recomputing triggered but no item found... Should never happens !');
            }
          } else {
            $log.warn('ItemList model recomputing triggered but no item found... Should never happens !');
          }
        }
      };

      //DOM related functions
      self.$postLink = function() {
        //Jquery here .. no angular way to scroll just inside a container ..
        self.scrollTo = function scrollTo(top) {
          var tbody = new Clay('#requisition-item-table tbody');
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

        self.setFocus = function setFocus($index, itemPrefix) {
          var productCodeInput = angular.element('#code_' + $index);
          productCodeInput.focus();
        };

        self.scrollToAndFocus = function scrollToAndFocus($index, $last, item) {
          if (!_.isNil(self.model.requisitionItemUuid)) {
            if (item.uuid === self.model.requisitionItemUuid) {
              self.selectedIndex = $index;
            }
          }

          if ($last) {
            //We don't have selected item
            if (_.isNil(self.model.requisitionItemUuid)) {
              self.scrollTo(true);//Scroll to top of the table
              return;
            }

            //Wait until angular cycle finshed and item id rendered in DOM
            $timeout(function () {
              // Get current item from internal
              var item = _.find(self.model.requisitionItems, function finder(ri) { return ri.uuid === self.model.requisitionItemUuid; });

              //If is a new line we put focus on it
              if (_.isNil(item.code)) {
                self.scrollTo();
                self.setFocus($index);
              } else {
                //Scroll the element with id into the visible area of the browser window
                self.scrollToItemId(_.isNil(self.selectedIndex) ? $index : self.selectedIndex);
              }
            });
          }
        };
      };

      self.scrollToItemId = function scrollToSelected($index) {
        var tbody = new Clay('#requisition-item-table tbody');
        var scrollingContainer = angular.element(tbody.selector);
        var selectedRow = scrollingContainer.find('tr#itemLine_' + $index + ':first');
        if (_.isNil(selectedRow) || 0 === selectedRow.length) {
          scrollingContainer.scrollTop(0);
        } else {
          scrollingContainer.scrollTop(selectedRow.position().top);
        }
      };

      // ----------------------------
      // Field states helpers - begin

      self.isDisabled = function isDisabled(item, prop) {
        var pos = self.dataModel.requisitionItems.indexOf(item);
        if (pos > -1 && self.stateModel.requisitionItemStates[pos]) {
          return self.stateModel.requisitionItemStates[pos][prop].disabled;
        }
        return false;
      };

      self.isHidden = function isHidden(item, prop) {
        var pos = self.dataModel.requisitionItems.indexOf(item);
        if (pos > -1 && self.stateModel.requisitionItemStates[pos]) {
          return self.stateModel.requisitionItemStates[pos][prop].hidden;
        }
        return false;
      };

      self.isRequired = function isRequired(item, prop) {
        var pos = self.dataModel.requisitionItems.indexOf(item);
        if (pos > -1 && self.stateModel.requisitionItemStates[pos]) {
          return self.stateModel.requisitionItemStates[pos][prop].required;
        }
        return false;
      };

      self.getValidations = function getValidations(item, prop) {
        var pos = self.dataModel.requisitionItems.indexOf(item);
        if (pos > -1 && self.stateModel.requisitionItemStates[pos]) {
          return self.stateModel.requisitionItemStates[pos][prop].validations;
        }
        return false;
      };

      self.productCodeAlreadyEntered = function productCodeAlreadyEntered(value, item) {
        //always considers valid if item has an id or new line.
        if (_.isNil(value) || !_.isNil(item.id)) {
          return false;
        }
        return _.filter(self.dataModel.requisitionItems, function(o) {
          return o.code === value && !_.isNil(o.type);
        }).length >= 1;
      };

      // Field states helpers - end
      // ---------------------------

      self.onEditUncataloguedProduct = function onEditUncataloguedProduct($event, item) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: RequisitionItemListActions.onEditUncataloguedProductItem,
            uuid: item.uuid
          }
        });
      };

      // Quantity change handler
      self.onQuantityChange = function onQuantityChange(item) {
        if (_.isNil(item.code) && !item.isUncataloguedProduct) {
          item.quantity = undefined;
          return;
        }

        if (_.isNil(item.quantity)) {
          item.quantity = 0;
        } else {
          recomputeQuantityFromFormat(item);
        }
      };

      // Quantity change handler
      self.onDueDateChange = function onDueDateChange(item) {
        oldFormatRelationBeforeDueDateChange = item.formatRelation;
        if (!_.isNil(item.dueDate) && !_.isNil(item.uuid)) {
          self.actionHandler({
              obj: {
                action: RequisitionItemListActions.onItemDueDateChanged,
                dueDate: item.dueDate,
                uuid: item.uuid
              }
            });
         }
        $log.log('due date changed');

        self.editHandler({
          obj: {
            model: self.dataModel
          }
        });
      };

      // Whether or not the given item is selected
      self.isItemSelected = function isItemSelected(item) {
        return self.dataModel.requisitionItemUuid === item.uuid;
      };

      // Product code change handler
      self.onProductCodeChange = function onProductCodeChange(item) {
        var requisitionItem = _.find(self.dataModel.requisitionItems, function finder(ri) { return ri.uuid === item.uuid; });
        if (!_.isNil(requisitionItem)) {
          if (!_.isNil(requisitionItem.code)) {
            requisitionItem.code = $filter('alphaNumeric')(requisitionItem.code);

            // TODO check that value is present only once

            self.actionHandler({
              obj: {
                action: RequisitionItemListActions.onSearchProductInfo,
                requisitionItemUuid: requisitionItem.uuid,
                productCode: requisitionItem.code
              }
            });
          }
        }
      };

      // Add button action handler
      self.onAddLine = function onAddLine($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: RequisitionItemListActions.onAddRequisitionItem
          }
        });
      };

      // Select product line handler
      self.onSelectProductLine = function onSelectProductLine($event, item) {
        if ($event) {
          $event.preventDefault();
        }

        if (self.dataModel.requisitionItemUuid === item.uuid) {
          return;
        }

        // report action
        self.actionHandler({
          obj: {
            action: RequisitionItemListActions.onSelectRequisitionItem,
            requisitionItemUuid: item.uuid
          }
        });
      };

      // Delete button action handler
      self.onDeleteLine = function onDeleteLine($event, item) {
        if ($event) {
          $event.preventDefault();

          // Prevent other handlers and also parent handlers
          $event.stopImmediatePropagation();
        }

        self.actionHandler({
          obj: {
            action: RequisitionItemListActions.onRemoveRequisitionItem,
            requisitionItemUuid: item.uuid
          }
        });
      };

      // Whether or not to display the shadow item line
      self.showShadowListItem = function showShadowListItem() {
        return self.dataModel.requisitionItems.length === 0;
      };

      // Search products handler
      self.onSearchProducts = function onSearchProducts($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: RequisitionItemListActions.onSearchProducts
          }
        });
      };

      // Non catalogued creation handler
      self.onCreateUncataloguedProduct = function onCreateUncataloguedProduct($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: RequisitionItemListActions.onCreateUncataloguedProduct
          }
        });
      };

      /**
       * Recompute item quantity based on its format and multiple and advise user if the quantity
       * reaches the quantity in alert.
       * @param {oject} item Requisition item to recalculate quantity for
       */
      function recomputeQuantityFromFormat(item) {
        // Here, special processing when format relation changed since the last quantity
        // calculation, where final quantity must be consistant from the previous format
        // relation to the current format relation.
        //
        // ex: before change: quantity = 10, format = box of 10 units,  total = 100 units
        //     after change:  quantity = 1,  format = box of 100 units, total = 100 units (preserve quantity)
        //                    ------------                                                -------------------
        //
        if (!_.isNil(oldFormatRelationBeforeDueDateChange) && oldFormatRelationBeforeDueDateChange !== item.formatRelation) {
          $log.log('Previous format relation was set...');
          // Just in case formatRelation would get null/undefined...
          if (!_.isNil(item.formatRelation)) {
            var currentQty = item.quantity;
            // Make sure we get the same total of items...
            item.quantity = (item.quantity * oldFormatRelationBeforeDueDateChange) / item.formatRelation;

            // Advise user whenever quantity gets different...
            if (item.quantity !== currentQty) {
              NotificationHandler.warn({
                  messageOrKey: 'requisitionItemQuantityRecalculatedAlert',
                  translate: true
              });
            }
          } else {
            $log.warn('RequisitionItemList_Component: Quantity got updated and formatRelation got to null!');
          }
          oldFormatRelationBeforeDueDateChange = null;
        }

        //Adjust quantity if there's a "multiple" set for the store (or if it is a distribution center product)
        if (!_.isNil(item.multiple)) {
          item.quantity = adjustQuantityWithMultiple(item.quantity, item.multiple);
        }
        else if (!_.isNil(item.quantity)) {
          item.quantity = Math.round(item.quantity * 1000) / 1000;
        }

        // TODO move this to business logic ??
        if (item.type === 'I' && !_.isNil(item.distributionUnitQtyInAlert)) {
          if (item.quantity > item.distributionUnitQtyInAlert) {
            NotificationHandler.warn({
              messageOrKey: 'requisitionQtyInAlert',
              params: item.distributionUnitQtyInAlert,
              translate: true
            });
          }
        }

        self.editHandler({
          obj: {
            model: self.dataModel
          }
        });
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
    }
  })();
