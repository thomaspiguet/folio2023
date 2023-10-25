(
  function() {
    'use strict';

    angular
      .module('app.controls.requisition-template-list')
      .component('requisitionTemplateList', requisitionTemplateList());

    function requisitionTemplateList() {
      var cdo = {
        templateUrl: 'requisition-template-list.template.html',
        bindings: {
          model: '=ngModel',
          inputId: '@',
          disabled: '=ngDisabled',
          changed: '&ngChange',
          department: '<',
          site: '<',
          requester: '<',
          client: '<'
        },
        controller: RequisitionTemplateListController
      };

      /* @ngInject */
      function RequisitionTemplateListController($log, $q, $timeout, Translate, ControlLookupDatasourceService) {

        var self = this;
        self.searchText = '';
        self.collection = [];
        var fetchFromDatabase = true;

        //Will listen changes on the parent component.
        self.$onChanges = function(changes) {
          //When properties changes, always "reset" the list.
          if (isDirty(changes.department) ||
            isDirty(changes.site) ||
            isDirty(changes.requester) ||
            isDirty(changes.client)) {

            self.collection = [];
            fetchFromDatabase = true;

            if (isNull(changes.department) ||
              isNull(changes.site) ||
              isNull(changes.requester)) {
              self.searchText = '';
              self.model = undefined;
            }
          }
        };

        function isDirty(object) {
          if (!_.isNil(object)) {
            return object.currentValue !== object.previousValue;
          } else {
            return false;
          }
        }

        function isNull(object) {
          if (!_.isNil(object)) {
            return object.currentValue === null;
          } else {
            return false;
          }
        }

        self.updateModel = function() {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function() {
            self.changed();
          });
        };

        self.getItems = function() {
          var deferred = $q.defer();

          if (!fetchFromDatabase) {
            return self.collection;
          }
          else if (_.isNil(self.department) ||
            _.isNil(self.site) ||
            _.isNil(self.requester)) {
            self.collection = [];
            return self.collection;
          }
          else {
            var params = {
              departmentId: self.department.id,
              siteId: self.site.id,
              requesterId: self.requester.id,
              clientId: self.client ? self.client.id : undefined
            };
            ControlLookupDatasourceService
              .getRequisitionTemplates(params)
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
                  deferred.reject('Problem getting template data [' + error + ']');
                }
              )
            ;
          }

          return deferred.promise;
        };
      }

      return cdo;
    }
  }
)();
