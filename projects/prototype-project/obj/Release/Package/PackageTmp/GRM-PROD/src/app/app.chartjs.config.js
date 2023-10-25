/**
 * ChartJS custom default global configuration for all the app.
 * @license Logibec
 */
(
  function() {
    'use strict';

    angular
      .module('app')
      .config(chartJsConfig)
    ;

    /* @ngInject */
    function chartJsConfig(
        $windowProvider,
        ChartJsProvider) {

      //get oneColor library global color parser
      var oneColor = $windowProvider.$get().one.color;

      function computeColor(hexColor, alpha) {
        if (_.isNil(alpha)) {
          alpha = 1;
        }
        return {
          backgroundColor: oneColor(hexColor).alpha(alpha).cssa(),
          borderColor: hexColor,
          hoverBackgroundColor: oneColor(hexColor).alpha(alpha).cssa(),
          hoverBorderColor: hexColor
        };
      }

      //TODO: styleguide must provide javascript structure for standardized colors.
      var colors = {
        cyan : '#13b7c6',
        darkCyan : '#0c818e',
        lightCyan: '#16cdd6',
        lighterCyan: '#1be0ea',
        softCyan: '#47c3ce',
        softerCyan: '#bce3e8',
        gray: '#888888',
        lightGray: '#f1f2f2'
      };

      var chartDefaultOptions = ChartJsProvider.$get().Chart.defaults;
      var chartGlobalOptions = chartDefaultOptions.global;

      //Default color for every chart.
      var chartColors = [
        computeColor(colors.darkCyan, 0.6),
        computeColor(colors.lightCyan, 0.6),
        computeColor(colors.cyan, 0.6),
        computeColor(colors.lighterCyan, 0.6),
        computeColor(colors.softCyan, 0.6),
        computeColor(colors.softerCyan, 0.6)
      ];

      ChartJsProvider.setOptions({
        chartColors: chartColors,
        responsive: true
      });

      chartGlobalOptions = _.extend(chartGlobalOptions, {
        defaultFontFamily: '\'Roboto\'',
        defaultFontSize: 12
      });

      chartGlobalOptions.tooltips = _.extend(chartGlobalOptions.tooltips, {
        enabled: true,
        titleFontStyle: 'normal',
        titleFontColor: colors.gray,
        backgroundColor: oneColor(colors.lightGray).alpha(0.9).cssa(),
        titleFontSize: 15,
        titleSpacing: 3,
        titleMarginBottom: 10,
        yPadding: 5,
        bodyFontColor: colors.gray,
        bodyFontSize: 15,
        bodySpacing: 5,
        footerFontStyle: 'normal',
        footerFontColor: colors.gray,
        footerFontSize: 12
      });

      chartGlobalOptions.legend = _.extend(chartGlobalOptions.legend, {
        display: true
      });

      chartGlobalOptions.title = _.extend(chartGlobalOptions.title, {
        fontSize: 14,
        fontStyle: 'normal',
        fontColor: '#000000',
        display: true
      });
    }
  }
)();
