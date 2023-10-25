(
  function() {
    'use strict';

    angular
      .module('app.layout.common')
      .constant('InteractionModes', {
        'ReadOnly': 'ReadOnly',
        'New': 'New',
        'Edit': 'Edit'
      })
    ;
  }
)();
