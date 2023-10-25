(
  function() {
    'use strict';

    angular
      .module('app.commons', [
        'app.commons.cultures',
        'app.commons.form',
        'app.commons.http',
        'app.commons.authentication',
        'app.commons.navigation',
        'app.commons.notification',
        'app.commons.paths',
        'app.commons.popup',
        'app.commons.translation',
        'app.commons.utils',
        'app.commons.version',
        'app.commons.trace'
      ])
    ;
  }
)();
