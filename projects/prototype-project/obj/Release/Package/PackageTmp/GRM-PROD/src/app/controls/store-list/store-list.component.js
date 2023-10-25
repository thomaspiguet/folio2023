(
  function () {
    'use strict';

    angular
      .module('app.controls.store-list')
      .component('storeList', storeList());

    function storeList() {
      var cdo = {
        templateUrl: 'store-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          storeId: '<',
          departmentId: '<',
          siteId: '<',
          productId: '<',
          isMsiProduct: '<'
        },
        controller: StoreListController
      };

      /* @ngInject */
      function StoreListController($log, $q, $timeout, $document, ControlLookupDatasourceService) {

        var self = this;
        var defaultVisibleItemsCount = 5; // as "documented" by md-autocomplete..

        self.searchText = '';
        self.collection = [];
        var fetchFromDatabase = true;

        self.$onInit = function () {
          if (_.isNil(self.inputId)) {
            self.inputId = _.uniqueId('accountList_');
          }
        };

        //Will listen changes on the parent component.
        self.$onChanges = function (changes) {
          //When product changes, always "reset" the list.
          if (isDirty(changes.productId)) {
            self.collection = [];
            fetchFromDatabase = true;

            if (isNull(changes.productId)) {
              self.searchText = '';
              self.model = undefined;
            }
          }
        };

        function isDirty(object) {
          if (!_.isNil(object)) {
            return object.currentValue !== object.previousValue;
          }
          else {
            return false;
          }
        }

        function isNull(object) {
          if (!_.isNil(object)) {
            return object.currentValue === null;
          }
          else {
            return false;
          }
        }

        self.getVisibleItemsCount = function () {
          if (!_.isNil(self.collection) &&
            self.collection.length > 0 &&
            self.collection.length < defaultVisibleItemsCount) {
            return self.collection.length;
          }
          return defaultVisibleItemsCount;
        };

        self.updateModel = function () {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function () {
            self.changed();
          });
        };

        self.getStores = function () {
          var deferred = $q.defer();

          //fetch records from database only if product change or if it's the first consultation of the list.
          if ($document[0].activeElement.id !== self.inputId && $document[0].activeElement.id !== self.inputId + 'Scroller') {
            self.collection = [];
            fetchFromDatabase = true;
            deferred.resolve(self.collection);
          }
          else if (fetchFromDatabase) {
            var params;

            // Without product id, no need to filter on anything else, assume we want all stores...
            if (!_.isNil(self.productId)) {
              params = {
                storeId: self.storeId,
                departmentId: self.departmentId,
                siteId: self.siteId,
                productId: self.productId,
                isMsiProduct: self.isMsiProduct
                //sortBy: ['code'] Temporary we invoke a native SQL query with hardcoded sorting on id (code = id anyway).
              };
            }
            else {
              params = {
                sortBy: ['code']
              };
            }

            ControlLookupDatasourceService
              .getStores(params)
              .then(
              function success(response) {
                self.collection = response.data;
                fetchFromDatabase = false;
                /*
                  workaround : Initialize list with just 50 records. strange behavior if list is initialized with lots of records ..
                  after initialization, lots of records can be added to the list. seems like this have something to do with watchers created at initialization.
                */
                deferred.resolve(self.collection.slice(0, self.collection.length <= 50 ? self.collection.length : 50));
              },
              function failure(error) {
                deferred.reject('Problem getting store data [' + error + ']');
              }
              );
          }
          else {
            deferred.resolve(self.collection);
          }

          return deferred.promise;
        };
      }

      return cdo;
    }
  }
)();
