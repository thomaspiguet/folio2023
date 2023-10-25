(
  function () {
    'use strict';

    angular
      .module('app.controls.vendor-list')
      .component('vendorList', vendorList());

    function vendorList() {
      var cdo = {
        templateUrl: 'vendor-list.template.html',
        bindings: {
          inputId: '@',
          inputMaxLength: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          descriptionOnly: '<'
        },
        controller: VendorListController
      };

      /* @ngInject */
      function VendorListController($log, $q, $timeout, ControlLookupDatasourceService, ControlLookupObjectService) {

        var self = this;
        self.searchText = '';
        self.collection = [];
        var fetchFromDatabase = true;

        if (!_.isNil(self.descriptionOnly) && !_.isBoolean(self.descriptionOnly)) {
          $log.error('descriptionOnly attribute must be a boolean.');
        }

        self.getDisplayedValue = function(item) {
            if (!_.isNil(item)) {
                if (!_.isNil(item.id)) {
                  if (!self.descriptionOnly) {
                     return (item.code + ' - ' + item.description);
                  } else {
                     return item.description;
                  }
                } else if (self.descriptionOnly) {
                    return item.description;
                }
            } else if (!_.isNil(self.model)) {
                if (!_.isNil(self.model.id)) {
                  if (!self.descriptionOnly) {
                    return (self.model.code + ' - ' + self.model.description);
                  } else {
                    return self.model.description;
                  }
                } else if (self.descriptionOnly) {
                    return self.model.description;
                }
            }
            return self.descriptionOnly ? '\b' : self.searchText; //workaround as "item-text" value cannot be '' or null/undefined see : https://github.com/angular/material/issues/3760
        };

        self.onBlur = function () {
            if (!_.isNil(self.searchText) && self.searchText !== '') {
              /*We want to manually set the model value if search text is not equals to the selected item text.
               (selected item text will be empty if no item has been selected from the list...)*/
                if (self.searchText !== self.getDisplayedValue()) {
                  //Update the model code with the search text.
                  self.model = ControlLookupObjectService.newInstance();
                  self.model.description = self.searchText;
                  self.updateModel();
                }
            }
        };

        self.updateModel = function () {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          if (!_.isNil(self.model) && self.descriptionOnly) {
            self.model.id = undefined;
          }
          $timeout(function () {
            self.changed();
          });
        };

        self.getVendors = function () {
          var deferred = $q.defer();

          if (self.disabled) {
            deferred.resolve([]);
          }
          else {
            if (fetchFromDatabase) {
              var params = {
                sortBy: ['description']
              };

              ControlLookupDatasourceService
                .getVendors(params)
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
                    deferred.reject('Problem getting vendor data [' + error + ']');
                  }
                )
              ;
            }
            else {
              return self.collection;
            }
          }

          return deferred.promise;
        };

      }
      return cdo;
    }

  }
)();
