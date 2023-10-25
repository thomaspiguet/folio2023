(
    function() {
      'use strict';

      angular
        .module('app.layout.requisition')
        .service('ProductStatisticsPopupResolver', ProductStatisticsPopupResolverService)
      ;

      /* @ngInject */
      function ProductStatisticsPopupResolverService(
        InstitutionParameterService,
        GenericPopupResolver,
        Translate,
        RequisitionModelManager)
      {
        var resolver = new GenericPopupResolver();

        var modelManager = RequisitionModelManager;

        this.get = function () {
          return resolver;
        };

        this.computeAndGet = function (uuid) {
          computeResolver(uuid);
          return this.get();
        };

        function computeResolver (uuid) {
          var popupConfig = resolver.config;
          var popupInnerComponentConfig = resolver.innerComponentConfig;

          popupConfig.title = Translate.instant('productConsumptionStatistics');
          popupConfig.displayLogic = function(stateModel, dataModel)  {
            stateModel.okButton.hidden = true;
            stateModel.cancelButton.hidden = true;
          };
          popupInnerComponentConfig.name = 'productStatisticChart';
          popupInnerComponentConfig.bindings = {
            productId: modelManager.getRequisitionItemAggregate(uuid).productId,
            department: modelManager.getRequisitionHeaderModel().department,
            formatRelation: modelManager.getRequisitionItemAggregate(uuid).formatRelation,
            financialYear : InstitutionParameterService.getInstitutionParameters().currentFinancialYear,
            allowToShowSince: 3
          };
        }
      }
    }
)();
