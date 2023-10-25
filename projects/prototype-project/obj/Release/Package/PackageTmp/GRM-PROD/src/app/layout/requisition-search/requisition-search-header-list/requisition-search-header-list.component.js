(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-search.requisition-header-list')
      .component('requisitionSearchHeaderList', requisitionSearchHeaderList())
    ;

    function requisitionSearchHeaderList() {
      var cdo = {
        templateUrl: 'requisition-search-header-list.template.html',
        controller: RequisitionSearchHeaderListController,
        bindings: {
          dataModel: '<model',
          stateModel: '<',
          viewModel: '<',
          actionHandler: '&'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionSearchHeaderListController(
      $log,
      $timeout,
      RequisitionSearchHeaderListActions
    ) {
      var self = this;
      self.selectedIndex = undefined;

      self.$onInit = function onInit() {
        self.model = self.dataModel.clone();
        selectRow(getSelectedRowIndex());
      };

      self.$onChanges = function onChanges(changesObj) {
        if (!_.isNil(changesObj.dataModel)) {
          if (changesObj.dataModel.previousValue !== changesObj.dataModel.currentValue && !changesObj.dataModel.isFirstChange()) {
            self.model = self.dataModel.clone();
            selectRow(getSelectedRowIndex());
          }
        }
      };

      self.$postLink = function () {
        self.scrollToItemId = function scrollToItemId($index) {
          var tbody = new Clay('#requisition-search-header-table tbody');
          var scrollingContainer = angular.element(tbody.selector);
          var selectedRow = scrollingContainer.find('tr#itemLine_' + $index + ':first');

          if (selectedRow.position().top !== 0) {
            // Reset scrollingContainer to the top before scrolling to the item position to patch strange behavior
            scrollingContainer.scrollTop(0);
            scrollingContainer.scrollTop(selectedRow.position().top);
          }
        };
      };

      self.onToggleRowSelection = function onToggleRowSelection($event, $index, headerItem) {
        if ($event) {
          $event.preventDefault();
        }
        if (true === headerItem.selected) {
          // Unselect => Cancel event
          $event.stopPropagation();
          return;
        }
        else {
          self.model.headers.forEach(function(i) {
            i.selected = false;
          });
          self.model.headers[$index].selected = true;
          self.selectedIndex = $index;
        }

        self.actionHandler({
          obj: {
            action: RequisitionSearchHeaderListActions.onRowSelect,
            id: self.model.headers[self.selectedIndex].requisitionId
          }
        });
      };

      self.onToggleDetailSection = function onToggleDetailSection($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.stateModel.detail.hidden = !self.stateModel.detail.hidden;

        self.actionHandler({
          obj: {
            action: RequisitionSearchHeaderListActions.onToggleDetailSection,
            id: self.model.headers[self.selectedIndex].requisitionId
          }
        }).then(
          function success(response) {
            if (!self.stateModel.detail.hidden) {
              $timeout(function () {
                self.scrollToItemId(self.selectedIndex);
              });
            }
          },
          function failure(reason) {
            $log.log(reason.description);
          }
        );
      };

      self.isExternalSale = function isExternalSale(index) {
        return !_.isNil(self.model.headers[index].client) && !_.isNil(self.model.headers[index].client.id);
      };

      self.pipe = function pipe(tableState, tableCtrl) {
        if (_.isNil(self.model) || _.isNil(self.model.headers) || self.model.headers.length === 0) {
          return;
        }

        var action;
        var searchConfiguration = {
          sorting: undefined,
          paging: undefined
        };

        var sort = tableState.sort;
        // sort predicate/order has changed... handle event as a sort event
        if (self.viewModel.sorting.by && self.viewModel.sorting.by.length && sort.predicate !== self.viewModel.sorting.by[0] || sort.reverse !== self.viewModel.sorting.descending) {
          action = RequisitionSearchHeaderListActions.onSort;
          searchConfiguration.sorting = {
            by: sort.predicate ? [sort.predicate] : [],
            descending: sort.reverse
          };
          searchConfiguration.paging = {
            offset: 0 // Force first page
          };
        }
        // }

        // Sorting hasn't changed, consider event as a paging event
        if (_.isNil(action)) {
          var pagination = tableState.pagination;
          if (pagination.start / self.viewModel.paging.size !== self.viewModel.paging.offset) {
            action = RequisitionSearchHeaderListActions.onPage;
            searchConfiguration.paging = {
              offset: pagination.start / self.viewModel.paging.size
            };
          }
        }

        // Unable to determine action - return
        if (!action) {
          return;
        }

        self.actionHandler({
          obj: {
            action: action,
            searchConfiguration: searchConfiguration
          }
        });
      };

      function getSelectedRowIndex() {
        var res = -1;
        var target = _.find(self.model.headers, function iterator(header) {
          res++;
          return true === header.selected;
        });
        if (target) {
          return res;
        }
        return 0;
      }

      function selectRow(which) {
        if (self.model.headers && self.model.headers.length && which >= 0 && which < self.model.headers.length) {
          self.model.headers[which].selected = true;
          self.selectedIndex = which;

          // DOM manipulation patch - use $timeout to make sure rows are present in the dom
          $timeout(function() {
            // Get the scroll container element
            var tbody = new Clay('#requisition-search-header-table tbody');
            var scrollingContainer = angular.element(tbody.selector);

            // Set scroll bar to the top
            if (!_.isNil(scrollingContainer)) {
              var row = angular.element('#itemLine_' + which);
              if (row && row.length) {
                scrollingContainer.scrollTop(row[0].offsetTop);
              }
            }
          });

          self.actionHandler({
            obj: {
              action: RequisitionSearchHeaderListActions.onRowSelect,
              id: self.model.headers[self.selectedIndex].requisitionId
            }
          });
        }
      }
    }
  }
)();
