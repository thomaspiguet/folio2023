(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-search.requisition-product-list')
      .component('requisitionSearchProductList', requisitionSearchProductList())
    ;

    function requisitionSearchProductList() {
      var cdo = {
        templateUrl: 'requisition-search-product-list.template.html',
        controller: RequisitionSearchProductListController,
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
    function RequisitionSearchProductListController(
      $log,
      $timeout,
      RequisitionSearchProductListActions
    ) {
      var self = this;
      self.selectedIndex = undefined;

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
          var tbody = new Clay('#requisition-search-product-table tbody');
          var scrollingContainer = angular.element(tbody.selector);
          var selectedRow = scrollingContainer.find('tr#itemLine_' + $index + ':first');

          if (selectedRow.position().top !== 0) {
            // Reset scrollingContainer to the top before scrolling to the item position to patch strange behavior
            scrollingContainer.scrollTop(0);
            scrollingContainer.scrollTop(selectedRow.position().top);
          }
        };
      };

      self.onToggleRowSelection = function onToggleRowSelection($event, $index, productItem) {
        if ($event) {
          $event.preventDefault();
        }
        if (true === productItem.selected) {
          // Unselect => Cancel event
          $event.stopPropagation();
          return;
        }
        else {
          self.model.products.forEach(function(i) {
            i.selected = false;
          });
          self.model.products[$index].selected = true;
          self.selectedIndex = $index;
        }

        self.actionHandler({
          obj: {
            action: RequisitionSearchProductListActions.onRowSelect,
            id: self.model.products[self.selectedIndex].requisitionId,
            iid: self.model.products[self.selectedIndex].requisitionItemId
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
            action: RequisitionSearchProductListActions.onToggleDetailSection,
            id: self.model.products[self.selectedIndex].requisitionId,
            iid: self.model.products[self.selectedIndex].requisitionItemId
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
          action = RequisitionSearchProductListActions.onSort;
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
            action = RequisitionSearchProductListActions.onPage;
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
            var tbody = new Clay('#requisition-search-product-table tbody');
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
              action: RequisitionSearchProductListActions.onRowSelect,
              id: self.model.products[self.selectedIndex].requisitionId
            }
          });
        }
      }
    }
  }
)();
