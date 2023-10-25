(
  function() {
    'use strict';

    angular
      .module('app.validators')
      .directive('alreadyInserted', alreadyInserted);

    /* @ngInject */
    function alreadyInserted($timeout, $log) {
      var cdo = {
        require: 'ngModel',
        scope: {
          collection: '=collection',
          alreadyInserted: '='
        },
        link: DepartmentListLink
      };

      function DepartmentListLink(scope, element, attrs, ctrl) {        
        if (_.isUndefined(scope.collection)) {
          $log.error('already-inserted : "collection" attribute MUST be set to use this model validation. if so, collection must be initialized.');
          return false;
        }

        if (_.isUndefined(attrs.alreadyInserted)) {
          $log.error('already-inserted : "already-inserted" attribute MUST be set to $index.');
        }

      ctrl.$validators.alreadyInserted = function (modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }     
        var ignoreIndex = scope.alreadyInserted;//$index
        for (var index = 0; index < scope.collection.length; index++) {
          var item = scope.collection[index];
          if ((item.code === viewValue) && (index !== ignoreIndex))
          {
            return false;
          }
        }
        return true;
      };
    }
      return cdo;
    }

 }
)();
