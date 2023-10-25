(
  function() {
    'use strict';

    angular
      .module('app.controls.distribution-unit-list')
      .component('distributionUnitList', distributionUnitList());

    function distributionUnitList() {
      var cdo = {
        templateUrl: 'distribution-unit-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          statisticalUnit: '<',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange'
        },
        controller: DistributionUnitListController
      };

      /* @ngInject */
      function DistributionUnitListController($log,
                                             $q,
                                             $document,
                                             $timeout,
                                             DistributionUnitApiService) {

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

        //Will listen changes on the parent component.
        self.$onChanges = function(changes) {
          //When properties changes, always "reset" the list.
          if (isDirty(changes.statisticalUnit)) {
            self.collection = [];
            self.fetchFromDatabase = true;

            if (isNull(changes.statisticalUnit)) {
              self.searchText = '';
              self.model = undefined;
            }
          }
        };

        self.onSearchTextChanged = function onSearchTextChanged() {
          self.fetchFromDatabase = true;
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

        self.updateModel = function () {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            self.changed();
          });
        };

        self.fetchMoreDistributionUnit = function() {
          var params = {
            skip: self.collection.length,
            take: 50
          };
          return getDistributionUnit(true, params);      
        };

        self.fetchDistributionUnit = function () {        
          var params = {
            skip: 0,
            take: 50
          };
          return getDistributionUnit(false, params);
        };

        function getDistributionUnit(nextPage, params) {
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
            
            params.criteria = self.searchText;
            params.statisticalUnitId = self.statisticalUnit.id;
            self.deferred = $q.defer();
            var searchCfg = {
              params: params,
              promise: self.deferred.promise
            };            
            DistributionUnitApiService
              .search(searchCfg)
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
                  deferred.reject('Problem getting distribution unit data [' + error + ']');
                }
              );
            }
          return deferred.promise;
        }
      }
      return cdo;
    }
 }
)();
