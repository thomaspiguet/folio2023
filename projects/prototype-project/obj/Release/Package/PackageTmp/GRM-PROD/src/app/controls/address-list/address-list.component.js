(
  function() {
    'use strict';

    angular
      .module('app.controls.address-list')
      .component('addressList', addressList());

    function addressList() {
      var cdo = {
        templateUrl: 'address-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          department: '<',
          site: '<'
        },
        controller: AddressListController
      };

      /* @ngInject */
      function AddressListController($log, $q, $timeout, $document, ControlLookupDatasourceService) {

        var self = this;
        self.searchText = '';
        self.collection = [];
        var fetchFromDatabase = true;

        self.$onInit = function() {
          if (_.isNil(self.inputId)) {
            self.inputId = _.uniqueId('accountList_');
          }
        };

        //Will listen changes on the parent component.
        self.$onChanges = function(changes) {
          //When properties changes, always "reset" the list.
          if (isDirty(changes.department) ||
              isDirty(changes.site)) {
            self.collection = [];
            fetchFromDatabase = true;

            if (isNull(changes.department) ||
                isNull(changes.site)) {
              self.searchText = '';
              self.model = undefined;
            }
          }
        };

        self.updateModel = function() {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            self.changed();
          });
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
        //could be changed to be remote $http call .. for the moment, use a pre-fetched array.
        self.getAddresses = function() {
          var deferred = $q.defer();

          if ($document[0].activeElement.id !== self.inputId && $document[0].activeElement.id !== self.inputId + 'Scroller') {
            self.collection = [];
            deferred.resolve(self.collection);
          }
          else if (fetchFromDatabase) {
            var params = {
              sortBy: ['code']
            };

            ControlLookupDatasourceService
              .getAddresses(params)
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
                  deferred.reject('Problem getting delivery location data [' + error + ']');
                }
              )
            ;
          }
          else {
            return self.collection;
          }

          return deferred.promise;
        };
      }

      return cdo;
    }
  }
)();
