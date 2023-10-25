(
  function() {
    'use strict';

    angular
      .module('app.controls.account-list')
      .component('accountList', accountList());

    function accountList() {
      var cdo = {
        templateUrl: 'account-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          requesterId: '<',
          requisitionTypeCode: '<',
          productId: '<',
          allowFetchDefaultProjectActivity: '<'
        },
        controller: AccountListController
      };

      /* @ngInject */
      function AccountListController(
          $q,
          $log,
          $timeout,
          $document,
          ControlLookupDatasourceService,
          DynamicLookupService,
          ProjectActivityApiService)
      {

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

        self.$onChanges = function(changesObj) {
          if ((changesObj.requesterId && changesObj.requesterId.currentValue !== changesObj.requesterId.previousValue) ||
              (changesObj.requisitionTypeCode && changesObj.requisitionTypeCode.currentValue !== changesObj.requisitionTypeCode.previousValue)) {
            self.collection = [];
            self.fetchFromDatabase = true;

            if ((changesObj.requesterId && _.isNil(changesObj.requesterId.currentValue)) ||
              (changesObj.requisitionTypeCode && _.isNil(changesObj.requisitionTypeCode.currentValue))) {
              self.searchText = '';
              self.model = undefined;
            }
          }
        };

        self.onSearchTextChanged = function onSearchTextChanged() {
            self.fetchFromDatabase = true;
        };

        self.updateModel = function () {

          if ((self.allowFetchDefaultProjectActivity) && !_.isNil(self.model)) {
            ProjectActivityApiService.getDefaultProjectActivityForAccount(self.model.id).then(
              function success(object) {
                if (!_.isNil(object)) {
                  self.model = _.extend(self.model, { projectActivity: object });
                }
                delayedChanged();
              },
              function failure(reason) {
                $log.erreur('Problem getting default project activity data [' + reason + ']');
              }
            );
          } else {
            delayedChanged();
          }
        };

        function delayedChanged() {
          //force instructions within timeout to be executed in the next digest cycle to be sure that the model is updated.
          $timeout(function () {
            self.changed();
          });
        }

        self.fetchMoreAccounts = function () {
          var pagingParams = {
            skip: self.collection.length,
            take: 50,
            criteria: self.searchText && self.searchText.length ? self.searchText : undefined,
            requesterId: self.requesterId,
            requisitionType: self.requisitionTypeCode,
            showOnlyActive : true,
            expanded: self.requisitionTypeCode ? (DynamicLookupService.getRequisitionTypes()._1.code !== self.requisitionTypeCode ? true : undefined) : undefined
          };
          return getAccounts(true, pagingParams);
        };

        self.fetchAccounts = function () {
          var pagingParams = {
            skip: 0,
            take: 50,
            criteria: self.searchText && self.searchText.length ? self.searchText : undefined,
            requesterId: self.requesterId,
            requisitionType: self.requisitionTypeCode,
            showOnlyActive : true,
            expanded: self.requisitionTypeCode ? (DynamicLookupService.getRequisitionTypes()._1.code !== self.requisitionTypeCode ? true : undefined) : undefined
          };
          return getAccounts(false, pagingParams);
        };

        function getAccounts(nextPage, pagingParams) {
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

            self.fetchFromDatabase = false;
            self.deferred = $q.defer();
            var searchParams = {
              params: pagingParams,
              promise: self.deferred.promise
            };

            ControlLookupDatasourceService
              .getAccounts(searchParams)
              .then(
                function success(response) {
                  if (nextPage) {
                    self.collection = self.collection.concat(response.data);
                  }
                  else {
                    self.collection = response.data;
                  }
                  self.totalRecordsCount = response.headers('records-count');
                  deferred.resolve(self.collection);
                },
                function failure(error) {
                  deferred.reject('Problem getting statistical unit data [' + error + ']');
                }
              )
            ;
          }
          return deferred.promise;
        }

      }
      return cdo;
    }
 }
)();
