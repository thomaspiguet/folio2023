(
  function() {
    'use strict';

    angular
      .module('app.commons.utils')
      .factory('UrlHelper', UrlHelperFactory)
    ;

    /* @ngInject */
    function UrlHelperFactory($log, $state, $stateParams) {
      var self = this;

      self.synchronizeUrl = function synchronizeUrl(configObj) {
        $state.go($state.current.name, configObj.params, { location: 'replace', notify: false, reload: false });
      };

      self.reload = function reload() {
        $state.transitionTo($state.current, $stateParams, {reload: true, inherit: false, notify: true});
      };

      return self;
    }
  }
)();
