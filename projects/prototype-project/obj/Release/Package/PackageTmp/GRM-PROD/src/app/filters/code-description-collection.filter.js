(
  function() {
    'use strict';

    angular
      .module('app.filters')
      .filter('codeDescriptionCollectionFilter', codeDescriptionCollectionFilter);

    /* @ngInject */
    function codeDescriptionCollectionFilter($log, $q) {
    
      function toStringToUpperCase(value) {
        var result = value;
        if (!_.isString(value)) {
          result = result.toString();
        }
        return result.toUpperCase();
      }

      function filterFnc(collection, searchText, codeAttr, descriptionAttr) {
        return collection.filter(function filter(object) {
          var code = toStringToUpperCase((object[codeAttr] || ''));
          var description = (object[descriptionAttr] || '').toUpperCase();
          var target = searchText.toUpperCase();

          return code.indexOf(target) >= 0 || description.indexOf(target) >= 0 || code.concat(' - ').concat(description).indexOf(target) >= 0;
        });
      }

      function codeDescriptionCollectionFilterFn(collection, searchText, codeAttr, descriptionAttr) {
        if (_.isNil(collection)) {
          return [];
        }

        if (_.isEmpty(searchText)) {
          return collection;
        }
        else {
          if (_.isArray(collection)) {
            return filterFnc(collection, searchText, codeAttr, descriptionAttr);
          }
          else if (!_.isNil(collection.then) && _.isFunction(collection.then)) {
            var deferred = $q.defer();
            collection
              .then(
                function success(response) {
                  deferred.resolve(filterFnc(response, searchText, codeAttr, descriptionAttr));
                },
                function failure(reason) {
                  $log.error('Error while filtering collection [' + reason + ']');
                }
              )
            ;
            return deferred.promise;
          }
        }
      }

      return codeDescriptionCollectionFilterFn;
    }
 }
)();
