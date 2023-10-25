(
  function() {
    'use strict';

    angular
      .module('app.controls.project-activity-list')
      .component('projectActivityList', projectActivityList());

    function projectActivityList() {
      var cdo = {
        templateUrl: 'project-activity-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          changed: '&ngChange',
          cacheData: '<',
          accountId: '<'
        },
        controller: ProjectActivityListController
      };

      /* @ngInject */
      function ProjectActivityListController($log,
                                             $q,
                                             $document,
                                             $timeout,
                                             ProjectActivityApiService) {

        var self = this;
        self.searchText = '';
        self.collection = [];
        self.fetchFromDatabase = true;

        self.$onInit = function() {
          // Set default value for unitialized/unused attributes...
          if (_.isNil(self.inputId)) {
            self.inputId = _.uniqueId('accountList_');
          }
          //self.cacheData = !_.isNil(self.cacheData) ? self.cacheData : true;
          self.cacheData = true;
        };

        //Will listen changes on the parent component.
        self.$onChanges = function(changes) {
          //When properties changes, always "reset" the list.
          if (isDirty(changes.accountId)) {
            self.collection = [];
            self.fetchFromDatabase = true;

            if (isNull(changes.accountId)) {
              self.searchText = '';
              self.model = undefined;
            }
          }
        };

        self.onSearchTextChanged = function onSearchTextChanged() {
            self.fetchFromDatabase = true;
        };

        self.updateModel = function () {
          self.previousModel = _.extend(self.previousModel, self.model);

          delayedChanged();
        };

        self.fetchProjectActivity = function (searchText) {
          var params = {
            defaultValueOnly: false
          };
          return getProjectActivity(false, params);
        };

        function delayedChanged() {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function () {
            self.changed();
          });
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

        function getProjectActivity(nextPage, params) {
          var deferred = $q.defer();

          if ($document[0].activeElement.id !== self.inputId && $document[0].activeElement.id !== self.inputId + 'Scroller') {
            self.collection = [];
            deferred.resolve(self.collection);
          } else if (!self.fetchFromDatabase && !nextPage) {
            deferred.resolve(self.collection);
          } else {
            self.fetchFromDatabase = false;
            ProjectActivityApiService
              .getProjectsActivitiesForAccount(self.accountId, params)
              .then(
                function success(response) {
                  if (nextPage) {
                    self.collection = self.collection.concat(response.data);
                  } else {
                    self.collection = response.data;
                  }
                  deferred.resolve(self.collection);
                },
                function failure(error) {
                  deferred.reject('Problem getting project/activity data [' + error + ']');
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
