(
    function() {
      'use strict';

      angular
          .module('app.layout.requisition.requisition-uncatalogued-product')
          .service('UncataloguedProductPopupResolver', UncataloguedProductPopupResolverService)
      ;

      /* @ngInject */
      function UncataloguedProductPopupResolverService(
        GenericPopupResolver,
        Translate,
        FormService,
        InteractionModes,
        RequisitionUncataloguedProductActions,
        RequisitionModelManager,
        RequisitionDisplayLogicManager)
      {
        var resolver = new GenericPopupResolver();

        var modelManager = RequisitionModelManager;
        var displayLogic = RequisitionDisplayLogicManager;

        this.get = function () {
          return resolver;
        };

        this.computeAndGet = function (isNewItem) {
          computeResolver(isNewItem);
          return this.get();
        };

        function computeResolver (isNewItem) {
          var popupConfig = resolver.config;
          var popupInnerComponentConfig = resolver.innerComponentConfig;
          var innerComponentStateModel = displayLogic.getRequisitionUncataloguedProductStateModel(isNewItem);

          modelManager.computeRequisitionUncataloguedProductModel(isNewItem);

          popupConfig.title = Translate.instant('uncataloguedProductHeader');
          popupConfig.okButton.action = isNewItem ? RequisitionUncataloguedProductActions.onAddProduct : RequisitionUncataloguedProductActions.onEditProduct;
          popupConfig.okButton.text = isNewItem ? Translate.instant('add') : Translate.instant('confirmAction');
          popupConfig.closeButton.action = RequisitionUncataloguedProductActions.onClosePrestine;
          popupConfig.cancelButton.action = RequisitionUncataloguedProductActions.onCancelProductEdition;
          popupConfig.displayLogic = function(stateModel, dataModel)  {
            stateModel.okButton.disabled =
                !FormService.isFormDirty('requisitionUncataloguedProductForm') || FormService.isFormInvalid('requisitionUncataloguedProductForm');
            stateModel.closeButton.hidden = stateModel.interactionMode !== InteractionModes.ReadOnly;
            stateModel.cancelButton.cancel = stateModel.interactionMode === InteractionModes.ReadOnly;
          };
          popupInnerComponentConfig.name = 'requisitionUncataloguedProduct';
          popupInnerComponentConfig.changeHandlerBindingName = 'editHandler';
          popupInnerComponentConfig.bindings = {
            configuration: {
              requesterId: modelManager.getRequisitionHeaderModel().requester.id,
              requisitionTypeCode: modelManager.getRequisitionHeaderModel().type,
              department: modelManager.getRequisitionHeaderModel().department,
              site: modelManager.getRequisitionHeaderModel().site
            },
            dataModel: modelManager.getRequisitionUncataloguedProductModel(),
            stateModel: innerComponentStateModel
          };
        }
      }
    }
)();
