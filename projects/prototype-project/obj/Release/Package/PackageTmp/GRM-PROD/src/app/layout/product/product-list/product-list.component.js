(
  function() {
    'use strict';

    angular
      .module('app.layout.product.product-list')
      .component('productList', productList())
    ;

    function productList() {
      var cdo = {
        templateUrl: 'product-list.template.html',
        controller: ProductListController,
        bindings: {
          actionHandler: '&',
          productListModel: '<model',
          productListState: '<state',
          productListStateModel: '<stateModel',
          productListCartModel: '<cartModel',
          viewModel: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function ProductListController($log, $q, $timeout, $scope, ProductListStates, ProductListActions) {
      var self = this;

      self.model = undefined;
      self.state = undefined;
      self.stateModel = undefined;
      self.currentIndex = 0;
      self.cartModel = undefined;

      //
      // Life cycle hooks
      //
      this.$onInit = function onInit() {
        synchronizeModel();
      };

      this.$onChanges = function onChanges(changesObj) {
        synchronizeModel();
      };

      //DOM related functions
      this.$postLink = function () {
        //Jquery here .. no angular way to scroll just inside a container ..
        self.scrollTo = function scrollTo(top) {
          var tbody = new Clay('#product-list-item-table tbody');
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

        self.scrollToAndFocus = function scrollToAndFocus($index, $last) {
          if ($last) {
            self.scrollTo(true);
          }
        };
      };

      this.onSelectProductLine = function onSelectProductLine($index) {
        self.currentIndex = $index;
        self.model.productItem = self.model.productItems[$index];
      };

      this.isFetching = function isFetching() {
        return self.state === ProductListStates.fetching;
      };

      this.isInCard = function isInCard(id, catalogId) {
        var items = self.cartModel.items;
        var result = _.some(items, function (item) {
          return item.id === id && item.catalogId === catalogId;
        });
        return result;
      };

      this.onProductItemClicked = function onProductItemClicked($event, item) {
        if ($event) {
          $event.preventDefault();
        }
        self.actionHandler({
          obj: {
            action: ProductListActions.onProductItemClick,
            item: item
          }
        });
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
          action = ProductListActions.onSort;
          searchConfiguration.sorting = {
            by: sort.predicate ? [sort.predicate] : [],
            descending: sort.reverse
          };
          searchConfiguration.paging = {
            offset: 0 // Force first page
          };
        }

        // Sorting hasn't changed, consider event as a paging event
        if (_.isNil(action)) {
          var pagination = tableState.pagination;
          if (pagination.start / self.viewModel.paging.size !== self.viewModel.paging.offset) {
            action = ProductListActions.onPage;
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

      function synchronizeModel() {
        if (!_.isNil(self.productListModel)) {
          self.model = self.productListModel.clone();
        }
        self.stateModel = self.productListStateModel;
        self.state = self.productListState;
        self.cartModel = self.productListCartModel;
      }
    }
  }
)();
