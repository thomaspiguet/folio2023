(
  function() {
    'use strict';

    angular
      .module('app.controls.buyer-list')
      .component('buyerList', buyerList());

    function buyerList() {
      var cdo = {
        templateUrl: 'buyer-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange'
        },
        controller: BuyerListController
      };

    /* @ngInject */
      function BuyerListController($log, $q, $timeout, ControlLookupDatasourceService) {

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

      self.getBuyers = function() {
        var deferred = $q.defer();
        if (fetchFromDatabase) {
          var params = {};

          ControlLookupDatasourceService
            .getBuyers(params)
            .then(
              function success(response) {
                self.collection = response.data;
                fetchFromDatabase = false;
                // This is a low volume collection, returns full list
                deferred.resolve(self.collection);
              },
              function failure(error) {
                deferred.reject('Problem getting buyers data [' + error + ']');
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
