(
  function() {
    'use strict';

    angular
      .module('app.layout.common.validation-popover')
      .directive('validationPopover', validationPopover);

    /* @ngInject */
    function validationPopover($compile, $interpolate, Translate) {
      var cdo = {
        require: '^form',
        priority: 1000,
        terminal: true,
        compile: validationPopoverCompile
      };

      function validationPopoverCompile (tElem, tAttrs) {
        //Remove the attribute to avoid indefinite loop, as we are gonna use compile service in post-link.
        tElem.removeAttr('validation-popover');
        return {
          pre: function (scope, elem, attrs, ctrl) {},
          post: function (scope, elem, attrs, ctrl) {

            //Validation object with "key : message" structure.
            var validations = scope.$eval(attrs.validationPopover);
            var style = attrs.validationPopoverStyle;

            //Get input name, and interpolate it, in case it contains interpolation markups {{}}.
            var elementName = $interpolate(elem.attr('md-input-name') ||
              elem.attr('input-name') ||
              elem.attr('name'))(scope);

            var enablePopoverFuncName = 'enable' + _.upperFirst(elementName) + 'Popover';
            var getPopoverMessageFuncName = 'get'  + _.upperFirst(elementName) + 'PopoverMessage';

            /*Scans validations object. if a validation key is present in current form controller "$errors",
            Returns true with corresponding validation message. (enable validation popover).*/
            scope[enablePopoverFuncName] = function() {
              // var error = scope[ctrl.$name][elementName].$error;
              var error = {};
              if (scope && scope[ctrl.$name] && scope[ctrl.$name][elementName]) {
                error = scope[ctrl.$name][elementName].$error;
              }
              var result = {};
              _.forOwn(validations, function (value, key) {
                if (error[key]) {
                  result = {message: Translate.instant(value), enabled: true};
                }
              });
              return result;
            };

            //Return current raised validation message.
            scope[getPopoverMessageFuncName] = function() {
              return scope[enablePopoverFuncName]().message;
            };

            //Add uib-popover
            elem.attr('uib-popover-html', getPopoverMessageFuncName + '()');
            elem.attr('popover-enable', enablePopoverFuncName + '().enabled');

            //Style
            if (!_.isNil(style)) {
              elem.attr('popover-placement', style);
            }

            $compile(elem)(scope);
          }
        };
      }
      return cdo;
  }
 }
)();
