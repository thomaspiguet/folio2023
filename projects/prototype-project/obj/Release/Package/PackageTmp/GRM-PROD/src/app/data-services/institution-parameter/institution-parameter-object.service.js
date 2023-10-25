(
  function() {
    'use strict';

    angular
      .module('app.dataservices.institution-parameter')
      .factory('InstitutionParameterObjectService', InstitutionParameterObjectService)
    ;

    /* @ngInject */
    function InstitutionParameterObjectService() {
      return {
        toObject :toObject,
        newInstance: newInstance
      };

      function toObject(dto) {
        return new Institution(dto);
      }

      function newInstance() {
        return new Institution();
      }

      // Institution object constructor
      function Institution(dto) {
        var that = _.extend({
          id: undefined,
          description: undefined,
          dateFormat: undefined,
          language: undefined,
          defaultStatisticalUnit: undefined,
          defaultDistributionUnit: undefined,
          defaultTaxScheme: undefined,
          activePurchaseProcessDate: undefined,
          isPurchaseProcessActive: false,
          isUnspscClassificationActive: false,
          isDeliveryLocationMandatory: false,
          currentFinancialYear: undefined,
          authorityOfRequesterOverFonctionalCentre: undefined,
          deliveryLocationCodeMaxLength: undefined,
          isFixedAssetActive: false,
          requesterInChargeForFixedAsset: undefined,
          typeOfPersmissionForFixedAsset: 2, // default: anyone can create a fixed asset requisition type
          maximumRequestedQuantityForFixedAsset: 2000
        }, dto);

        this.id = that.id;
        this.description = that.description;
        this.dateFormat = that.dateFormat;
        this.language = that.language;
        this.defaultStatisticalUnit = that.defaultStatisticalUnit;
        this.defaultDistributionUnit = that.defaultDistributionUnit;
        this.defaultTaxScheme = that.defaultTaxScheme;
        this.activePurchaseProcessDate = that.activePurchaseProcessDate;
        this.isPurchaseProcessActive = _.isNil(this.activePurchaseProcessDate) ? false : (new Date(this.activePurchaseProcessDate) <= new Date());
        this.isUnspscClassificationActive = that.isUnspscClassificationActive;
        this.currentFinancialYear = that.currentFinancialYear;
        this.isDeliveryLocationMandatory = that.isDeliveryLocationMandatory;
        this.authorityOfRequesterOverFonctionalCentre = that.authorityOfRequesterOverFonctionalCentre;
        this.deliveryLocationCodeMaxLength = that.deliveryLocationCodeMaxLength;
        this.isFixedAssetActive = that.isFixedAssetActive;
        this.requesterInChargeForFixedAsset = that.requesterInChargeForFixedAsset;
        this.typeOfPersmissionForFixedAsset = that.typeOfPersmissionForFixedAsset;
        this.maximumRequestedQuantityForFixedAsset = that.maximumRequestedQuantityForFixedAsset;
      }
    }
  }
)();
