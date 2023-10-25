(
  function() {
    'use strict';

    angular
      .module('app.business-logic.requisition-template-search')
      .factory('RequisitionTemplateSearchStateManager', RequisitionTemplateSearchStateManagerFactory)
    ;

    /* @ngInject */
    /* @ngInject */
    function RequisitionTemplateSearchStateManagerFactory(
      SearchStateModel
    ) {
      var self = this;

      var stateModel = new SearchStateModel();

      self.initialize = function initialize(configParams) {
        var config = _.extend({
          clearState: false
        }, configParams);

        if (config.clearState) {
          stateModel = new SearchStateModel();
        }
      };

      self.getRequisitionTemplateSearchStateModel = function getRequisitionTemplateSearchStateModel() {
        return stateModel;
      };

      self.updateState = function updateState(stateObj) {
        stateModel = new SearchStateModel(stateObj);
      };

      return self;
    }    
  }
)();
