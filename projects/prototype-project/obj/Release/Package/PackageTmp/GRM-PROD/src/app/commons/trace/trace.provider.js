;(
  function() {
    'use strict';

    angular
      .module('app.commons.trace')
      .provider('TraceService', TraceServiceProvider)
    ;

    /* @ngInject */
    function TraceServiceProvider() {
      var provider = this;

      var tracing = false;

      provider.setTracingOn = function setTracingOn() {
        tracing = true;
      };

      provider.setTracingOff = function setTracingOff() {
        tracing = false;
      };

      provider.getTracing = function getTracing() {
        return tracing;
      };

      /* @ngInject */
      provider.$get = function $get() {
        var service = this;

        service.isTracingEnabled = function isTracingEnabled() {
          return true === provider.getTracing();
        };

        service.isTracingDisabled = function isTracingDisabled() {
          return false === provider.getTracing();
        };

        service.enableTracing = function enableTracing() {
          provider.setTracingOn();
        };

        service.disableTracing = function disableTracing() {
          provider.setTracingOff();
        };

        return service;
      };
    }
  }
)();
