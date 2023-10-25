;(
  function() {
    'use strict';

    angular
      .module('app.commons.trace')
      .config(configFn)
    ;

    /* @ngInject */
    function configFn($provide) {

      $provide.decorator('$log', $logDecorator);

      /* @ngInject */
      function $logDecorator($delegate, TraceService) {

        function start(label) {
          if (TraceService.isTracingDisabled()) {
            return;
          }
          console.time(label); // eslint-disable-line angular/log
        }

        function stop(label) {
          if (TraceService.isTracingDisabled()) {
            return;
          }
          console.timeEnd(label); // eslint-disable-line angular/log
        }

        function table(object, columns) {
          if (TraceService.isTracingDisabled()) {
            return;
          }
          console.table(object, columns); // eslint-disable-line angular/log
        }

        $delegate.start = start;
        $delegate.stop = stop;
        $delegate.table = table;

        return $delegate;
      }
    }
  }
)();
