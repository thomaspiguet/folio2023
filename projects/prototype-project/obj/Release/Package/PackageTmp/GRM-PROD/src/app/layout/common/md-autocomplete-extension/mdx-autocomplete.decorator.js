/**
 * A (PATCH) decorator for the angular material design mdAutocomplete directive. The main
 * purpose for this directive is to implement a delay when using the TAB key from
 * within a given autocomplete control. This allows for all computing to occur
 * therefore allowing the time to compute all control enable/disable states, and (hopefully)
 * resolve inter dependencies (often component bindings...)
 */
(
  function() {
    'use strict';

    angular
      .module('app.layout.common.md-autocomplete-extension')
      .config(config)
    ;

    /* @ngInject */
    function config($provide) {
      $provide.decorator('mdAutocompleteDirective', decorator);
    }

    // The number of milliseconds to delay the TAB key stroke in autocomplete control
    var DELAY = 200;

    /* @ngInject */
    function decorator($delegate, $timeout) {
      var directive = $delegate[0];

      var originalCompile = directive.compile;
      directive.compile = function decoratedCompile(tElem, tAttrs) {
        var originalLink = originalCompile.apply(directive, arguments);

        return function decoratedLink(scope, elem, attrs) {
          originalLink.apply(directive, arguments);

          //
          // IE patch !!!!
          //
          // Add the element id to the autocomplete sub elements. The document.activeElement used by our autocomplete
          // components is the md-virtual-repeat-scroller in IE... while it is the actual component in other browsers.s
          //
          // https://m.popkey.co/d2b340/Lym8v.gif
          //
          var mdInputId = attrs.mdInputId ? attrs.mdInputId : '';
          var subElem = elem.find('md-virtual-repeat-container');
          if (subElem && subElem.length > 0) {
            subElem[0].id = mdInputId + 'Container';
          }
          subElem = elem.find('.md-virtual-repeat-scroller');
          if (subElem && subElem.length > 0) {
            subElem[0].id = mdInputId + 'Scroller';
          }
          subElem = elem.find('.md-virtual-repeat-sizer');
          if (subElem && subElem.length > 0) {
            subElem[0].id = mdInputId + 'Sizer';
          }
          subElem = elem.find('.md-virtual-repeat-offsetter');
          if (subElem && subElem.length > 0) {
            subElem[0].id = mdInputId + 'Offsetter';
          }

          var target = elem;
          target.on('keydown', function handler($event) {
            if (9 === $event.which) {
              // Assume that cascade is forward only
              if ($event.shiftKey) {
                return;
              }

              // Find all inputs located under the same form object
              var formInputs = target.closest('form').find('input');

              // Pinpoint this control's input field
              var thisInput = target.find('input');

              // Find next input index, relative to this input's index
              var inputIndex = formInputs.index(thisInput) + 1;

              // If this input is not the last in the form...
              if (inputIndex + 1 < formInputs.length) {
                var nextInput =
                  _.find(formInputs, function iterator(formInput) {
                    return false === formInput.disabled;
                  }, inputIndex);

                if (!_.isNil(nextInput)) {
                  // Prevent default event behaviour
                  $event.preventDefault();

                  // Schedule a focus event in the next form input
                  $timeout(function onTimeout() {
                    // formInputs[inputIndex].focus();
                    nextInput.focus();
                  }, DELAY);
                }

              }
            }
          });
        };
      };
      return $delegate;
    }
  }
)();
