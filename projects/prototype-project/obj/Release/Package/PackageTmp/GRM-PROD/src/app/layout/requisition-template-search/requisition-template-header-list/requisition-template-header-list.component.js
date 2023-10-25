(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template-search.requisition-template-header-list')
      .component('requisitionTemplateHeaderList', requisitionTemplateHeaderList())
    ;

    function requisitionTemplateHeaderList() {
      var cdo = {
        templateUrl: 'requisition-template-header-list.template.html',
        controller: RequisitionTemplateHeaderListController,
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
    function RequisitionTemplateHeaderListController(
      $log,
      $timeout,
      RequisitionTemplateHeaderListActions
    ) {
      var self = this;
      self.model = undefined;

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
          var tbody = new Clay('#requisition-template-search-header-table tbody');
          var scrollingContainer = angular.element(tbody.selector);
          var selectedRow = scrollingContainer.find('tr#itemLine_' + $index + ':first');

          if (selectedRow.position().top !== 0) {
            // Reset scrollingContainer to the top before scrolling to the item position to patch strange behavior
            scrollingContainer.scrollTop(0);
            scrollingContainer.scrollTop(selectedRow.position().top);
          }
        };
      };

      // List item selection handler
      self.onRowSelect = function onRowSelect($event, $index) {
        if ($event) {
          $event.preventDefault();
        }
        self.model.headers.forEach(function(i) {
          i.selected = false;
        });
        if ($index && $index >= 0 && $index < self.model.headers.length) {
          self.model.headers[$index].selected = true;
        }
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
          action = RequisitionTemplateHeaderListActions.onSort;
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
            action = RequisitionTemplateHeaderListActions.onPage;
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
            var tbody = new Clay('#requisition-template-search-header-table tbody');
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
              action: RequisitionTemplateHeaderListActions.onRowSelect,
              id: self.model.headers[self.selectedIndex].templateId
            }
          });
        }
      }
    }
  }
)();
