(
    function() {
      'use strict';

      angular
          .module('app.layout.requisition.authorizers-management')
          .service('AuthorizersManagementPopupResolver', AuthorizersManagementPopupResolverService)
      ;

      /* @ngInject */
      function AuthorizersManagementPopupResolverService(
        GenericPopupResolver,
        Translate,
        AuthorizersManagementActions,
        RequisitionModelManager,
        RequisitionDisplayLogicManager)
      {
        var resolver = new GenericPopupResolver();

        var modelManager = RequisitionModelManager;
        var displayLogic = RequisitionDisplayLogicManager;

        this.get = function () {
          return resolver;
        };

        this.computeAndGet = function (action) {
          computeResolver(action);
          return this.get();
        };

        function computeResolver (action) {
          var popupConfig = resolver.config;
          var popupInnerComponentConfig = resolver.innerComponentConfig;
          popupConfig.title = action === 'replace' ? Translate.instant('replaceAuthorizer') : Translate.instant('addAuthorizer');
          popupConfig.okButton.action = action === 'replace' ? AuthorizersManagementActions.replaceAuthorizer : AuthorizersManagementActions.addAuthorizer;
          popupConfig.okButton.text = action === 'replace' ? Translate.instant('replace') : Translate.instant('add');
          popupConfig.displayLogic = function(stateModel, dataModel)  {
            stateModel.okButton.disabled = action === 'replace' ?
                _.isNil(dataModel.authorizerFrom) || _.isNil(dataModel.authorizerTo) :
                _.isNil(dataModel.authorizer);
            stateModel.closeButton.hidden = true;
          };
          popupInnerComponentConfig.name = 'authorizersManagement';
          popupInnerComponentConfig.changeHandlerBindingName = 'editHandler';
          popupInnerComponentConfig.bindings = {
            configuration: {
              requisitionId: modelManager.getRequisitionHeaderModel().id,
              canAddAuthorizer: action === 'add' && !displayLogic.getRequisitionHeaderActionsStateModel().moreActions.manageAuthorizers.add.hidden,
              canReplaceAuthorizer: action === 'replace' && !displayLogic.getRequisitionHeaderActionsStateModel().moreActions.manageAuthorizers.replace.hidden
            },
            dataModel: modelManager.getRequisitionAuthorizerManagementModel(),
            stateModel: displayLogic.getRequisitionAuthorizerManagementStateModel().clone()
          };
        }
      }
    }
)();
