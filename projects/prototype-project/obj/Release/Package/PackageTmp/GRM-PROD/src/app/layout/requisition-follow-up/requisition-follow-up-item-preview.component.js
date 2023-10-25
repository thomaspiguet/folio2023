(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-follow-up')
      .component('requisitionFollowUpItemPreview', requisitionFollowUpItemPreview())
    ;

    function requisitionFollowUpItemPreview() {
      return {
        templateUrl: 'requisition-follow-up-item-preview.template.html',
        controller: RequisitionFollowUpItemPreviewController,
        bindings: {
          close: '&',
          dismiss: '&',
          modalInstance: '<',
          resolve: '<'
        }
      };
    }

    /* @ngInject */
    function RequisitionFollowUpItemPreviewController($log, DynamicLookupService, PopupService, RequisitionFollowUpApiService, DateHelperService) {
      var self = this;

      self.$onInit = function onInit() {
        self.model = {
          pos: self.resolve.pos,
          items: self.resolve.items,
          item: self.resolve.item,
          selectionChangeCallback: self.resolve.callbacks.selectionChangeCallback || function noop(index) { $log.log(index); }
        };
        self.model.items[self.model.pos].requisitionFollowUpItem = self.model.item;
        self.model.items[self.model.pos].requisitionFollowUpItem.inChargeDelay = DateHelperService.getDelayBetweenDates(self.model.items[self.model.pos].requisitionFollowUpItem.personInChargeLastChange);
      };

      self.onPrevious = function onPrevious($event) {
        if (self.model.pos > 0) {
          self.model.pos--;
        }

        if (_.isNil(self.model.items[self.model.pos].requisitionFollowUpItem)) {
          fetchItem(); // TODO: always fetch?
        } else {
          self.model.items[self.model.pos].requisitionFollowUpItem.inChargeDelay = DateHelperService.getDelayBetweenDates(self.model.items[self.model.pos].requisitionFollowUpItem.personInChargeLastChange);
        }

        self.model.selectionChangeCallback(self.model.pos);
      };

      self.isPreviousDisabled = function isPreviousDisabled() {
        if (_.isNil(self.model)) {
          return true;
        }
        return self.model.pos <= 0;
      };

      self.onNext = function onNext($event) {
        if (self.model.pos + 1 < self.model.items.length) {
          self.model.pos++;
        }

        if (_.isNil(self.model.items[self.model.pos].requisitionFollowUpItem)) {
          fetchItem(); // TODO: always fetch?
        } else {
          self.model.items[self.model.pos].requisitionFollowUpItem.inChargeDelay = DateHelperService.getDelayBetweenDates(self.model.items[self.model.pos].requisitionFollowUpItem.personInChargeLastChange);
        }

        self.model.selectionChangeCallback(self.model.pos);
      };

      self.isNextDisabled = function isNextDisabled() {
        if (_.isNil(self.model)) {
          return true;
        }
        return self.model.pos + 1 >= self.model.items.length;
      };

      self.currentItem = function currentItem() {
        return self.model.items[self.model.pos].requisitionFollowUpItem;
      };

      self.onClose = function onClose($event) {
        self.modalInstance.close();
      };

      self.showNonCataloguedInfo = function showNonCataloguedInfo() {
        var res = false;
        var currentItem = self.currentItem();
        if (!_.isNil(currentItem)) {
          if (!_.isNil(currentItem.noteToBuyer) || !_.isNil(currentItem.noteToRequester)) {
            if (!_.isNil(currentItem.status)) {
              if (currentItem.status === DynamicLookupService.getRequisitionItemStatuses()._1.code ||
                    currentItem.status === DynamicLookupService.getRequisitionItemStatuses()._2A.code ||
                    currentItem.status === DynamicLookupService.getRequisitionItemStatuses()._2B.code ||
                    currentItem.status === DynamicLookupService.getRequisitionItemStatuses()._2C.code) {
                res = true;
              }
            }
          }
        }

        return res;
      };

      function fetchItem() {
        RequisitionFollowUpApiService
          .getFollowUpItem({
            requisitionItemId: self.model.items[self.model.pos].requisitionItemId,
            expanded: true,
            blockUI: true,
            showSpinner: true
          })
          .then(
            function success(response) {
              self.model.items[self.model.pos].requisitionFollowUpItem = response;
              self.model.items[self.model.pos].requisitionFollowUpItem.inChargeDelay = DateHelperService.getDelayBetweenDates(self.model.items[self.model.pos].requisitionFollowUpItem.personInChargeLastChange);
            },
            function failure(reason) {
              PopupService.error({
                error: reason,
                translateContent: false
              });
            }
          )
        ;
      }
    }
  }
)();
