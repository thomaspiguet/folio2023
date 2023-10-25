(
  function() {
    'use strict';

    angular
      .module('app.controls.statistical-unit-list')
      .component('statisticalUnitList', statisticalUnitList());

    function statisticalUnitList() {
      var cdo = {
        templateUrl: 'statistical-unit-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange'
        },
        controller: StatisticalUnitListController
      };

      /* @ngInject */
      function StatisticalUnitListController($log,
                                             $q,
                                             $document,
                                             $timeout,
                                             ControlLookupDatasourceService) {

        var self = this;

        self.$onInit = function() {
          if (_.isNil(self.inputId)) {
            self.inputId = _.uniqueId('accountList_');
          }

          self.searchText = '';
          self.collection = [];
          self.totalRecordsCount = 0;
          self.fetchFromDatabase = true;
          self.deferred = undefined;
        };

        self.onSearchTextChanged = function onSearchTextChanged() {
            self.fetchFromDatabase = true;
        };

        self.updateModel = function () {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            self.changed();
          });
        };

        self.fetchMoreStatisticalUnit = function() {
          var params = {
            skip: self.collection.length,
            take: 50,
            criteria: self.searchText
          };
          return getStatisticalUnit(true, params);
        };

        self.fetchStatisticalUnit = function (searchText) {
          var params = {
            skip: 0,
            take: 50,
            criteria: searchText
          };
          return getStatisticalUnit(false, params);
        };

        function getStatisticalUnit(nextPage, params) {
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
              .getStatisticalUnits(searchCfg)
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
                  deferred.reject('Problem getting statistical unit data [' + error + ']');
                });
          }
          return deferred.promise;
        }
      }
      return cdo;
    }
 }
)();
