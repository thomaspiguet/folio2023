(
  function() {
    'use strict';

    angular
      .module('app.layout.common.action-bar')
      .constant('ActionBarConstants', {
        // Idle state variants
        idle: 'idle',
        idleSuccess: 'idleSuccess',
        idleError: 'idleError',

        // Available
        cancel: 'cancel',
        complete: 'complete',
        delete: 'delete',
        save: 'save',

        // Occurring
        cancelling: 'cancelling',
        completing: 'completing',
        deleting: 'deleting',
        loading: 'loading',
        saving: 'saving',

        // Completed
        cancelled: 'cancelled',
        completed: 'completed',
        deleted: 'deleted',
        saved: 'saved',
      })
    ;
  }
)();
