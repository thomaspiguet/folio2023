(
/*
 * Example usage:
 *
 *   <secondary-code-list
 *   allow-fetch-account="true"
 *   department="$ctrl.dataModel.department"
 *   ng-model="$ctrl.dataModel.secondaryCode">
 *   </secondary-code-list>
 */
  function() {
    'use strict';

    angular
      .module('app.controls.secondary-code-list')
      .component('secondaryCodeList', secondaryCodeList());

    function secondaryCodeList() {
      var cdo = {
        templateUrl: 'secondary-code-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          department: '<',
          allowFetchAccount: '<'
        },
        controller: SecondaryCodeListController
      };

      /* @ngInject */
      function SecondaryCodeListController(
          $document,
          $log,
          $q,
          $timeout,
          ControlLookupDatasourceService,
          AccountApiService
        ) {

        var self = this;

        self.$onInit = function onInit() {
          self.searchText = '';
          self.collection = [];
          self.totalRecordsCount = 0;
          self.fetchFromDatabase = true;
          self.isReinitialized = false;
          self.deferred = undefined;
        };

        self.onSearchTextChanged = function onSearchTextChanged() {
          // if (_.isNil(self.model) && !_.isNil(self.previousModel)) {
          //   self.fetchFromDatabase = false;
          //   self.isReinitialized = true;
          //   $log.log('SecondaryCodeListController.fetchFromDatabase: false');
          // }
          // else {
          //   self.fetchFromDatabase = true;
          //   $log.log('SecondaryCodeListController.fetchFromDatabase: true');
          // }
          self.fetchFromDatabase = true;
        };

        self.updateModel = function() {
          // self.previousModel = _.extend(self.previousModel, self.model);

          if ((self.allowFetchAccount) && !_.isNil(self.department) && !_.isNil(self.model)) {
            getDefaultAccountForSecondaryCode(self.model.id, self.department.id)
              .then(
                function success(value) {
                  self.model = _.extend(self.model, { account: value });
                  delayedChanged();
                },
                function failure(reason) {
                  $log.error(reason);
                }
              )
            ;
          }
          else {
            delayedChanged();
          }
        };

        self.fetchMoreSecondaryCode = function() {
          var params = {
            skip: self.collection.length,
            take: 50,
            criteria: self.searchText
          };
          return getSecondaryCode(true, params);
        };

        self.fetchSecondaryCode = function (searchText) {
          var params = {
            skip: 0,
            take: 50,
            criteria: searchText
          };
          return getSecondaryCode(false, params);
        };

        function delayedChanged() {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function () {
            self.changed();
          });
        }

        function getSecondaryCode(nextPage, params) {
          var deferred = $q.defer();
          if ($document[0].activeElement.id !== self.inputId && $document[0].activeElement.id !== self.inputId + 'Scroller') {
            self.collection = [];
            deferred.resolve(self.collection);
          }
          else if (!self.fetchFromDatabase && !nextPage) {
            // if (self.isReinitialized) {
            //   self.fetchFromDatabase = true;
            //   self.isReinitialized = false;
            // }
            // return self.collection;
            deferred.resolve(self.collection);
          }
          else {
            if (self.deferred && self.deferred.promise && self.deferred.promise.$$state && !self.deferred.promise.$$state.status) {
              self.deferred.resolve('Cancelling previous call');
            }

            self.deferred = $q.defer();
            var searchCfg = {
              params: params,
              promise: self.deferred.promise
            };
            ControlLookupDatasourceService
              .getSecondaryCodes(searchCfg)
              .then(
                function success(response) {
                  if (nextPage) {
                    self.collection = self.collection.concat(response.data);
                  }
                  else {
                    self.collection = response.data;
                  }
                  self.totalRecordsCount = response.headers('records-count');
                  self.fetchFromDatabase = false;
                  deferred.resolve(self.collection);
                },
                function failure(error) {
                  deferred.reject('Problem getting secondary code data [' + error + ']');
                }
              )
            ;
          }
          return deferred.promise;
        }

        function getDefaultAccountForSecondaryCode(secondaryCodeId, departmentId) {
          var deferred = $q.defer();
          AccountApiService
            .getDefaultAccountForSecondaryCode(secondaryCodeId, departmentId)
            .then(
              function success(response) {
                deferred.resolve(response.data);
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            );
          return deferred.promise;
        }
      }

      return cdo;
    }
 }
)();
