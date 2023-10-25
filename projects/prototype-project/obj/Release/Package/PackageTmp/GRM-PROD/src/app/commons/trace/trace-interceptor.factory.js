;(
  function() {
    'use strict';

    angular
      .module('app.commons.trace')
      .factory('TraceInterceptor', TraceInterceptorFactory)
    ;

    /* @ngInject */
    function TraceInterceptorFactory($log, $q, Paths, TraceService) {
      return {
        request: request,
        response: response,
        requestError: requestError,
        responseError: responseError
      };

      function traceStart(label) {
        if (label.indexOf(Paths.getApiPath()) !== -1) {
          $log.start(label);
        }
      }
      function traceStop(label) {
        if (label.indexOf(Paths.getApiPath()) !== -1) {
          $log.stop(label);
        }
      }

      function request(config) {
        var deferred = $q.defer();
        // Inject profiling header for API calls only
        if (TraceService.isTracingDisabled() || config.url.indexOf(Paths.getApiPath()) === -1) {
          deferred.resolve(config);
        } 
        else {
          configure();
        }
  
        function configure() {
          config.headers = config.headers || {};
          // angular js remove content-type if no data.
          if (_.isNil(config.data)) {
            config.data = '';
          }
          config.headers['X-PROFILING'] = true;
          deferred.resolve(config);
        }

        return deferred.promise;
      }
  
      function response(response) {
        traceStop(response.config.url);

        if (!TraceService.isTracingDisabled()) {
            // TODO: Implement sort of a metrics handler...
          if (response.headers('X-PROFILING-METRICS')) {
            var metrics = angular.fromJson(response.headers('X-PROFILING-METRICS'));
            $log.table(metrics);
            // Login of every layer details
            // if (metrics.businessProcessing) {
            //   $log.table(metrics.businessProcessing.processingDetails);
            // }
            // if (metrics.databaseCrudProcessing) {
            //   $log.table(metrics.databaseCrudProcessing.processingDetails);
            // }
            // if (metrics.databaseStoredProcedureProcessing) {
            //   $log.table(metrics.databaseStoredProcedureProcessing.processingDetails);
            // }
            // if (metrics.b2BProcessing) {
            //   $log.table(metrics.b2BProcessing.processingDetails);
            // }
          }
        }
        return response;
      }
  
      function requestError(rejection) {
        traceStop(rejection.config.url);
        return $q.reject(rejection);
      }
  
      function responseError(rejection) {
        traceStop(rejection.config.url);
        return $q.reject(rejection);
      }
    }
  }
)();
