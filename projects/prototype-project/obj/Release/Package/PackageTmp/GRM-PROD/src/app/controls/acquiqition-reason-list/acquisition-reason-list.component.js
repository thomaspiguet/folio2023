(
  function() {
    'use strict';

    angular
      .module('app.controls.acquisition-reason-list')
      .component('acquisitionReasonList', acquisitionReasonList());

    function acquisitionReasonList() {
      var cdo = {
        templateUrl: 'acquisition-reason-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange'
        },
        controller: AcquisitionReasonListController
      };

    /* @ngInject */
      function AcquisitionReasonListController($log, $q, $timeout, ControlLookupDatasourceService) {

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

      self.getAcquisitionReasons = function() {
        var deferred = $q.defer();
        if (fetchFromDatabase) {
          var params = {};

          ControlLookupDatasourceService
            .getAcquisitionReasons(params)
            .then(
              function success(response) {
                self.collection = response.data;
                fetchFromDatabase = false;
                // This is a low volume collection, returns full list
                deferred.resolve(self.collection);
              },
              function failure(error) {
                deferred.reject('Problem getting acquisition reasons data [' + error + ']');
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
