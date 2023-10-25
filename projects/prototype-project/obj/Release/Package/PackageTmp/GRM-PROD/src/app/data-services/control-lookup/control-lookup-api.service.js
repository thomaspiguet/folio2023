(
  function() {
    'use strict';

    angular
      .module('app.dataservices.controllookup')
      .factory('ControlLookupApiService', ControlLookupApiService)
    ;

    /* @ngInject */
    function ControlLookupApiService($http, $q, Paths, ControlLookupObjectService) {
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
        getTaxes: getTaxes,
        getVendors: getVendors,
        getStatisticalUnits: getStatisticalUnits,
        getSecondaryCodes: getSecondaryCodes,
        getAccounts: getAccounts,
        getClients: getClients
      };

      function getAcquisitionTypes(params) {
        return fetch('acquisitionTypes', params);
      }
      function getAcquisitionReasons(params) {
        return fetch('acquisitionReasons', params);
      }
      function getAddresses(params) {
        return fetch('addresses', params);
      }
      function getDeliveryLocations(params) {
        return fetch('deliveryLocations', params);
      }
      function getDepartments(params) {
        return fetch('departments', params);
      }
      function getRequesters(params) {
        return fetch('requesters', params);
      }
      function getRequisitionTemplates(params) {
        return fetch('requisitionTemplates/requisition', params);
      }
      function getSites(params) {
        return fetch('sites', params);
      }
      function getStores(params) {
        return fetch('stores', params);
      }
      function getManufacturers(params) {
        return fetch('manufacturers', params);
      }
      function getBuyers(params) {
        return fetch('buyers', params);
      }
      function getTaxes(params) {
        return fetch('taxes', params);
      }
      function getVendors(params) {
        return fetch('vendors', params);
      }
      function getStatisticalUnits(params) {
        return fetch('statisticalUnits', params);
      }
      function getSecondaryCodes(params) {
        return fetch('secondaryCodes', params);
      }
      function getAccounts(params) {
        return fetch('accounts', params);
      }
      function getClients(params) {
        return fetch('clients', params);
      }

      function fetch(path, params) {
        var deferred = $q.defer();

        var cfg = {};
        if (!_.isNil(params)) {
          cfg.params = params.params ? params.params : params; // TEMP - should always be params.params
          cfg.paramSerializer = '$httpParamSerializerJQLike';

          if (!_.isNil(params.promise)) {
            cfg.timeout = params.promise;
          }
        }

        $http
          .get(Paths.getApiPath() + path, cfg)
          .then(
            function success(response) {
              var lookupList = [];

              //Get data from response
              var responseData = response.data;

              _.forEach(responseData, function iterator(dto) {
                // lookupList.push(ControlLookupObjectService.toObject(dto));
                lookupList.push(dto); // From now on, take incoming structure as is
              }, this);

              deferred.resolve({
                data : lookupList,
                headers : response.headers
              });
            },
            function failure(reason) {
              deferred.reject(reason);
            }
          )
        ;
        return deferred.promise;
      }
    }
  }
)();
