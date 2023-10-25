(
  function() {
    'use strict';

    angular
      .module('app.controls.client-list')
      .component('clientList', clientList());

    function clientList() {
      var cdo = {
        templateUrl: 'client-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          establishmentId: '<?',
          isActive: '<?'
        },
        controller: ClientListController
      };

      /* @ngInject */
      function ClientListController($document, $q, $timeout, ControlLookupDatasourceService) {

        var self = this;
        var fetchFromDatabase = true;
        var clearDisplayedItems = false;

        self.$onInit = function() {
          if (_.isNil(self.inputId)) {
            self.inputId = _.uniqueId('clientList_');
          }
          self.searchText = '';
          self.collection = [];
          self.displayedItems = [];
          self.totalRecordsCount = 0;
        };

        self.$onChanges = function onChanges(changesObj) {
          if (changesObj.establishmentId && changesObj.establishmentId.currentValue !== changesObj.establishmentId.previousValue) {
            fetchFromDatabase = true;
          }
          if (changesObj.isActive && changesObj.isActive.currentValue !== changesObj.isActive.previousValue) {
            fetchFromDatabase = true;
          }
        };

        self.updateModel = function (item) {
          if (dontCareAboutThisChange()) {
            return;
          }

          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            if (!_.isNil(item)) {
              self.displayedItems = [item];
            }
            self.changed();
          });
        };

        self.onSearchTextChange = function onSearchTextChange(searchText) {
          if (_.isNil(searchText) || '' === searchText.trim()) {
            clearDisplayedItems = true;
          }
        };

        self.getClients = function() {
          var deferred = $q.defer();
          if (dontCareAboutThisChange()) {
            self.displayedItems = [];
            deferred.resolve(self.displayedItems);
          }
          else {
            if (fetchFromDatabase) {
              var params = {
                sortBy: ['description'],
                establishmentId: self.establishmentId,
                isActive: self.isActive
              };

              self.displayedItems = [];
              self.totalRecordsCount = 0;

              ControlLookupDatasourceService
                .getClients(params)
                .then(
                  function success(response) {

                    // Keep track of complete collection
                    self.collection = response.data;

                    // Keep track of how many items in complete collection
                    self.totalRecordsCount = response.data.length;

                    if (!_.isNil(self.searchText) && self.searchText.trim() !== '') {
                      filterCollection();
                    }
                    else {
                      // Initialize first slice of displayed items
                      self.displayedItems = self.collection.slice(0, self.totalRecordsCount <= 50 ? self.totalRecordsCount : 50);
                    }

                    // Prevent future fetch
                    fetchFromDatabase = false;

                    // Resolve
                    deferred.resolve(self.displayedItems);
                  },
                  function failure(error) {
                    deferred.reject('Problem getting clients data [' + error + ']');
                  }
                )
              ;
            }
            else {
              // Filter against search text
              if (!_.isNil(self.searchText) && self.searchText.trim() !== '') {
                filterCollection();
                deferred.resolve(self.displayedItems);
              }
              else if (clearDisplayedItems) {
                self.displayedItems = [];
                clearDisplayedItems = false;
                self
                  .getMoreClients()
                  .then(
                    function success(response) {
                      deferred.resolve(response);
                    },
                    function failure(reason) {
                      deferred.reject(reason);
                    }
                  )
                ;
              }
              else {
                deferred.resolve(self.displayedItems);
              }
            }
          }

          return deferred.promise;
        };

        self.getMoreClients = function getMoreClients() {
          var deferred = $q.defer();

          self.displayedItems = _.concat(self.displayedItems, _.slice(self.collection, self.displayedItems.length, self.displayedItems.length + 50));

          deferred.resolve(self.displayedItems);

          return deferred.promise;
        };

        function dontCareAboutThisChange() {
          return $document[0].activeElement.id !== self.inputId && $document[0].activeElement.id !== self.inputId + 'Scroller';
        }

        function filterCollection() {
          var target = self.searchText.toLowerCase();
          self.displayedItems = self.collection.filter(function filter(object) {
            var code = (object.code || '').toLowerCase();
            var description = (object.description || '').toLowerCase();

            return code.indexOf(target) >= 0 || description.indexOf(target) >= 0 || code.concat(' - ').concat(description).indexOf(target) >= 0;
          });
        }

      }
      return cdo;
    }

 }
)();
