(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-template-search')
      .component('requisitionTemplateProductList', requisitionTemplateProductList())
    ;

    function requisitionTemplateProductList() {
      var cdo = {
        templateUrl: 'requisition-template-product-list.template.html',
        controller: RequisitionTemplateProductListController,
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
    function RequisitionTemplateProductListController(
      $log,
      $timeout,
      RequisitionTemplateProductListActions
    ) {
      var self = this;
      self.model = undefined;

      self.$onInit = function onInit() {
        self.model = self.dataModel.clone();
        selectRow(getSelectedRowIndex());
      };

      self.$onChanges = function onChanges(changesObj) {
        if (!_.isNil(changesObj.dataModel)) {
          if (changesObj.dataModel.previousValue !== changesObj.dataModel.currentValue) {
            self.model = self.dataModel.clone();
            selectRow(getSelectedRowIndex());
          }
        }
      };

      self.$postLink = function () {
        self.scrollToItemId = function scrollToItemId($index) {
          var tbody = new Clay('#requisition-template-search-product-table tbody');
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
        self.model.products.forEach(function(i) {
          i.selected = false;
        });
        if ($index && $index >= 0 && $index < self.model.products.length) {
          self.model.products[$index].selected = true;
        }
      };

      self.pipe = function pipe(tableState, tableCtrl) {
        if (_.isNil(self.model) || _.isNil(self.model.products) || self.model.products.length === 0) {
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
          action = RequisitionTemplateProductListActions.onSort;
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
            action = RequisitionTemplateProductListActions.onPage;
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
        var target = _.find(self.model.products, function iterator(product) {
          res++;
          return true === product.selected;
        });
        if (target) {
          return res;
        }
        return 0;
      }

      function selectRow(which) {
        if (self.model.products && self.model.products.length && which >= 0 && which < self.model.products.length) {
          self.model.products[which].selected = true;
          self.selectedIndex = which;

          // DOM manipulation patch - use $timeout to make sure rows are present in the dom
          $timeout(function() {
            // Get the scroll container element
            var tbody = new Clay('#requisition-template-search-product-table tbody');
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
              action: RequisitionTemplateProductListActions.onRowSelect,
              id: self.model.products[self.selectedIndex].templateId,
              iid: self.model.products[self.selectedIndex].templateItemId
            }
          });
        }
      }
    }
  }
)();
