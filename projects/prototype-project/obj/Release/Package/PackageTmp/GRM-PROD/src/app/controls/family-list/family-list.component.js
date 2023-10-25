(
  function() {
    'use strict';

    angular
      .module('app.controls.family-list')
      .component('familyList', familyList());

    function familyList() {
      var cdo = {
        templateUrl: 'family-list.template.html',
        bindings: {
          model: '=ngModel',
          inputId: '@',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          segment: '<'
        },
        controller: FamilyListController
      };

      /*@ngInject*/
      function FamilyListController($q, $timeout, ClassificationApiService) {
        var self = this;
        self.searchText = '';
        self.collection = [];
        var fetchFromDatabase = true;

        //Will listen changes on the parent component.
        self.$onChanges = function(changes) {
            //When segment changes, always "reset" the list.
            if (isDirty(changes.segment)) {
                self.collection = [];
                fetchFromDatabase = true;

                if (isNull(changes.segment)) {
                    self.searchText = '';
                    self.model = undefined;
                }
            }
        };

        self.updateModel = function () {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            self.changed();
          });
        };

        self.getFamilies = function() {
          var deferred = $q.defer();
          if (fetchFromDatabase && !_.isNil(self.segment)) {
            var params = {
              sortBy: ['code']
            };
            //We do not want the expanded form, we want the base one.
            params.expanded = false;
              ClassificationApiService
              .getFamilies(params, self.segment.code)
              .then(
                function success(response) {
                  self.collection = response.data;
                  fetchFromDatabase = false;
                  /*
                    workaround : Initialize list with just 50 records. strange behavior if list is initialized with lots of records ..
                    after initialization, lots of records can be added to the list. seems like this have something to do with watchers created at initialization.
                  */
                  deferred.resolve(self.collection.slice(0, self.collection.length <= 50 ? self.collection.length : 50));
                },
                function failure(error) {
                  deferred.reject('Problem getting Family data [' + error + ']');
                }
              )
            ;
          }
          else {
            return self.collection;
          }
          return deferred.promise;
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

      }
      return cdo;
    }
 }
)();
