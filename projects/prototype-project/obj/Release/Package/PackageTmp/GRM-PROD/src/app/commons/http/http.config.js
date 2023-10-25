(function () {
  'use strict';

  angular
    .module('app.commons.http')
    .config(configure);

  /* @ngInject */
  function configure($httpProvider) {

    // Add some custom interceptors
    $httpProvider.interceptors.push('httpInterceptor');
    $httpProvider.interceptors.push('loadingInterceptor');

    // Make certain we have a get attribute in the defaults.header config
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }

    //
    // By default, indicate no caching is desired, using the following
    // headers - this behaviour could be overridden for specific resources
    //

    // Forces caches to submit the request to the origin server for validation before releasing a cached copy.
    // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';

    // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since
    $httpProvider.defaults.headers.get['If-Modified-Since'] = new Date(null).toUTCString(); // Use current datetime

    // Same as Cache-Control: no-cache - for older clients
    // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  }
})();
