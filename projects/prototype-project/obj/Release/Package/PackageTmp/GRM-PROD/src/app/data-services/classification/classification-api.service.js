(
  function () {
    'use strict';

    angular
      .module('app.dataservices.classification')
      .factory('ClassificationApiService', ClassificationApiService);

    /* @ngInject */
    function ClassificationApiService($http,
                                      $q,
                                      SegmentObjectService,
                                      FamilyObjectService,
                                      ClassObjectService,
                                      Paths) {
      return {
        getSegments: getSegments,
        getFamilies: getFamilies,
        getClasses: getClasses
      };

      function getSegments(params) {
        var SEGM_API_PATH = 'segments';
        var deferred = $q.defer();

        var cfg = {};
        if (!_.isNil(params)) {
          cfg.params = params;
        }

        $http
          .get(Paths.getApiPath() + SEGM_API_PATH, cfg)
          .then(
            function success(response) {
              var lookupList = [];
              _.forEach(response.data, function iterator(dto) {
                  var item = {};
                  if (params.expanded) {
                      item = SegmentObjectService.toExpandedObject(dto);
                  }
                  else {
                      item = SegmentObjectService.toObject(dto);
                  }
                lookupList.push(item);
              });
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

        function getFamilies(params, segmentCode) {
            var FAM_API_PATH = 'families';
            var deferred = $q.defer();

            var cfg = {};
            if (!_.isNil(params)) {
                cfg.params = params;
            }

            $http
                .get(Paths.getApiPath() + FAM_API_PATH + '/' + segmentCode, cfg)
                .then(
                    function success(response) {
                        var lookupList = [];
                        _.forEach(response.data, function iterator(dto) {
                            var item = {};
                            if (params.expanded) {
                                item = FamilyObjectService.toExpandedObject(dto);
                            }
                            else {
                                item = FamilyObjectService.toObject(dto);
                            }
                            lookupList.push(item);
                        });
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

        function getClasses(params, segmentCode, familyCode) {
            var CLAS_API_PATH = 'classes';
            var deferred = $q.defer();

            var cfg = {};
            if (!_.isNil(params)) {
                cfg.params = params;
            }

            $http
                .get(Paths.getApiPath() + CLAS_API_PATH + '/' + segmentCode + '/' + familyCode, cfg)
                .then(
                    function success(response) {
                        var lookupList = [];
                        _.forEach(response.data, function iterator(dto) {
                            var item = {};
                            if (params.expanded) {
                                item = ClassObjectService.toExpandedObject(dto);
                            }
                            else {
                                item = ClassObjectService.toObject(dto);
                            }
                            lookupList.push(item);
                        });
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
