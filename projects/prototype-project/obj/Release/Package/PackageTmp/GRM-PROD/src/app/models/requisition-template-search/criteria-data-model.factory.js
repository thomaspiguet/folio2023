(
  function() {
    'use strict';

    angular
        .module('app.models.requisition')
        .factory('CriteriaDataModel', CriteriaDataModelFactory);

    /* @ngInject */
    function CriteriaDataModelFactory() {
      return CriteriaDataModel;

      function CriteriaDataModel(obj) {
        // Define the available search modes
        Object.defineProperty(this, 'searchModes', {
          value: {
            header: 'header',
            product: 'product'
          }
        });

        // Define the isActive available values
        Object.defineProperty(this, 'activeIndicators', {
          value: {
            all: 'all',
            active: 'active',
            inactive: 'inactive'
          }
        });

        // Define the automaticGeneration available values
        Object.defineProperty(this, 'automaticGenerationValues', {
          value: {
            all: 'all',
            yes: 'yes',
            no: 'no'
          }
        });

        // Define the isProductInvalid available values
        Object.defineProperty(this, 'invalidProductValues', {
          value: {
            all: 'all',
            yes: 'yes',
            no: 'no'
          }
        });

        var that = _.extend({
          searchMode: this.searchModes.header,
          templateId: undefined,
          templateDescription: undefined,
          site: undefined,
          department: undefined,
          address: undefined,
          requester: undefined,
          client: undefined,
          isActive: this.activeIndicators.active,
          isAutomaticGeneration: this.automaticGenerationValues.all,
          productCode: undefined,
          productDescription: undefined,
          productStore: undefined,
          isProductInvalid: this.invalidProductValues.all
        }, obj);

        this.searchMode = that.searchMode;
        this.templateId = _.isEmpty(that.templateId) ? undefined : that.templateId;
        this.templateDescription = _.isEmpty(that.templateDescription) ? undefined : that.templateDescription;
        this.site = _.isNil(that.site) ? undefined : that.site;
        this.department = _.isNil(that.department) ? undefined : that.department;
        this.address = _.isNil(that.address) ? undefined : that.address;
        this.requester = _.isNil(that.requester) ? undefined : that.requester;
        this.client = _.isNil(that.client) ? undefined : that.client;
        this.isActive = that.isActive;
        this.isAutomaticGeneration = that.isAutomaticGeneration;
        this.productCode = _.isEmpty(that.productCode) ? undefined : that.productCode;
        this.productDescription = _.isEmpty(that.productDescription) ? undefined : that.productDescription;
        this.productStore = _.isNil(that.productStore) ? undefined : that.productStore;
        this.isProductInvalid = that.isProductInvalid;

        this.clone = function clone() {
          return new CriteriaDataModel(this);
        };

        this.copy = function copy(that) {
          return new CriteriaDataModel(that);
        };

        this.equals = function equals(that) {
          return this.templateId === that.templateId &&
            this.templateDescription === that.templateDescription &&
            this.site === that.site &&
            this.department === that.department &&
            this.address === that.address &&
            this.requester === that.requester &&
            this.client === that.client &&
            this.isActive === that.isActive &&
            this.isAutomaticGeneration === that.isAutomaticGeneration &&
            this.productCode === that.productCode &&
            this.productDescription === that.productDescription &&
            this.productStore === that.productStore &&
            this.isProductInvalid === that.isProductInvalid
          ;
        };

        this.isEmpty = function isEmpty() {
          return (_.isNil(this.templateId) || _.isEmpty(this.templateId)) &&
            (_.isNil(this.templateDescription) || _.isEmpty(this.templateDescription)) &&
            (_.isNil(this.site) || _.isEmpty(this.site)) &&
            (_.isNil(this.department) || _.isEmpty(this.department)) &&
            (_.isNil(this.address) || _.isEmpty(this.address)) &&
            (_.isNil(this.requester) || _.isEmpty(this.requester)) &&
            (_.isNil(this.client) || _.isEmpty(this.client)) &&
            (_.isNil(this.productCode) || _.isEmpty(this.productCode)) &&
            (_.isNil(this.productDescription) || _.isEmpty(this.productDescription)) &&
            (_.isNil(this.productStore) || _.isEmpty(this.productStore)) &&
            this.isActive === this.activeIndicators.active &&
            this.isAutomaticGeneration === this.automaticGenerationValues.all &&
            this.isProductInvalid === this.invalidProductValues.all
          ;
        };
      }
    }
  }
)();
