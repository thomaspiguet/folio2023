;(
  function() {
    'use strict';

    angular
      .module('app.models.requisition-template-search')
      .factory('SearchStateModel', SearchStateModelFactory)
    ;

    /* @ngInject */
    function SearchStateModelFactory(CriteriaDataModel) {
      var pristineState = {
        address: undefined,
        department: undefined,
        isActive: 'active',
        isAutomaticGeneration: 'all',
        headers: [],
        isProductInvalid: 'all',
        paging: {
          size: 20,
          offset: 0,
          total: 0
        },
        productCode: undefined,
        productDescription: undefined,
        products: [],
        productStore: undefined,
        requester: undefined,
        searchMode: 'header',
        site: undefined,
        sorting: {
          by: undefined,
          descending: undefined
        },
        templateId: undefined,
        templateDescription: undefined
      };
      function SearchStateModel(obj) {
        var self = this;

        self.address = pristineState.address;
        self.department = pristineState.department;
        self.isActive = pristineState.isActive;
        self.isAutomaticGeneration = pristineState.isAutomaticGeneration;
        self.headers = pristineState.headers;
        self.isProductInvalid = pristineState.isProductInvalid;
        self.paging = pristineState.paging;
        self.productCode = pristineState.productCode;
        self.productDescription = pristineState.productDescription;
        self.products = pristineState.products;
        self.productStore = pristineState.productStore;
        self.requester = pristineState.requester;
        self.searchMode = pristineState.searchMode;
        self.site = pristineState.site;
        self.sorting = pristineState.sorting;
        self.templateId = pristineState.templateId;
        self.templateDescription = pristineState.templateDescription;

        if (!_.isNil(obj)) {

          if (obj.address) {
            self.address = obj.address;
          }
          if (obj.department) {
            self.department = obj.department;
          }
          if (obj.isActive) {
            self.isActive = obj.isActive;
          }
          if (obj.isAutomaticGeneration) {
            self.isAutomaticGeneration = obj.isAutomaticGeneration;
          }
          if (obj.headers) {
            self.headers = obj.headers;
          }
          if (obj.isProductInvalid) {
            self.isProductInvalid = obj.isProductInvalid;
          }
          if (obj.paging) {
            self.paging = obj.paging;
          }
          if (obj.productCode) {
            self.productCode = obj.productCode;
          }
          if (obj.productDescription) {
            self.productDescription = obj.productDescription;
          }
          if (obj.products) {
            self.products = obj.products;
          }
          if (obj.productStore) {
            self.productStore = obj.productStore;
          }
          if (obj.requester) {
            self.requester = obj.requester;
          }
          if (obj.searchMode) {
            self.searchMode = obj.searchMode;
          }
          if (obj.site) {
            self.site = obj.site;
          }
          if (obj.sorting) {
            self.sorting = obj.sorting;
          }
          if (obj.templateId) {
            self.templateId = obj.templateId;
          }
          if (obj.templateDescription) {
            self.templateDescription = obj.templateDescription;
          }
        }

        self.clone = function clone() {
          return new SearchStateModel(this);
        };

        self.getPristineState = function getPristineState() {
          return _.extend({}, pristineState);
        };
      }

      return SearchStateModel;
    }
  }
)();
