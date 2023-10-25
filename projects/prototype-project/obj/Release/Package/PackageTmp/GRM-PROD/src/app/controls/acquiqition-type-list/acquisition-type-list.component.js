(
  function() {
    'use strict';

    angular
      .module('app.controls.acquisition-type-list')
      .component('acquisitionTypeList', acquisitionTypeList());

    function acquisitionTypeList() {
      var cdo = {
        templateUrl: 'acquisition-type-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange'
        },
        controller: AcquisitionTypeListController
      };

      /* @ngInject */
      function AcquisitionTypeListController($log, $q, $timeout, ControlLookupDatasourceService) {

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

        self.getAcquisitionTypes = function() {
          var deferred = $q.defer();
          if (fetchFromDatabase) {
            var params = {};

            ControlLookupDatasourceService
              .getAcquisitionTypes(params)
              .then(
                function success(response) {
                  self.collection = response.data;
                  fetchFromDatabase = false;
                  // This is a low volume collection, returns full list
                  deferred.resolve(self.collection);
                },
                function failure(error) {
                  deferred.reject('Problem getting acquisition types data [' + error + ']');
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
