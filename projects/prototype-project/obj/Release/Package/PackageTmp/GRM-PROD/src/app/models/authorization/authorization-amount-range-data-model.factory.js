; (
  function () {
    'use strict';

    angular
      .module('app.models.authorization')
      .factory('AuthorizationAmountRangeDataModel', AuthorizationAmountRangeDataModelFactory)
      ;

    /* @ngInject */
    function AuthorizationAmountRangeDataModelFactory(uuid4) {

      function AuthorizationAmountRangeDataModel(obj) {
        var that = _.extend({
          id: undefined,
          modelId: undefined,
          amountRanges: [],
          totalCount: 0,
          technicalCount: 0,
          technicalsSelected: false
        }, obj);

        // If we got a modelId, barely clone
        if (!_.isNil(obj.modelId)) {
          this.id = that.id;
          this.modelId = that.modelId;
          this.amountRanges = that.amountRanges;
          this.totalCount = that.totalCount || 0;
          this.technicalCount = that.technicalCount || 0;
          this.technicalsSelected = that.technicalsSelected || false;
          // ? Maybe remove angular $$ properties...
        }
        else {
          // Take all but technical ranges...
          this.amountRanges = _
            .chain(that.amountRanges)
            .filter(function (item) { return !item.isTechnicalGroup; })
            .value();

          // Let's add "selected" property to the target model
          _.forEach(this.amountRanges, function iterator(range) {
            range.selected = false;
            range.count = 0;
          });

          // Now, summarize technical groups counts, assuming it can have more
          // than one technical group...
          this.technicalCount = that.technicalCount;
          if (!this.technicalCount) {
            this.technicalCount = _.sumBy(that.amountRanges, function(item) {
              return item.isTechnicalGroup ? (item.count || 0) : 0;
            });
          }

          // Calculates the total count for all non technical groups...
          this.totalCount = _.sumBy(this.amountRanges, function(item) {
            return item.isTechnicalGroup ? 0 : (item.count || 0);
          });
          this.totalCount += (this.technicalCount || 0);
          this.technicalsSelected = that.technicalsSelected || false;

          // Generate model ID as long as we've got real data
          if (this.amountRanges.length > 0) {
            this.modelId = uuid4.generate();
          }
        }

        this.clone = function clone() {
          return new AuthorizationAmountRangeDataModel(this);
        };

        this.getSelectedAmountRanges = function getSelectedAmountRanges() {
          // Generate amount range filter array based on selected ranges
          var amountRanges = [];
          _.forEach(this.amountRanges, function iterator(range) {
            if (range.selected) {
              amountRanges.push({minimumAmount: range.minimumAmount, maximumAmount: range.maximumAmount});
            }
          }, this);

          return amountRanges;
        };
      }

      return AuthorizationAmountRangeDataModel;
    }
  }
) ();
