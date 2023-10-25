(
  function() {
    'use strict';

    angular
      .module('app.controls.delivery-location-list')
      .component('deliveryLocationList', deliveryLocationList());

    function deliveryLocationList() {
      var cdo = {
        templateUrl: 'delivery-location-list.template.html',
        bindings: {
          inputId: '@',
          inputName: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          department: '<',
          onSearchTextChange: '&',
          deliveryLocation: '<',
          isInstallationLocation: '<?'
        },
        controller: DeliveryLocationController
      };

      /* @ngInject */
      function DeliveryLocationController($document, $q, $timeout, ControlLookupDatasourceService) {

        var self = this;
        var isInstallationLocation = false;

        self.$onInit = function() {
          if (_.isNil(self.inputId)) {
            self.inputId = _.uniqueId('accountList_');
          }

          if (!_.isNil(self.isInstallationLocation)) {
            isInstallationLocation = self.isInstallationLocation;
          }

          self.searchText = '';
          self.collection = [];
          self.totalRecordsCount = 0;
          self.fetchFromDatabase = true;
          self.deferred = undefined;
        };

        //Will listen changes on the parent component.
        self.$onChanges = function (changes) {

          // When department changes, always "reset" the list.
          if (isDirty(changes.department)) {
            self.collection = [];
            self.fetchFromDatabase = true;

            if (isNull(changes.department)) {
              self.searchText = '';
              self.model = undefined;
            }
          }

          // Handle bound deliveryLocation change
          if (!_.isNil(changes.deliveryLocation) && !changes.deliveryLocation.isFirstChange() && !_.isNil(changes.deliveryLocation.currentValue)) {
            if (changes.deliveryLocation.currentValue !== changes.deliveryLocation.previousValue) {
              if (self.collection.indexOf(changes.deliveryLocation.currentValue) < 0) {
                self.collection.push(changes.deliveryLocation.currentValue);
              }
              self.model = changes.deliveryLocation.currentValue;
            }
          }
        };

        self.onSearchTextChanged = function onSearchTextChanged() {
          if (self.onSearchTextChange) {
            self.onSearchTextChange({
              obj: {
                searchText: self.searchText
              }
            });
          }
          self.fetchFromDatabase = true;
        };

        self.updateModel = function () {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            self.onSearchTextChange({
              obj: {
                searchText: ''
              }
            });
            self.changed();
          });
        };

        self.fetchMoreDeliveryLocations = function() {
          var params = {
            active: isInstallationLocation ? true : undefined,
            expanded: isInstallationLocation,
            isInstallationLocation: isInstallationLocation ? true : undefined,
            skip: self.collection.length,
            take: 50,
            sort: [{ field: 'code', dir: 'asc' }],
            departmentId: self.department ? self.department.id : null,
            criteria: self.searchText && self.searchText.length ? self.searchText : undefined
          };
          return getDeliveryLocations(true, params);
        };

        self.fetchDeliveryLocations = function (searchText) {
          var params = {
            active: isInstallationLocation ? true : undefined,
            expanded: isInstallationLocation,
            isInstallationLocation: isInstallationLocation ? true : undefined,
            skip: 0,
            take: 50,
            sort: [{ field: 'code', dir: 'asc' }],
            departmentId: self.department ? self.department.id : null,
            criteria: self.searchText && self.searchText.length ? self.searchText : undefined
          };
          return getDeliveryLocations(false, params);
        };

        function getDeliveryLocations(nextPage, params) {
          var deferred = $q.defer();
          if ($document[0].activeElement.id !== self.inputId && $document[0].activeElement.id !== self.inputId + 'Scroller') {
            self.collection = [];
            deferred.resolve(self.collection);
          } else if (!self.fetchFromDatabase && !nextPage) {
            deferred.resolve(self.collection);
          } else {

            if (self.deferred && self.deferred.promise && self.deferred.promise.$$state && !self.deferred.promise.$$state.status) {
              self.deferred.resolve('Cancelling previous call');
            }
            self.deferred = $q.defer();
            var searchCfg = {
              params: params,
              promise: self.deferred.promise
            };

            ControlLookupDatasourceService
              .getDeliveryLocations(searchCfg)
              .then(
                function success(response) {
                  if (nextPage) {
                    self.collection = self.collection.concat(response.data);
                  } else {
                    self.collection = response.data;
                  }
                  self.totalRecordsCount = response.headers('records-count');
                  self.fetchFromDatabase = false;
                  deferred.resolve(self.collection);
                },
                function failure(error) {
                  deferred.reject('Problem getting delivery location data [' + error + ']');
                }
              );
          }
          return deferred.promise;
        }

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
      }
      return cdo;
    }
 }
)();
