(
  function() {
    'use strict';

    angular
      .module('app.controls.tax-list')
      .component('taxList', taxList());

    function taxList() {
      var cdo = {
        templateUrl: 'tax-list.template.html',
        bindings: {
          model: '=ngModel',
          inputId: '@',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange'
        },
        controller: TaxListController
      };

      /*@ngInject*/
      function TaxListController($log, $q, $timeout, ControlLookupDatasourceService) {
        var self = this;
        self.searchText = '';
        self.collection = [];
        var fetchFromDatabase = true;

        self.updateModel = function () {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            self.changed();
          });
        };

        self.getTaxes = function() {
          var deferred = $q.defer();
          if (fetchFromDatabase) {
            var params = {};
            ControlLookupDatasourceService
              .getTaxes(params)
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
                  deferred.reject('Problem getting tax data [' + error + ']');
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
