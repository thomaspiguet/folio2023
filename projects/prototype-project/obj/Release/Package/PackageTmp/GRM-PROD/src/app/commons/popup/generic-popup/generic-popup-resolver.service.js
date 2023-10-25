(
    function() {
      'use strict';

      angular
          .module('app.commons.popup.generic-popup')
          .factory('GenericPopupResolver', GenericPopupResolverFactory)
      ;

      /* @ngInject */
      function GenericPopupResolverFactory(GenericPopupStateModel) {
        return GenericPopupResolver;

        function GenericPopupResolver() {
          _.extend(this,{
            config: {
              title: undefined,
              okButton: {
                action: undefined,
                text: undefined
              },
              closeButton: {
                action: undefined
              },
              cancelButton: {
                action: undefined
              },
              stateModel: new GenericPopupStateModel(),
              displayLogic: _.noop
            },
            innerComponentConfig: {
              name: undefined,
              changeHandlerBindingName: undefined,
              bindings: undefined
            }
          });

          Object.seal(this);
          Object.seal(this.config);
          Object.seal(this.config.okButton);
          Object.seal(this.innerComponentConfig);
        }
      }
    }
)();
