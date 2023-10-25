(
  function() {
    'use strict';

    angular
      .module('app.dataservices.requisition-template')
      .factory('RequisitionTemplateSearchResultObjectService', RequisitionTemplateSearchResultObjectService);

    /* @ngInject */
    function RequisitionTemplateSearchResultObjectService() {
      return {
        toHeaderResultObject: toHeaderResultObject,
        toProductResultObject: toProductResultObject
      };

      function toHeaderResultObject(dto) {
        return new RequisitionTemplateSearchResultHeaderObject(dto);
      }

      function toProductResultObject(dto) {
        return new RequisitionTemplateSearchResultProductObject(dto);
      }

      function RequisitionTemplateSearchResultHeaderObject(dto) {
        var that = _.extend({
          templateId: undefined,
          templateDescription: undefined,
          isActive: undefined,
          isAutomaticGeneration: undefined,
          site: undefined,
          department: undefined,
          address: undefined,
          requester: undefined
        }, dto);

        this.templateId = that.templateId;
        this.templateDescription = that.templateDescription;
        this.isActive = that.isActive;
        this.isAutomaticGeneration = that.isAutomaticGeneration;
        this.site = that.site;
        this.department = that.department;
        this.address = that.address;
        this.requester = that.requester;
      }

      function RequisitionTemplateSearchResultProductObject(dto) {
        var that = _.extend({
          templateId: undefined,
          templateDescription: undefined,
          isActive: undefined,
          isAutomaticGeneration: undefined,
          site: undefined,
          department: undefined,
          isProductInvalid: undefined,
          productCode: undefined,
          productDescription: undefined,
          productInvalidityReason: undefined,
          distributionUnit: undefined,
          store: undefined,
          templateItemId: undefined
        }, dto);

        this.templateId = that.templateId;
        this.templateDescription = that.templateDescription;
        this.isActive = that.isActive;
        this.isAutomaticGeneration = that.isAutomaticGeneration;
        this.site = that.site;
        this.department = that.department;
        this.isProductInvalid = that.isProductInvalid;
        this.productCode = that.productCode;
        this.productDescription = that.productDescription;
        this.productInvalidityReason = that.productInvalidityReason;
        this.distributionUnit = that.distributionUnit;
        this.store = that.store;
        this.templateItemId = that.templateItemId;
      }
    }
  }
)();
