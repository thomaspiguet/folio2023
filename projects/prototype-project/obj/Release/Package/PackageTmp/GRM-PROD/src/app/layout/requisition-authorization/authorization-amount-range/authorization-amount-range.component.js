(
  function () {
    'use strict';

    angular
      .module('app.layout.requisition-authorization.authorization-amount-range')
      .component('authorizationAmountRange', authorizationAmountRange())
      ;

    function authorizationAmountRange() {
      var cdo = {
        templateUrl: 'authorization-amount-range.template.html',
        controller: AuthorizationAmountRangeController,
        bindings: {
          model: '<',
          actionHandler: '&'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function AuthorizationAmountRangeController(
      $filter,
      $log,
      $timeout,
      AuthorizationAmountRangeActions,
      NotificationHandler
    ) {
      var self = this;
      self.dataModel = undefined;

      self.$onInit = function $onInit() {
        self.dataModel = self.model.clone();
      };

      self.$onChanges = function $onChanges(changesObj) {
        if (changesObj.model) {
          if (changesObj.model.currentValue && changesObj.model.currentValue !== changesObj.model.previousValue) {
            self.dataModel = changesObj.model.currentValue.clone();
          }
        }
      };

      // Click handler for amount ranger items
      self.onRangeClick = function($event, range) {
        if ($event) {
          $event.preventDefault();
        }

        range.selected = !range.selected;

        // emit event up to dispatcher...
        self.actionHandler({
          obj: {
            action: AuthorizationAmountRangeActions.onRangeSelectedChanged,
            model: self.dataModel
          }
        });

        $log.log('OnRangeClick');
      };

      // Click handler for technical groups items
      self.onTechnicalClick = function($event) {
        if ($event) {
          $event.preventDefault();
        }

        // Flip technical selected state
        self.dataModel.technicalsSelected = !self.dataModel.technicalsSelected;

        // emit event up to dispatcher...
        self.actionHandler({
          obj: {
            action: AuthorizationAmountRangeActions.onTechnicalsSelectedChanged,
            model: self.dataModel
          }
        });

        $log.log('onTechnicalClick');
      };

      self.hasCountData = function() {
        return self.dataModel && self.dataModel.amountRanges && self.dataModel.amountRanges.length > 0;
      };

      self.getDisplayRangeAmount = function(range) {
        return getMinimumDisplayAmount(range) + getAmountSeparator(range) + getMaximumDisplayAmount(range);
      };

      function getMinimumDisplayAmount(range) {
        return $filter('currency')(range.minimumAmount, undefined, 0);
      }

      function getAmountSeparator(range) {
        if (isLastRange(range)) {
          return ' ';
        }
        return ' - ';
      }

      function getMaximumDisplayAmount(range) {
        // If we got the last range in the collection, assume maximum amount
        // to be "infinite" and rather return the '+' sign...
        if (isLastRange(range)) {
          return '+';
        }
        return $filter('currency')(Math.trunc(range.maximumAmount), undefined, 0);
      }

      function isLastRange(range) {
        var indexOfCurrent = _.findIndex(self.dataModel.amountRanges, function(item) {
          return item.id === range.id;
        });

        if (indexOfCurrent === (self.dataModel.amountRanges.length - 1)) {
          return true;
        }
        return false;
      }
    }
  })();
