(
  function() {
    'use strict';

    angular
      .module('app.dataservices.userprofile')
      .factory('UserProfileObjectService', UserProfileObjectService)
    ;

    /* @ngInject */
    function UserProfileObjectService() {
      return {
        toMetaObject: toMetaObject,
        toObject: toObject,
      };

      function toObject(dto) {
        return new UserProfile(dto);
      }

      function toMetaObject(dto) {
        return new UserMetaProfile(dto);
      }

      // UserMetaProfile contstructor
      function UserMetaProfile(dto) {
        var that = _.extend({
            id: undefined,
            number: undefined,
            name: undefined
        }, dto);

        this.id = that.id;
        this.number = that.number;
        this.name = that.name;
      }

      // UserProfile contstructor
      function UserProfile(dto) {
        var that = _.extend({
            id: undefined,
            number: undefined,
            name: undefined,
            //languageId: undefined,
            phoneNumber: undefined,
            phoneExtension: undefined,
            faxNumber: undefined,
            email: undefined,
            department: undefined,
            site: undefined,
            address: undefined,
            deliveryLocation: undefined,
            permissions: {
              requisitionSpecific: {
                canModifyRequiredDate: undefined,
                canDoExternalSaleRequisition: undefined,
                canDoFixedAssetRequisition: undefined,
                canAlterAuthorizerList: undefined,
                canModifyItemUnitPrice: undefined,
                canModifyItemFormat: undefined,
                canCreateUniqueRequisitionPerOrder: undefined,
                canModifyItemStore: undefined
              }
            },
            settings: {
              requisitionSpecific: {
                requisitionManagementScopeId: undefined,
                accountAccessTypeId: undefined,
                requisitionAuthorizationLevelId: undefined,
                productTypeUsageId: undefined,
                isUniqueRequisitionPerOrder: false,
                nonCataloguedSpecific: {
                  isBuyerMandatory: undefined,
                  isImplicitBuyerEditable: undefined,
                  isSegmentMandatory: undefined,
                  isAccountMandatory: undefined,
                  isValidVendorMandatory: undefined,
                  isFormatDisplayed: undefined
                }
              }
            }
        }, dto);

        this.id = that.id;
        this.number = that.number;
        this.name = that.name;
        //this.languageId = that.languageId;
        this.phoneNumber = that.phoneNumber;
        this.phoneExtension = that.phoneExtension;
        this.faxNumber = that.faxNumber;
        this.email = that.email;

        this.department = that.department;
        this.site = that.site;
        this.address = that.address;
        this.deliveryLocation = that.deliveryLocation;

        this.permissions = that.permissions;
        this.settings = that.settings;

        this.isDecentralized = function isDecentralized() {
          return this.settings.requisitionSpecific.requisitionManagementScopeId === 1; // TODO: map to system lookups?
        };

        this.isCentralized = function isCentralized() {
          return this.settings.requisitionSpecific.requisitionManagementScopeId === 2; // TODO: map to system lookups?
        };

        this.isIllimited = function isIllimited() {
          return this.settings.requisitionSpecific.requisitionManagementScopeId === 3; // TODO: map to system lookups?
        };
      }
    }
  }
)();
