;(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-authorization.authorization-list')
      .component('authorizationList', authorizationList())
    ;

    function authorizationList() {
      var cdo = {
        templateUrl: 'authorization-list.template.html',
        controller: AuthorizationListController,
        bindings: {
          model: '<',
          // stateModel: '<',
          actionHandler: '&'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function AuthorizationListController(
      AuthorizationListActions
    ) {

      var self = this;

      self.dataModel = undefined;

      self.$onInit = function $onInit() {
        self.dataModel = _.cloneDeep(self.model);
      };

      self.$onChanges = function $onChanges(changesObj) {
        if (changesObj.model) {
          if (changesObj.model.currentValue !== changesObj.model.previousValue) {
            self.dataModel = _.cloneDeep(self.model);

            if (self.dataModel.selectedRowId && self.dataModel.authorizations.length) {
              // Here, make sure selected row is still part of the filtered rows prior to make it seleced.
              // It's a best effort to keep the selected row as selected after having applied a new filter...
              var selectedRow = self.dataModel.authorizations.find(function iteratee(a) { return a.authorizationGroupId === self.dataModel.selectedRowId; });
              if (selectedRow) {
                selectedRow.rowSelected = true;
              }
            }
          }
        }
      };

      self.onRowSelect = function onRowSelect($event, $index) {
        self.dataModel.authorizations.forEach(function iteratee(a, index) { a.rowSelected = index === $index; });
        self.actionHandler({
          obj: {
            action: AuthorizationListActions.onRowSelection,
            payload: {
              selectedRowId: self.dataModel.authorizations.find(function iteratee(a) { return true === a.rowSelected; }).authorizationGroupId
            }
          }
        });
      };

      self.onScrollAuthorizationList = function onScrollAuthorizationList(scrollPosition) {
        self.actionHandler({
          obj: {
            action: AuthorizationListActions.onScrollAuthorizationList,
            payload: {
              scrollPosition: scrollPosition
            }
          }
        });
      };

      self.listSelectionHandler = function listSelectionHandler() {
        var ids = [];
        var selectAll = self.dataModel.selectAll;
        self.dataModel.authorizations.map(function iteratee(authorization) {
          ids.push(authorization.id);
        });

        self.actionHandler({
          obj: {
            action: AuthorizationListActions.toggleAuthorizationListSelection,
            payload: {
              selectedIds: selectAll ? ids : undefined,
              deselectedIds: selectAll ? undefined : ids,
              selectAll: selectAll
            }
          }
        });
      };

      self.itemSelectionHandler = function itemSelectionHandler($index) {
        var count = 0;
        self.dataModel.authorizations.map(function iteratee(authorization) {
          if (authorization.selected) {
            count++;
          }
        });
        self.actionHandler({
          obj: {
            action: AuthorizationListActions.toggleAuthorizationSelection,
            payload: {
              selectedIds: self.dataModel.authorizations[$index].selected ? [self.dataModel.authorizations[$index].id] : undefined,
              deselectedIds: self.dataModel.authorizations[$index].selected ? undefined : [self.dataModel.authorizations[$index].id],
              selectAll: count === self.dataModel.authorizations.length
            }
          }
        });
      };

      self.onToggleProductLines = function onToggleProductLines($index) {
        self.actionHandler({
          obj: {
            action: AuthorizationListActions.toggleAuthorizationProductLines,
            payload: {
              expandedId: self.dataModel.authorizations[$index].expanded ? undefined : self.dataModel.authorizations[$index].authorizationGroupId,
              collapsedId: self.dataModel.authorizations[$index].expanded ? self.dataModel.authorizations[$index].authorizationGroupId : undefined
            }
          }
        });
      };

      self.onToggleRelatedAuthorizations = function onToggleRelatedAuthorizations($index) {
        self.actionHandler({
          obj: {
            action: AuthorizationListActions.toggleAuthorizationRelatedAuthorizations,
            payload: {
              expandedId: self.dataModel.authorizations[$index].expandedAssociatedAuthorizationsSection ? undefined : self.dataModel.authorizations[$index].authorizationGroupId,
              collapsedId: self.dataModel.authorizations[$index].expandedAssociatedAuthorizationsSection ? self.dataModel.authorizations[$index].authorizationGroupId : undefined
            }
          }
        });
      };

      self.onSearchClick = function onSearchClick($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.actionHandler({
          obj: {
            action: AuthorizationListActions.toggleSearchCriteria
          }
        });
      };

      self.pipe = function pipe(tableState, tableCtrl) {
        if (_.isNil(self.dataModel) || _.isNil(self.dataModel.authorizations) || self.dataModel.authorizations.length === 0) {
          return;
        }

        var action;
        var sorting = {
          by: undefined,
          descending: false
        };

        var sort = tableState.sort;
        // sort predicate/order has changed... handle event as a sort event
        // if (self.stateModel.sorting.by && self.stateModel.sorting.by.length && sort.predicate !== self.stateModel.sorting.by[0] || sort.reverse !== self.stateModel.sorting.descending) {
        if (self.dataModel.sorting.by && self.dataModel.sorting.by.length && sort.predicate !== self.dataModel.sorting.by[0] || sort.reverse !== self.dataModel.sorting.descending) {
          action = AuthorizationListActions.sortAuthorizationList;
          sorting.by = sort.predicate ? [sort.predicate] : [];
          sorting.descending = sort.reverse;
        }

        // Unable to determine action - return
        if (!action) {
          return;
        }

        self.actionHandler({
          obj: {
            action: action,
            payload: {
              sorting: sorting
            }
          }
        });
      };

      self.getAuthorizationTypeDescription = function getAuthorizationTypeDescription(requisitionGroup) {
        var res = '';
        if (requisitionGroup.typeDescription) {
          res = res.concat(requisitionGroup.typeDescription);
          if (requisitionGroup.natureDescription) {
            res = res.concat(' ').concat(requisitionGroup.natureDescription);
          }
        }
        return res;
      };

      self.getTypeLabel = function getTypeLabel(type) {
        if ('I' === type) {
          return 'inventoryAbbr';
        }
        else if ('D' === type) {
          return 'directPurchaseAbbr';
        }
      };

      self.getTypeDescription = function getTypeDescription(type) {
        if ('I' === type) {
          return 'inventory';
        }
        else if ('D' === type) {
          return 'directPurchase';
        }
      };
    }
  }
)();
