;(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition-follow-up')
      .component('requisitionFollowUp', requisitionFollowUp())
    ;

    function requisitionFollowUp() {
      var cdo = {
        templateUrl: 'requisition-follow-up.template.html',
        controller: RequisitionFollowUpController,
        bindings: {
          stateChangeHandler: '&',
          stateModel: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function RequisitionFollowUpController(
      $filter,
      $log,
      $mdSidenav,
      $q,
      $scope,
      ApplicationParameters,
      DynamicLookupService,
      NotificationHandler,
      PopupService,
      RequisitionFollowUpApiService,
      SystemLookupService,
      Translate,
      UserProfileService
    ) {
      var self = this;
      var deregisterRefreshFollowUpList;

      // /////////////////
      // Lifecycle - begin
      //
      self.$onInit = function $onInit() {
        setup();
        if (self.stateModel.isPristine) {
          buildFilters();
        }
        fetchItems()
          .then(
            function success(response) {
              // set indicator
              self.model.searchCriteriaApplied = !self.isSearchCriteriaPristine();

              if (self.stateModel.isPristine) {
                // Preset filters - which is enabled, which is not...
                presetFilters();
              }

              if (self.model.searchCriteriaApplied) {
                applySearchCriteria(false);
              }

              // Filter item list
              applyFilters();

              // Update counters
              updateFilterCounters();

              // Sort filtered list
              applySorting();

              // Select first row in item list
              selectRow(self.model.selectedIndex);

              // */*/*/*/*/*/*/*/
              // !! HACK ALERT !!
              //
              // "restored" flag is set on sorting object, meaning the sorting was restored from state... deleting it will force the
              // stSortingHelper directive to trigger, thus restoring the stTable's sort attribute  which is what we want in this case
              if (self.model.sorting.restored) {
                delete self.model.sorting.restored;
              }

              // Update state
              notifyStateChange();
            },
            function failure(reason) {
              NotificationHandler.error({ messageOrKey: reason.description, translate: false });
            }
          )
        ;
      };

      self.$onChanges = function $onChanges(changesObj) {};

      self.$onRefreshFollowUpList = function $onRefreshFollowUpList(ev) {
        fetchItems()
          .then(
            function success(response) {

              if (self.model.searchCriteriaApplied) {
                applySearchCriteria(false);
              }

              // Filter item list
              applyFilters();

              // Update counters
              updateFilterCounters();

              // Sort filtered list
              applySorting();

              // Select first row in item list
              selectRow(self.model.selectedIndex);
            },
            function failure(reason) {
              NotificationHandler.error({ messageOrKey: reason.description, translate: false });
            }
          )
        ;
      };
      deregisterRefreshFollowUpList = $scope.$on('refreshFollowUpList', self.$onRefreshFollowUpList);

      self.$onDestroy = function $onDestroy() {
        if (_.isFunction(deregisterRefreshFollowUpList)) {
          deregisterRefreshFollowUpList();
        }
      };
      $scope.$on('$destroy', self.$onDestroy);
      //
      // Lifecycle - end
      // ///////////////

      // //////////////////////////////
      // Filters event handlers - begin
      //

      // Click handler for main filter items
      self.onFilterClick = function onFilterClick($event, filter) {
        if ($event) {
          $event.preventDefault();
        }

        if (filter.count <= 0) {
          return;
        }

        // Flip filter state
        filter.on = !filter.on;

        // In all cases, flip all sub filters on
        _.forEach(self.model.filters, function onFilters(filter) {
          _.forEach(filter.subFilters, function onSubFilters(subFilter) {
            if (subFilter.count > 0) {
              subFilter.on = filter.on;
            }
          });
        });

        applyFilters();
        applySorting();
        selectRow(0);
        notifyStateChange();
      };

      self.onSubFilterClick = function onSubFilterClick($event, filter, subFilter) {
        if ($event) {
          $event.preventDefault();
        }

        subFilter.on = !subFilter.on;
        // Safety - since click the last available subfilter will remove it
        // and its siblings from the dom, the mouse leave event may never occur
        subFilter.hovered = false;
        ensureFilterCoherence(filter);

        applyFilters();
        applySorting();
        selectRow(0);
        notifyStateChange();
      };

      //
      // Filters event handlers - end
      // ////////////////////////////

      // /////////////////
      // Card view - begin
      self.showCardViewToggle = function showCardViewToggle() {
        return !_.isNil(self.model.selectedIndex);
      };

      self.onCardView = function onCardView($event) {
        if ($event) {
          $event.preventDefault();
        }

        if (_.isNil(self.model.selectedIndex)) {
          return;
        }

        function selectionChangeCallback(index) {
          selectRow(index);
        }

        PopupService.popup({
          fullHeight: true,
          component: 'requisitionFollowUpItemPreview',
          size: 'xxl',
          windowClass: 'lightbox-container',
          resolve: {
            pos: function pos() { return self.model.selectedIndex; },
            items: function items() {
              return _.map(self.model.filteredItems, function onItems(item) {
                return { requisitionItemId: item.id, requisitionFollowUpItem: undefined };
              });
            },
            item: function item() {
              return RequisitionFollowUpApiService.getFollowUpItem({
                requisitionItemId: self.model.filteredItems[self.model.selectedIndex].id,
                expanded: true,
                blockUI: true,
                showSpinner: true
              });
            },
            callbacks: function callbacks() {
              return {
                selectionChangeCallback: selectionChangeCallback
              };
            }
          }
        });
      };
      // Card view - end
      // ///////////////

      // //////////////////////////////////
      // Search criteria management - begin
      /**
       * Toggle the display of the search criteria side window
       *
       * @param {event} $event - The event object which triggered the action
       */
      self.onShowSearchCriteria = function onShowSearchCriteria($event) {
        if ($event) {
          $event.preventDefault();
        }
        toggleSidePanel();
      };

      /**
       * Closes the search criteria side window
       *
       * @param {event} $event - The event object which triggered the action
       */
      self.onCloseSearchCriteria = function onCloseSearchCriteria($event) {
        if ($event) {
          $event.preventDefault();
        }
        toggleSidePanel();
      };

      /**
       * Apply the selected search criteria to the current list of follow-up items.
       */
      self.onApplySearchCriteria = function onApplySearchCriteria($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.model.searchCriteriaApplied = true;

        applySearchCriteria(true);
        applySorting();
        selectRow(0);
        notifyStateChange();
        toggleSidePanel();
      };

      /**
       * Clear the current search criteria and restore the complete list of follow-up items
       */
      self.onClearSearchCriteria = function onClearSearchCriteria($event) {
        if ($event) {
          $event.preventDefault();
        }

        self.model.searchCriteriaApplied = false;
        self.model.searchCriteria = _.extend({}, self.pristineState.searchCriteria);

        // Restore the default filters snapshot
        // restoreFiltersSnapshot();
        self.model.initialFilters.statusGroups = [SystemLookupService.requisitionFollowupsStatusGroups[0].code];
        self.model.initialFilters.statuses = [];
        clearAllFilters();
        presetFilters();
        applyFilters();
        applySorting();
        updateFilterCounters();
        selectRow(self.model.selectedIndex);
        notifyStateChange();
      };

      self.isSearchCriteriaValid = function isSearchCriteriaValid() {
        return $scope.followUpSearchFiltersForm.$valid;
      };

      /**
       * Indicates if the current state of the search criteria is pristine or not.
       *
       * @returns {Boolean} - true if search criteria are pristine, otherwise false
       */
      self.isSearchCriteriaPristine = function isSearchCriteriaPristine() {
        // current search criteria are either equal to their pristine counterpart...
        return _.isEqual(self.model.searchCriteria, self.pristineState.searchCriteria) ||
          (
            // ... or every editable search criterion is empty/null/undefined
            (_.isNil(self.model.searchCriteria.requisitionNumber) || _.isEmpty(self.model.searchCriteria.requisitionNumber)) &&
            (_.isNil(self.model.searchCriteria.productNumber) || _.isEmpty(self.model.searchCriteria.productNumber)) &&
            _.isNil(self.model.searchCriteria.requiredOnFrom) &&
            _.isNil(self.model.searchCriteria.requiredOnTo) &&
            (_.isNil(self.model.searchCriteria.lateSince) || _.isEmpty(self.model.searchCriteria.lateSince)) &&
            (_.isNil(self.model.searchCriteria.productDescription) || _.isEmpty(self.model.searchCriteria.productDescription))

            //
            // ...for the moment, explicitely omit checking of requesterId, department and requesterInvolved
            //
          )
        ;
      };
      //
      // Search criteria management - end
      // ////////////////////////////////

      // ///////////////////////
      // List management - begin

      // List item selection handler
      self.onRowSelect = function onRowSelect($event, $index) {
        if ($event) {
          $event.preventDefault();
        }
        selectRow($index);
        notifyStateChange();
      };

      function selectRow(targetIndex) {
        // No index provided... exit
        if (_.isNil(targetIndex)) {
          return;
        }

        // Provided index won't match any item in list... exit
        if (targetIndex < 0 || targetIndex >= self.model.displayedItems.length) {
          return;
        }

        self.model.displayedItems.forEach(function(item, index) {
          item.selected = false;
          if (targetIndex === index) {
            item.selected = true;
          }
        });
        self.model.selectedIndex = targetIndex;
      }

      // List management - end
      // /////////////////////

      // ///////////////
      // Sorting - begin
      self.itemsTableActionHandler = function itemsTableActionHandler(tableState, tableCtrl) {
        if (_.isNil(self.model) || _.isNil(self.model.filteredItems) || self.model.filteredItems.length === 0) {
          return;
        }
        //
        var sort = tableState.sort;

        self.model.sorting.by = sort.predicate ? [sort.predicate] : [];
        self.model.sorting.descending = sort.reverse || false;

        applySorting();
        selectRow(computeSelectedIndex());
        notifyStateChange();

      };
      // Sorting - end
      // /////////////

      // /////////////////////////
      // Utility functions - begin
      //

      /**
       * Returns a filter object, which is either the sole selected filter, or a dummy filter - for display purposes
       */
      self.getFilterObj = function getFilterObj() {
        var res = _.filter(self.model.filters, { on: true });

        var obj;
        if (res.length === 1) {
          obj = res[0];
        }
        else {
          // create a dummy
          obj = {
            isPrimary: false,
            subFilters: [],
            on: false,
            count: 0
          };
        }

        return obj;
      };

      /**
       * Determine if sub filters show be displayed. At least two sub filters having more than 0 items are needed to display sub filters.
       *
       * @returns {boolean} - true if condition is met, otherwise false
       */
      self.showSubFilters = function showSubFilters() {
        var filter = self.getFilterObj();
        if (filter.subFilters && filter.subFilters.length) {
          return _.filter(filter.subFilters, function predicate(value) { return value.count > 0; }).length > 1;
        }
        return false;
      };

      // Switch between singular or plural
      self.getDaysLateMsg = function getDaysLateMsg(daysLate) {
        var key = 'dayLate';
        if (daysLate > 1) {
          key = 'daysLate';
        }
        return daysLate + ' ' + Translate.instant(key);
      };

      /**
       * Setup filter list
       */
      function buildFilters() {
        var filters = [];
        _.forEach(ApplicationParameters.getApplicationParameters().requisitionParameters.followupsStatusGroups, function iteratee(statusGroup, index) {
          // Create a main filter object
          var filter = {
            on: false,
            code: statusGroup.code,
            description: statusGroup.description,
            count: 0,
            isPrimary: 0 === index,
            subFilters: []
          };

          if (statusGroup.statuses) {
            _.forEach(statusGroup.statuses, function iteratee(status) {

              // Create a sub filter objects
              var subFilter = {
                on: false,
                hovered: false,
                code: status.code,
                description: status.description,
                count: 0
              };
              filter.subFilters.push(subFilter);
            });
          }

          filters.push(filter);
        });
        self.model.filters = filters;
      }

      /**
       * Keep a pristine copy of the filter groups
       */
      function takeFiltersSnapshot() {
        self.model.pristineFilters = _.arrayCopy(self.model.filters);
      }

      /**
       * Restore filter groups pristine copy
       */
      function restoreFiltersSnapshot() {
        self.model.filters = _.arrayCopy(self.model.pristineFilters);
      }

      /**
       * Update the filters/sub-filters counters
       */
      function updateFilterCounters() {
        var targetCollection = self.model.searchCriteriaApplied ? self.model.searchedItems : self.model.items;

        if (!targetCollection || !targetCollection.length) {
          return;
        }

        _.forEach(self.model.filters, function onFilters(filter) {
          filter.count = 0;
          _.forEach(filter.subFilters, function onSubFilters(subFilter) {
            subFilter.count = 0;
            _.forEach(targetCollection, function onItems(item) {
              if (item.status === subFilter.code) {
                subFilter.count++;
                filter.count++;
              }
            });
          });
        });
      }

      /**
       * Preset filters, according to provided parameters, from the URL's query string or from the ui-router configuration.
       *
       * Precondition : at least one status group must be provided
       */
      function presetFilters() {
        // at least one status group must be provided
        if (self.model.initialFilters.statusGroups.length > 0) {
          var alreadyManaged = [];
          var revisit = false;
          _.forEach(self.model.filters, function onFilters(filter) {
            if (_.indexOf(self.model.initialFilters.statusGroups, filter.code) > -1) {
              // enable filter if present in provided status groups
              filter.on = true;
            }

            // keep track of if a sub filter was found for current filter
            var subFilterFound = false;
            _.forEach(filter.subFilters, function onSubFilters(subFilter) {

              // parent filter is enabled already
              if (true === filter.on) {
                // if more than one status group was provided, enable sub filter by default...
                if (true === self.model.initialFilters.statusGroups.length > 1) {
                  subFilter.on = true;
                  subFilterFound = true;
                  alreadyManaged.push(subFilter.code);
                }
                else {
                  // ... otherwise see if current sub filter is in the provided statuses, all the while discarding it if it was already managed
                  if (_.indexOf(self.model.initialFilters.statuses, subFilter.code) > -1 && _.indexOf(alreadyManaged, subFilter.code) === -1) {
                    subFilter.on = true;
                    subFilterFound = true;
                    alreadyManaged.push(subFilter.code);
                  }
                }
              }
              // // parent filter is NOT enabled
              // else {
              //   // see if current sub filter is in the provided statuses, all the while discarding it if it was already managed
              //   if (_.indexOf(self.model.initialFilters.statuses, subFilter.code) > -1 && _.indexOf(alreadyManaged, subFilter.code) === -1) {
              //     filter.on = subFilter.on = true;
              //     subFilterFound = true;
              //     alreadyManaged.push(subFilter.code);
              //
              //     // if there status groups were provided and this sb filter's parent is not enabled, revisit later
              //     if (self.model.initialFilters.statusGroups.length > 0) {
              //       revisit = true;
              //     }
              //   }
              // }
            });

            // handle the case where the status group was provided without specific statuses
            if (true === filter.on && false === subFilterFound) {
              revisit = true;
            }
          });

          // revisiting - for each enabled filter, enable all sub filters
          if (true === revisit) {
            _.forEach(self.model.filters, function onFilters(filter) {
              if (true === filter.on) {
                _.forEach(filter.subFilters, function onSubFilters(subFilter) {
                  subFilter.on = true;
                });
              }
            });
          }
        }
        // Keep a pristine copy of the filters
        takeFiltersSnapshot();
      }

      /**
       * Make certain a given filter has at least one of its sub filters enabled, otherwise disable filter
       */
      function ensureFilterCoherence(filter) {
        var found = false;
        _.forEach(filter.subFilters, function onSubFilters(subFilter) {
          if (true === subFilter.on) {
            found = true;
          }
        });
        if (false === found) {
          filter.on = false;
        }
      }

      /**
       * Clear current filter selection
       */
      function clearAllFilters() {
        // Update preset filters (top bar)
        _.forEach(self.model.filters, function filterIterator(filter) {
          filter.count = 0;
          filter.on = false;
          _.forEach(filter.subFilters, function subFilterIterator(subFilter) {
            subFilter.count = 0;
            subFilter.on = false;
          });
        });
      }

      /**
       * Fetch items data for the current status groups, statuses, filter criteria and paging/sorting criteria
       *
       * @returns {promise} - A promise object
       */
      function fetchItems() {
        var deferred = $q.defer();

        self.model.fetching = false;
        RequisitionFollowUpApiService
          .searchFollowUpItems({
            searchCriteria: {
              requesterId: self.model.searchCriteria.requesterId,
              isRequesterInvolved: self.model.searchCriteria.isRequesterInvolved,
              departmentId: self.model.searchCriteria.departmentId !== -1 ? self.model.departmentId : undefined,
              expanded: false
            },
            blockUI: true,
            showSpinner: true
          })
          .then(
            function success(response) {
              self.model.items = /* self.model.displayedItems =*/ response.items;

              deferred.resolve();
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
          .finally(function onFinally() {
            self.model.fetching = false;
          })
        ;
        return deferred.promise;
      }

      /**
       * Set up the component's instance variables. MUST at least be invoked from the $onInit life cycle hook
       */
      function setup() {
        // Clone state model
        // self.stateModel = self.stateModel.clone();

        // Get pristine state
        self.pristineState = self.stateModel.getPristineState();

        // Define local data model
        self.model = {

          // Summary data
          summaries: [],

          // Items list
          items: [],

          // The list of the currently displayed items - this is the ordered list
          displayedItems: [],

          // The list of the currently filtered items - this is the reference, unordered list
          filteredItems: [],

          searchedItems: [],

          // Available filters
          filters: _.arrayCopy(self.stateModel.filters),

          // A pristine copy of the available filters
          pristineFilters: _.arrayCopy(self.stateModel.pristineFilters),

          // Initial filters TODO remove this... should be located in state??
          initialFilters: {
            // A specific requester id
            requesterId: self.stateModel.requesterId,
            // A list of requested status groups
            statusGroups: !self.stateModel.statusGroups.length && !self.stateModel.statuses.length ? [SystemLookupService.requisitionFollowupsStatusGroups[0].code] : self.stateModel.statusGroups,
            // A list of requested statuses
            statuses: self.stateModel.statuses
          },

          // Available requester list
          requesterList: [{ id: -1, name: Translate.instant('all') }, { id: UserProfileService.getCurrentProfile().id, name: UserProfileService.getCurrentProfile().name }],

          // Available administrative unit list
          administrativeUnitList: [{id: -1, name: Translate.instant('all')}],

          // "Currently fetching" indicator
          fetching: false,

          // A flag indicating if search filters are currently applied to the list
          searchCriteriaApplied: false,

          // Search criteria
          searchCriteria: _.extend({}, self.stateModel.searchCriteria),

          // The currently selected row index
          selectedIndex: self.stateModel.selectedIndex,

          // Sorting
          sorting: {
            by: _.arrayCopy(self.stateModel.sorting.by),
            descending: self.stateModel.sorting.descending,
            restored: self.stateModel.sorting.by.length
          },
        };
      }

      function applySearchCriteria(updatePresetFilters) {
        // flags for final decision in loop
        var requisitionNumberFlag;
        var productNumberFlag;
        var requiredDateFromToFlag;
        var lateSinceFlag;
        var productDescriptionFlag;

        // Actual values used to perform the filtering
        var fromMoment;
        var toMoment;
        var lateSince = 0;
        var productDescriptionTokens = [];

        // date required from/to - moment instances
        if (!_.isNil(self.model.searchCriteria.requiredOnFrom)) {
          fromMoment = moment(self.model.searchCriteria.requiredOnFrom);
        }
        if (!_.isNil(self.model.searchCriteria.requiredOnTo)) {
          toMoment = moment(self.model.searchCriteria.requiredOnTo);
        }

        // compute value for late since criteria, if applicable
        if (!_.isNil(self.model.searchCriteria.lateSince) && !_.isEmpty(self.model.searchCriteria.lateSince)) {
          lateSince = _.parseInt(self.model.searchCriteria.lateSince);
        }

        // compute string segments to search for in product description
        if (!_.isNil(self.model.searchCriteria.productDescription) && !_.isEmpty(self.model.searchCriteria.productDescription)) {
          productDescriptionTokens = self.model.searchCriteria.productDescription.trim().split(' ');
        }

        // filter list, according to current search filters
        self.model.filteredItems = self.model.searchedItems = _.filter(self.model.items, function iteratee(item) {

          // reset flags
          requisitionNumberFlag = true;
          productNumberFlag = true;
          requiredDateFromToFlag = true;
          lateSinceFlag = true;
          productDescriptionFlag = true;

          // requisition number - exact match
          if (!_.isNil(self.model.searchCriteria.requisitionNumber) && !_.isEmpty(self.model.searchCriteria.requisitionNumber)) {
            requisitionNumberFlag = String(item.requisitionId) === self.model.searchCriteria.requisitionNumber;
          }

          // product number - exact match
          if (!_.isNil(self.model.searchCriteria.productNumber) && !_.isEmpty(self.model.searchCriteria.productNumber)) {
            productNumberFlag = String(item.productId) === self.model.searchCriteria.productNumber;
          }

          // required on from/to - compate up to day portion (ignore h:mm:ss:mmm)
          if (!_.isNil(fromMoment) || !_.isNil(toMoment)) {
            // item has no due date - skip
            if (_.isNil(item.dueDate)) {
              requiredDateFromToFlag = false;
            }
            // both search fields are specified
            else if (!_.isNil(fromMoment) && !_.isNil(toMoment)) {
              requiredDateFromToFlag = moment(item.dueDate).isBetween(fromMoment, toMoment, 'day', '[]'); // inclusive
            }
            // only from is specified
            else if (!_.isNil(self.model.searchCriteria.requiredOnFrom)) {
              requiredDateFromToFlag = moment(item.dueDate).isSameOrAfter(fromMoment, 'day');
            }
            // only to is specified
            else {
              requiredDateFromToFlag = moment(item.dueDate).isSameOrBefore(toMoment, 'day');
            }
          }

          // Days late
          if (lateSince > 0) {
            lateSinceFlag = !_.isNil(item.daysLate) && item.daysLate >= lateSince;
          }

          // product description - all tokens must match
          // TODO: since a logical AND is applied for space separated tokens, see if this is acceptable
          if (productDescriptionTokens.length > 0) {
            var count = 0;
            _.forEach(productDescriptionTokens, function iterator(token) {
              if (item.description.toLowerCase().indexOf(token.toLowerCase()) > -1) {
                count++;
              }
            });
            productDescriptionFlag = productDescriptionTokens.length === count;
          }

          return requisitionNumberFlag && productNumberFlag && requiredDateFromToFlag && lateSinceFlag && productDescriptionFlag;
        });

        if (true === updatePresetFilters) {
          // Update preset filters (top bar)
          _.forEach(self.model.filters, function onFilters(filter) {
            filter.count = 0;
            filter.on = false;
            _.forEach(filter.subFilters, function onSubFilters(subFilter) {
              subFilter.count = 0;
              subFilter.on = false;
              _.forEach(self.model.filteredItems, function onFilteredItems(item) {
                if (item.status === subFilter.code) {
                  subFilter.count++;
                  subFilter.on = true;
                  filter.count++;
                  filter.on = true;
                }
              });
            });
          });
        }
      }

      function applySorting() {
        var sortedItems = self.model.filteredItems;
        if (self.model.sorting.by.length) {
          sortedItems = $filter('orderBy')(self.model.filteredItems,self.model.sorting.by[0], self.model.sorting.descending);
        }
        self.model.displayedItems = sortedItems;
      }

      function applyFilters() {
        var filteredItems = [];
        var selectedRequisitionItemStatuses = getSelectedRequisitionItemStatuses();

        if (!selectedRequisitionItemStatuses.length) {
          filteredItems = self.model.searchCriteriaApplied ? self.model.searchedItems : self.model.items;
        }
        else {
          var target = self.model.searchCriteriaApplied ? self.model.searchedItems : self.model.items;
          filteredItems = _.filter(target, function iteratee(item) {
            return selectedRequisitionItemStatuses.indexOf(item.status) !== -1;
          });
        }

        self.model.filteredItems = filteredItems;
      }

      function getSelectedRequisitionItemStatuses() {
        var selection = [];

        _.forEach(self.model.filters, function onFilters(filter) {
          if (filter.on /*&& filter.count > 0*/) {
            _.forEach(filter.subFilters, function onSubFilters(subFilter) {
              if (subFilter.on /*&& subFilter.count > 0*/) {
                selection.push(subFilter.code);
              }
            });
          }
        });

        return selection;
      }

      function computeSelectedIndex() {
        var pos = 0;
        _.forEach(self.model.displayedItems, function iteratee(item) {
          if (item.selected) {
            self.model.selectedIndex = pos;
          }
          pos++;
        });
      }

      /**
       * Side panel toggler
       */
      function toggleSidePanel() {
        $mdSidenav('right-side-menu').toggle();
      }

      /**
       * Notify a change of state for this component
       */
      function notifyStateChange() {
        self.stateChangeHandler({
          obj: {
            selectedIndex: self.model.selectedIndex,
            filters: self.model.filters,
            pristineFilters: self.model.pristineFilters,
            sorting: self.model.sorting,
            paging: self.model.paging,
            searchCriteria: self.model.searchCriteria
          }
        });
      }

      //
      // Utility functions - end
      // ///////////////////////
    }
  }
)();
