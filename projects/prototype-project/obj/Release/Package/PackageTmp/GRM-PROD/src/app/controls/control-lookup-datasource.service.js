(
  function() {
    'use strict';

    angular
      .module('app.controls')
      .factory('ControlLookupDatasourceService', ControlLookupDatasourceService)
    ;

    /* @ngInject */
    function ControlLookupDatasourceService($http, $q, ControlLookupApiService) {
      return {
        getAcquisitionTypes: getAcquisitionTypes,
        getAcquisitionReasons: getAcquisitionReasons,
        getAddresses: getAddresses,
        getDeliveryLocations: getDeliveryLocations,
        getDepartments: getDepartments,
        getRequesters: getRequesters,
        getRequisitionTemplates: getRequisitionTemplates,
        getSites: getSites,
        getStores: getStores,
        getManufacturers: getManufacturers,
        getBuyers: getBuyers,
        getVendors: getVendors,
        getTaxes: getTaxes,
        getStatisticalUnits: getStatisticalUnits,
        getSecondaryCodes: getSecondaryCodes,
        getAccounts: getAccounts,
        getClients: getClients
      };

      function getAcquisitionTypes(params) {
        return ControlLookupApiService.getAcquisitionTypes(params);
      }
      function getAcquisitionReasons(params) {
        return ControlLookupApiService.getAcquisitionReasons(params);
      }
      function getAddresses(params) {
        return ControlLookupApiService.getAddresses(params);
      }
      function getDeliveryLocations(params) {
        return ControlLookupApiService.getDeliveryLocations(params);
      }
      function getDepartments(params) {
        return ControlLookupApiService.getDepartments(params);
      }
      function getRequesters(params) {
        return ControlLookupApiService.getRequesters(params);
      }
      function getRequisitionTemplates(params) {
        return ControlLookupApiService.getRequisitionTemplates(params);
      }
      function getSites(params) {
        return ControlLookupApiService.getSites(params);
      }
      function getStores(params) {
        return ControlLookupApiService.getStores(params);
      }
      function getManufacturers(params) {
        return ControlLookupApiService.getManufacturers(params);
      }
      function getBuyers(params) {
        return ControlLookupApiService.getBuyers(params);
      }
      function getVendors(params) {
        return ControlLookupApiService.getVendors(params);
      }
      function getTaxes(params) {
        return ControlLookupApiService.getTaxes(params);
      }
      function getStatisticalUnits(params) {
        return ControlLookupApiService.getStatisticalUnits(params);
      }
      function getSecondaryCodes(params) {
        return ControlLookupApiService.getSecondaryCodes(params);
      }
      function getAccounts(params) {
        return ControlLookupApiService.getAccounts(params);
      }
      function getClients(params) {
        return ControlLookupApiService.getClients(params);
      }
    }
  }
)();
