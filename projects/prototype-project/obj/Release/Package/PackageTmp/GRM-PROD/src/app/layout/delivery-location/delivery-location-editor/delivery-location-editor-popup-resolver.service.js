(
    function() {
      'use strict';

      angular
          .module('app.layout.delivery-location.delivery-location-editor')
          .service('DeliveryLocationEditorPopupResolver', DeliveryLocationEditorPopupResolverService)
      ;

      /* @ngInject */
      function DeliveryLocationEditorPopupResolverService(
          $log,
          InstitutionParameterService,
          NotificationHandler,
          GenericPopupResolver,
          RequisitionBusinessLogic,
          RequisitionModelManager,
          Translate)
      {
        var resolver = new GenericPopupResolver();

        var modelManager = RequisitionModelManager;
        var businessLogic = RequisitionBusinessLogic;

        var createDeliveryLocation = function (model) {
          return businessLogic.createDeliveryLocation(model)
              .then(
                  function success(response) {
                    return response;
                  },
                  function failure(reason) {
                    $log.error(reason);
                    NotificationHandler.error({ messageOrKey: reason.description, translate: false });
                    throw reason;
                  });
        };

        this.get = function () {
          return resolver;
        };

        this.computeAndGet = function (initialValue) {
          computeResolver(initialValue);
          return this.get();
        };

        function computeResolver (initialValue) {
          var popupConfig = resolver.config;
          var popupInnerComponentConfig = resolver.innerComponentConfig;

          popupConfig.title = Translate.instant('createDeliveryLocation');
          popupConfig.okButton.action = createDeliveryLocation;
          popupConfig.okButton.text = Translate.instant('add');
          popupConfig.displayLogic = function(stateModel, dataModel)  {
            stateModel.okButton.disabled =
                _.isNil(dataModel.code) || _.isEmpty(dataModel.code) || _.isNil(dataModel.description) || _.isEmpty(dataModel.description);
            stateModel.closeButton.hidden = true;
          };
          popupInnerComponentConfig.name = 'deliveryLocationEditor';
          popupInnerComponentConfig.changeHandlerBindingName = 'editHandler';
          popupInnerComponentConfig.bindings = {
            codeMaxLength: InstitutionParameterService.getInstitutionParameters().deliveryLocationCodeMaxLength,
            department: modelManager.getRequisitionHeaderModel().department,
            initialValue: initialValue,
            dataModel: {
              code: undefined,
              description: undefined
            },
          };
        }
      }
    }
)();
