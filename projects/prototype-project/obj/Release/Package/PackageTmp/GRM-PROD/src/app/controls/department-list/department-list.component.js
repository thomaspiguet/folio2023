(
  function() {
    'use strict';

    angular
      .module('app.controls.department-list')
      .component('departmentList', departmentList());

    function departmentList() {
      var cdo = {
        templateUrl: 'department-list.template.html',
        bindings: {
          inputId: '@',
          inputName: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          site: '<',
          isReplenishment: '<?',
          includeExternalSales: '<?',
          isActive: '<?',
          includeDefaultValues: '<?'
        },
        controller: DepartmentListController
      };

      /* @ngInject */
      function DepartmentListController($q, $scope, $document, $timeout, DepartmentApiService) {

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
          //When site changes, always "reset" the list.
          if (isDirty(changes.site)) {
            self.collection = [];
            self.fetchFromDatabase = true;

            if (isNull(changes.site)) {
              self.searchText = '';
              self.model = undefined;
            }
          }
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

        self.fetchMoreDepartment = function() {
          var params = {
            skip: self.collection.length,
            take: 50,
            sort: [{ field: 'code', dir: 'asc' }],
            siteId: self.site ? self.site.id : null,
            isReplenishmentDepartment: self.isReplenishment,
            isActive: self.isActive,
            criteria: self.searchText,
            isIncludeExternalSales: self.includeExternalSales,
            expanded: self.includeDefaultValues
          };
          return getDepartment(true, params);
        };

        self.fetchDepartment = function (searchText) {
          var params = {
            skip: 0,
            take: 50,
            sort: [{ field: 'code', dir: 'asc' }],
            siteId: self.site ? self.site.id : null,
            isReplenishmentDepartment: self.isReplenishment,
            isActive: self.isActive,
            criteria: searchText,
            isIncludeExternalSales: self.includeExternalSales,
            expanded: self.includeDefaultValues
          };
          return getDepartment(false, params);
        };

        function getDepartment(nextPage, params) {
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
            DepartmentApiService
              .getDepartments(searchParams)
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
                  deferred.reject('Problem getting department data [' + error + ']');
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
