(
  function() {
    'use strict';

    angular
      .module('app.commons.popup')
      .config(config)
    ;

    /* @ngInject */
    function config(PopupServiceProvider) {
      // Initialize Popup service
      PopupServiceProvider.setPaths({
          viewPaths : {
              info: 'info.html',
              warn: 'warning.html',
              error: 'error.html',
              confirm: 'confirm.html',
              wait: 'wait.html',
              frame: 'frame.html',
              prompt: 'prompt.html',
              input: 'input.html'
          },
          windowTemplatePaths : {
              embedded: 'embedded-modal.html',
              embeddedConstrained: 'embedded-constrained-modal.html',
              embeddedFullHeightConstrained: 'embedded-full-height-constrained-modal.html'
          }
      });
    }
  }
)();
