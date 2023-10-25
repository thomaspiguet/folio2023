(
  function() {
    'use strict';

    angular
      .module('app.layout.statistic.product.product-statistic-chart')
      .component('productStatisticChart', productStatisticChart())
    ;

    function productStatisticChart() {
      var cdo = {
        templateUrl: 'product-statistic-chart.template.html',
        controller: ProductStatisticChartController,
        bindings: {
          department: '<',
          productId: '<',
          formatRelation: '<',
          financialYear: '<',
          allowToShowSince: '<'
        }
      };

      return cdo;
    }

    /* @ngInject */
    function ProductStatisticChartController(ProductConsumptionStatisticsApi,
                                             $log,
                                             $filter,
                                             $q,
                                             Translate,
                                             $timeout) {
      var self = this;
      self.year = _.toNumber(self.financialYear);
      self.years = [];
      var departmentCode = !_.isNil(self.department) ? self.department.code : '';
      self.labels = [];
      /*We want to draw the chart even if data is not fetched, so we can know the space that the chart will take.
       Canvas will not be visible until first data retrieval. that's why data is initialized to ['']*/
      self.data = [''];
      self.values = [];
      self.isInitializing = false;
      self.isChartRefreshing = false;
      self.isInitialized = false;
      //computeSeries();

      self.$onInit = function () {
        computeYears();
        setChartOptions();
        self.isInitializing = true;
        getProductsConsumptionStatistics().then(function(quantities) {
          computeSeries();
          computeChartLabels(quantities);
          self.isInitialized = true;
        });
      };

      self.onChangeYears = function onChangeYears() {
        self.isChartRefreshing = true;
        getProductsConsumptionStatistics().then(function() {
          computeSeries();
        });
      };

      function computeYears() {
        if (_.isNil(self.allowToShowSince)) {
          self.allowToShowSince = 3;
        } else if (!_.isNumber(self.allowToShowSince)) {
          $log.warn('productStatisticChart component : allowToShowStatsSince must be a number. value 3 defaulted.');
          self.allowToShowSince = 3;
        } else if (!_.inRange(self.allowToShowSince,1,15)) {
          $log.warn('productStatisticChart component : allowToShowStatsSince must be between 1 and 15. value 3 defaulted.');
          self.allowToShowSince = 3;
        }

        for (var year = self.year; year > self.year - self.allowToShowSince ; year--) {
          self.years.push({
            display: year - 1 + ' - ' + year,
            value: year
          });
        }
      }

      function computeSeries () {
        self.series = [Translate.instant('year') + ' ' + (self.year - 1),
          Translate.instant('year') + ' ' + self.year];
      }

      function computeChartLabels (quantities) {
        /*Compute XAxis labels from received quantities.
        Number of received quantities corresponds to number of labels (number of financial periods in one full year.)
        Typically, 01 to 12 or 13, depending on client.*/
        _.forEach(quantities, function(value, index) {
          self.labels.push(_.padStart(index + 1, 2, '0'));
        });
      }

      function computeTooltipItemLabel(qty, value) {
        return qty + ' (' + $filter('currency')(value, '$', 2) + ')';
      }

      function computeQuantityVariation(currentYearQty, previousYearQty) {
        return Translate.instant('quantity') + ' : ' + _.round(_.toNumber(currentYearQty) - _.toNumber(previousYearQty), 2);
      }

      function computeValueVariation(currentYearValue, previousYearValue) {
        return Translate.instant('value') + ' : ' + $filter('currency')(_.toNumber(currentYearValue) - _.toNumber(previousYearValue), '$', 2) +
            computeValueVariationPercentage(currentYearValue, previousYearValue);
      }

      function computeValueVariationPercentage(currentYearValue, previousYearValue) {
        return _.toNumber(previousYearValue) === 0 ? '' : ' (' + _.round((_.toNumber(currentYearValue) -
            _.toNumber(previousYearValue)) * 100 / Math.abs(_.toNumber(previousYearValue))) + '%)';
      }

      function getProductsConsumptionStatistics() {
        var deferred = $q.defer();
        $timeout(function() {
          var params = {
            currentYear: self.year,
            departmentId: !_.isNil(self.department) ? self.department.id : null,
            productId: self.productId,
            formatRelation: self.formatRelation
          };
          ProductConsumptionStatisticsApi.getProductsConsumptionStatistics(params).then(
              function success(response) {
                self.data = [
                  response.previousYear.quantities,
                  response.currentYear.quantities
                ];
                self.values = [
                  response.previousYear.values,
                  response.currentYear.values
                ];
                deferred.resolve(response.previousYear.quantities);
              },
              function failure(error) {
                $log.error('Problem getting product statistics data [' + error + ']');
                deferred.reject();
              }
          ).finally(function () {
            self.isInitializing = false;
            self.isChartRefreshing = false;
            deferred.resolve();
          });
        }, 600); //TODO : <<<TEMP>>> find a better way to prevent lag when integrated in popup with transform css transition ..
        return deferred.promise;
      }

      function setChartOptions() {
        self.options = {
          title: {
            text: Translate.instant('product') + ': ' + self.productId + ', ' + Translate.instant('administrativeUnit') + ': ' + departmentCode
          },
          tooltips: {
            callbacks: {
              title: function (items, data) {
                return Translate.instant('period') + ' ' + items[0].xLabel;
              },
              label: function (item, data) {
                return computeTooltipItemLabel(data.datasets[item.datasetIndex].data[item.index],
                    self.values[item.datasetIndex][item.index]);
              },
              beforeFooter: function (item, data) {
                return Translate.instant('variations') + ' : ';
              },
              footer: function (item, data) {
                //Returning an array here will generate a line feed after each element.
                return [computeQuantityVariation(data.datasets[1].data[item[1].index], data.datasets[0].data[item[0].index]),
                  computeValueVariation(self.values[1][item[1].index], self.values[0][item[0].index])
                ];
              },
            }
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: Translate.instant('quantities')
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: Translate.instant('periods')
              }
            }]
          }
        };
      }
    }
  }
)();
