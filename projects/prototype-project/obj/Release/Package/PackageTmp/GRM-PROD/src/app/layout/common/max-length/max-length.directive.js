(
  function() {
    'use strict';

    /*Used to manage max-length on text area (to replace "maxlength"). 
    The problem with native "maxlength" on textarea is that carriage return counts as two caracters, 
    and caracters counter counts them as 1, resulting in an inconsistency.*/
    angular
      .module('app.layout.common.max-length')
      .directive('maxLength', maxLength);

    /* @ngInject */
    function maxLength($log) {
      var cdo = {
          require: '^ngModel',
          scope: {
              model: '=ngModel'
          },
          link: maxLengthLink
      };

    function maxLengthLink(scope, element, attrs, ctrl) {
        if (_.isNil(attrs.maxLength)) {
            $log.error('max-length : max-length must be specified and must be numeric (max-length=100)');
        } else if (_.isNil(attrs.mdMaxlength)) {
            $log.error('md-maxlength : md-maxlength must be set to use this directive.)');
        } else {
            scope.$watch(function() { return ctrl.$error['md-maxlength']; }, function (newValue) {
                if (newValue) {
                    scope.model = _.truncate(angular.element(element[0]).val(), {
                        'length': _.toNumber(attrs.maxLength),
                        'omission': ''
                    });
                }
            });
        }
    }

    return cdo;
  }
 }
)();
