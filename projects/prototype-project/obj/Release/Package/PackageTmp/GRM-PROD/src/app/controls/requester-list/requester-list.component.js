(
  function() {
    'use strict';

    angular
      .module('app.controls.requester-list')
      .component('requesterList', requesterList());

    function requesterList() {
      var cdo = {
        templateUrl: 'requester-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          department: '<'
        },
        controller: RequesterListController
      };

      /* @ngInject */
      function RequesterListController($q, $document, $timeout, RequesterApiService) {

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

        // Will listen changes on the parent component.
        self.$onChanges = function(changes) {
          // When department changes, always "reset" the list.
          if (isDirty(changes.department)) {
            self.collection = [];
            self.fetchFromDatabase = true;

            if (isNull(changes.department)) {
              self.model = undefined;
              self.searchText = '';
            }
          }
        };

        self.onSearchTextChanged = function onSearchTextChanged() {
            self.fetchFromDatabase = true;
        };

        self.updateModel = function () {
          // force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            self.changed();
          });
        };

        self.fetchMoreRequester = function() {
          var params = {
            skip: self.collection.length,
            take: 50,
            sort: [{ field: 'code', dir: 'asc' }],
            departmentId: self.department ? self.department.id : null,
            criteria: self.searchText
          };
          return getRequester(true, params);
        };

        self.fetchRequester = function (searchText) {
          var params = {
            skip: 0,
            take: 50,
            sort: [{ field: 'code', dir: 'asc' }],
            departmentId: self.department ? self.department.id : null,
            criteria: searchText
          };
          return getRequester(false, params);
        };

        function getRequester(nextPage, params) {
          var deferred = $q.defer();
          if ($document[0].activeElement.id !== self.inputId && $document[0].activeElement.id !== self.inputId + 'Scroller') {
            self.collection = [];
            deferred.resolve(self.collection);
          }
          else if (!self.fetchFromDatabase && !nextPage) {
            deferred.resolve(self.collection);
          }
          else {
            if (self.deferred && self.deferred.promise && self.deferred.promise.$$state && !self.deferred.promise.$$state.status) {
              self.deferred.resolve('Cancelling previous call');
            }

            self.deferred = $q.defer();
            var searchParams = {
              params: params,
              promise: self.deferred.promise
            };
            RequesterApiService
              .getRequesters(searchParams)
              .then(
                function success(response) {
                  if (nextPage) {
                    self.collection = self.collection.concat(response.data);
                  }
                  else {
                    self.collection = response.data;
                  }
                  self.totalRecordsCount = parseInt(response.headers('records-count'), 10);
                  self.fetchFromDatabase = false;
                  deferred.resolve(self.collection);
                },
                function failure(error) {
                  deferred.reject('Problem getting requester data [' + error + ']');
                }
              );
          }
          return deferred.promise;
        }

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
      }
      return cdo;
    }
  }
)();
