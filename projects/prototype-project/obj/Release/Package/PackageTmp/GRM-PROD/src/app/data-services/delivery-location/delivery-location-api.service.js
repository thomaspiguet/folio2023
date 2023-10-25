(
  function() {
    'use strict';

    angular
      .module('app.dataservices.delivery-location')
      .factory('DeliveryLocationApiService', DeliveryLocationApiService);

    /* @ngInject */
    function DeliveryLocationApiService($http, $q, ControlLookupObjectService, Paths) {

      return {
        create: create
      };

      function create(params) {
        var deferred = $q.defer();

        if (_.isNil(params) || _.isNil(params.departmentId) || _.isNil(params.code) || _.isNil(params.description)) {
          deferred.reject('Missing mandatory parameter(s) [ {departmentId, code, description} ]');
        }
        else {
          var data = {
            departmentId: params.departmentId,
            code: params.code,
            description: params.description
          };
          $http
            .post(Paths.getApiPath() + 'deliverylocations', data, { blockUI : true, showSpinner: true  })
            .then(
              function success(response) {
                deferred.resolve(ControlLookupObjectService.toObject(response.data));
              },
              function failure(reason) {
                deferred.reject(reason);
              }
            )
          ;
        }
        return deferred.promise;
      }
    }
  }
)();
