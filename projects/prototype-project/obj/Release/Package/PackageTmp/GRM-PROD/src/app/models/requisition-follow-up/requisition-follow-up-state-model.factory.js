;(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-follow-up')
      .factory('RequisitionFollowUpStateModel', RequisitionFollowUpStateModelFactory)
    ;

    /* @ngInject */
    function RequisitionFollowUpStateModelFactory(SystemLookupService, UserProfileService) {

      var pristineState = {
        isPristine: true,
        selectedIndex: 0,
        sorting: {
          by: ['requisitionId'],
          descending: false
        },
        filters: [],
        pristineFilters: [],
        searchCriteria: {
          requisitionNumber: undefined,
          productNumber: undefined,
          requiredOnFrom: null,
          requiredOnTo: null,
          lateSince: undefined,
          productDescription: undefined,
          // The following should not be considered where determining if search criteria are pristine or not
          requesterId: UserProfileService.getCurrentProfile().id,
          departmentId: -1,
          isRequesterInvolved: true
        },
        requesterId: undefined,
        statusGroups: [],
        statuses: []
      };

      function RequisitionFollowUpStateModel(obj) {
        var self = this;

        self.isPristine = pristineState.isPristine;

        // Default selected index
        self.selectedIndex = pristineState.selectedIndex;

        // Default sorting
        self.sorting = _.extend({}, pristineState.sorting);

        // Default filters - empty array
        self.filters = _.arrayCopy(pristineState.filters);

        // Default pristine filters
        self.pristineFilters = _.arrayCopy(pristineState.pristineFilters);

        self.requesterId = pristineState.requesterId;
        self.statusGroups = pristineState.statusGroups;
        self.statuses = pristineState.statuses;

        // Default search criteria
        self.searchCriteria = _.extend({}, pristineState.searchCriteria);

        if (!_.isNil(obj)) {

          // If copying from another instance, consider this state as not pristine anymore
          self.isPristine = !_.isNil(obj.clearState) && true === obj.clearState;

          // Selected index
          if (obj.selectedIndex) {
            self.selectedIndex = obj.selectedIndex;
          }

          // Sorting
          if (obj.sorting) {
            self.sorting = _.extend({}, obj.sorting);
          }

          // Selected filters
          if (obj.filters) {
            _.forEach(obj.filters, function(filter) {
              var aFilter = {
                code: filter.code,
                description: filter.description,
                on: filter.on,
                count: filter.count,
                isPrimary: filter.isPrimary,
                subFilters: []
              };

              _.forEach(filter.subFilters, function(subFilter) {
                aFilter.subFilters.push({
                  code: subFilter.code,
                  description: subFilter.description,
                  on: subFilter.on,
                  hovered: subFilter.hovered,
                  count: subFilter.count
                });
              });

              self.filters.push(aFilter);
            });
            self.pristineFilters = _.arrayCopy(self.filters);
          }
          else {
            if (obj.pristineFilters) {
              self.pristineFilters = _.arrayCopy(obj.pristineFilters);
            }
          }

          // Search criteria
          if (obj.searchCriteria) {
            self.searchCriteria = _.extend({}, obj.searchCriteria);
          }

          if (obj.requesterId) {
            self.requesterId = obj.requesterId;
          }
          if (obj.statusGroups) {
            self.statusGroups = obj.statusGroups;
          }
          else if (obj.filters) {
            self.statusGroups = [];
            _.forEach(obj.filters, function iteratee(filter) {
              if (filter.on) {
                self.statusGroups.push(filter.code);
              }
            });
          }

          if (obj.statuses) {
            self.statuses = obj.statuses;
          }
          else {
            self.statuses = [];
            _.forEach(obj.filters, function iteratee(filter) {
              if (filter.on) {
                _.forEach(filter.subFilters, function iteratee(subFilter) {
                  if (subFilter.on) {
                    self.statuses.push(subFilter.code);
                  }
                });
              }
            });
          }
        }

        self.clone = function clone() {
          return new RequisitionFollowUpStateModel(this);
        };

        self.getPristineState = function getPristineState() {
          return _.extend({}, pristineState);
        };

      }

      return RequisitionFollowUpStateModel;
    }

  }
)();
