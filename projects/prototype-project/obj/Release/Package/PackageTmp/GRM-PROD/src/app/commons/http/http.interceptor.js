(function () {
  'use strict';

  angular
    .module('app.commons.http')
    .factory('httpInterceptor', httpInterceptor)
  ;

  /* @ngInject */
  function httpInterceptor($q, $log, Cultures, GuidService) {
    var request = function (config) {
      var deferred = $q.defer();
      configure();
      return deferred.promise;

      function configure() {
        config.headers = config.headers || {};
        // angular js remove content-type if no data.
        if (_.isNil(config.data)) {
          config.data = '';
        }

        config.headers['X-LANGUAGE'] = Cultures.getCurrentCulture().code;
        config.headers['X-CALLER-ID'] = 'GRMWEB';
        config.headers['X-CORRELATION-ID'] = GuidService.newGuid();
        deferred.resolve(config);
      }
    };

    function transformRejection(rejection) {
      return {
        status: rejection.status,
        code: rejection.data ? _.lowerFirst(rejection.data[0].ErrorCode) : rejection.statusText,
        description: rejection.data ? rejection.data[0].ErrorMessage : rejection.statusText,
        params: [],
        original: rejection
      };
    }

    function response(response) {
      return response;
    }

    function responseError(rejection) {
      return $q.reject(transformRejection(rejection));
    }

    return {
      request: request,
      response: response,
      responseError: responseError
    };
  }
})();
