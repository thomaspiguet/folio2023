(
  function() {
    'use strict';

    angular
      .module('app.controls.site-list')
      .component('siteList', siteList());

    function siteList() {
      var cdo = {
        templateUrl: 'site-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          department: '<',
          orderBy: '@'
        },
        controller: SiteListController
      };

      /* @ngInject */
      function SiteListController($q, $scope, $document, $timeout, ControlLookupDatasourceService) {

        var self = this;

        self.$onInit = function() {
          if (_.isNil(self.inputId)) {
            self.inputId = _.uniqueId('accountList_');
          }
          if (_.isUndefined(self.orderBy)) {
            self.orderBy = 'code';
          }
          
          self.searchText = '';
          self.collection = [];
          self.totalRecordsCount = 0;
          self.fetchFromDatabase = true;
          self.deferred = undefined;
        };

        //Will listen changes on the parent component.
        self.$onChanges = function(changes) {
          //When department changes, always "reset" the list.
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
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            self.changed();
          });
        };

        self.fetchMoreSite = function() {
          var params = {
            skip: self.collection.length,
            take: 50,
            sort: [{ field: self.orderBy, dir: 'asc' }],
            departmentId: self.department ? self.department.id : null,
            criteria: self.searchText
          };
          return getSite(true, params);
        };

        self.fetchSite = function (searchText) {
          var params = {
            skip: 0,
            take: 50,
            sort: [{ field: self.orderBy, dir: 'asc' }],
            departmentId: self.department ? self.department.id : null,
            criteria: searchText
          };
          return getSite(false, params);
        };

        function getSite(nextPage, params) {
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
              .getSites(searchCfg)
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
                  deferred.reject('Problem getting site data [' + error + ']');
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
