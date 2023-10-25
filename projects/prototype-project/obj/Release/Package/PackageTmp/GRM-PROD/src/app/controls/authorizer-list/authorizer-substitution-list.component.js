(
  function() {
    'use strict';

    angular
      .module('app.controls.authorizer-list')
      .component('authorizerSubstitutionList', authorizerSubstitutionList());

    function authorizerSubstitutionList() {
      var cdo = {
        templateUrl: 'authorizer-substitution-list.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          requisitionId: '<',
          authorizerToSubstitute: '<'
        },
        controller: AuthorizerSubstitutionListController
      };

      /* @ngInject */
      function AuthorizerSubstitutionListController($q, $document, $timeout, RequisitionAuthorizerApiService) {

        var self = this;

        self.$onInit = function() {
          if (_.isNil(self.inputId)) {
            self.inputId = _.uniqueId('authorizerList_');
          }

          self.searchText = '';
          self.collection = [];
          self.totalRecordsCount = 0;
          self.fetchFromDatabase = true;
          self.deferred = undefined;
        };

        //Will listen changes on the parent component.
        self.$onChanges = function(changes) {
          //When requisition or authorizer changes, always "reset" the list.
          if (isDirty(changes.requisitionId) || isDirty(changes.authorizerToSubstitute)) {
            self.collection = [];
            self.fetchFromDatabase = true;

            if (isNull(changes.requisitionId) || isNull(changes.authorizerToSubstitute)) {
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

        self.fetchMoreAuthorizer = function() {
          var params = initPaging(self.collection.length / 50, self.searchText);
          return getAuthorizer(true, params);
        };

        self.fetchAuthorizer = function (searchText) {
          var params = initPaging(0, searchText);
          return getAuthorizer(false, params);
        };

        function getAuthorizer(nextPage, params) {
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
            RequisitionAuthorizerApiService
              .getAuthorizersForSubstitution(searchCfg)
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
                  deferred.reject('Problem getting authorizer data [' + error + ']');
                }
              )
            ;
          }
          return deferred.promise;
        }

        function initPaging(pageOffset, searchText) {
          var result = {
            paging : {
              pageOffset: pageOffset,
              pageSize: 50
            },
            requisitionId: self.requisitionId,
            authorizerToSubstituteAmount: self.authorizerToSubstitute ? self.authorizerToSubstitute.amount : null,
            isNonCataloguedToAuthorize: self.authorizerToSubstitute ? self.authorizerToSubstitute.isNonCataloguedToAuthorize : null,
            criteria: searchText
          };
          return result;
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
