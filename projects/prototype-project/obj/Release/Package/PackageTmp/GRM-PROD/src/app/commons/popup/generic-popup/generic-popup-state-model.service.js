(
  function() {
    'use strict';

    angular
      .module('app.commons.popup.generic-popup')
      .factory('GenericPopupStateModel', GenericPopupStateModelFactory)
    ;

    /* @ngInject */
    function GenericPopupStateModelFactory() {
      return GenericPopupStateModel;

      function GenericPopupStateModel() {
        _.extend(this, {
          okButton: {
            disabled: false,
            hidden: false
          },
          closeButton: {
            disabled: false,
            hidden: false
          },
          cancelButton: {
            disabled: false,
            hidden: false
          }
        });
      }
    }
  }
)();
