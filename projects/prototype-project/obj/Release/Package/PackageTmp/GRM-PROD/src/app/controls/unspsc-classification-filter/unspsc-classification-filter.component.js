(
  function() {
    'use strict';

    angular
      .module('app.controls.unspsc-classification-filter')
      .component('unspscClassificationFilter', unspscClassificationFilter());

    function unspscClassificationFilter() {
      var cdo = {
        templateUrl: 'unspsc-classification-filter.template.html',
        bindings: {
          inputId: '@',
          model: '=ngModel',
          disabled: '=ngDisabled',
          required: '=ngRequired',
          changed: '&ngChange',
          requireMatch: '<',
          expanded: '<'
        },
        controller: UnspscClassificationFilterController
      };

      /* @ngInject */
      function UnspscClassificationFilterController($log,
                                                    $scope,
                                                    $q,
                                                    $document,
                                                    $timeout,
                                                    UnspscClassificationObjectService,
                                                    UnspscClassificationApiService) {

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

        if (_.isNil(self.requireMatch)) {
          self.requireMatch = true; //Default requireMatch to true.
        }

        self.getDisplayedValue = function(item) {
          if (!_.isNil(item)) {
            if (!_.isNil(item.id)) {
              return (item.code + ' - ' + item.description);
            } else {
              return item.code;
            }
          } else if (!_.isNil(self.model)) {
            if (!_.isNil(self.model.id)) {
              return (self.model.code + ' - ' + self.model.description);
            } else {
              return self.model.code;
            }
          }
          return '\b'; //workaround as "item-text" value cannot be '' or null/undefined see : https://github.com/angular/material/issues/3760
        };

        self.onBlur = function () {
          if (!self.requireMatch) {
            if (!_.isNil(self.searchText) && self.searchText !== '') {
              /*We want to manually set the model value if search text is not equals to the selected item text.
               (selected item text will be empty if no item has been selected from the list...)*/
              if (self.searchText !== self.getDisplayedValue()) {
                //Remove all non-numeric characters from the search text.
                self.searchText = self.searchText.replace(/\D/g, '');
                //If no numeric characters is present, empty the filter.
                if (self.searchText === '') {
                  self.model = null;
                } else {
                  //Update the model code with the search text numerical characters.
                  self.model = UnspscClassificationObjectService.newInstance();
                  self.model.code = self.searchText;
                }
                self.updateModel();
              }
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

        self.fetchMoreUnspscClassification = function() {
          var params = {
            skip: self.collection.length,
            take: 50,
            criteria: self.searchText,
            expanded: Boolean(self.expanded)
          };
          return getUnspscClassification(true, params);
        };

        self.fetchUnspscClassification = function (searchText) {
          var params = {
            skip: 0,
            take: 50,
            criteria: searchText,
            expanded: Boolean(self.expanded)
          };
          return getUnspscClassification(false, params);
        };

        function getUnspscClassification(nextPage, params) {
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
            UnspscClassificationApiService
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
                  deferred.reject('Problem getting unspsc classification data [' + error + ']');
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
