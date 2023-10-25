/**
 * Add some proprietary functionnality to lodash, using the exposed "mixin" function.
 */
(
  function() {
    'use strict';

    _.mixin({

      /**
       * Copy an array. This does not mutate the original array. This implementation is based on the
       * browser's JSON stringify/parse methods, hence attributes of type 'function' ARE NOT COPIED.
       *
       * @param {array} source - The source array used to create the array copy.
       *
       * @see {@link JSON.stringify} The browser's JSON.stringify method
       * @see {@link JSON.parse} The browser's JSON.parse method
       *
       * @returns {array} - A copy of the given source array
       */
      arrayCopy: function arrayCopy(source) {
        if (_.isNil(source)) {
          return [];
        }
        else if (!_.isArray(source)) {
          return source; // TODO: is this behaviour OK ?
        }
        else {
          return JSON.parse(JSON.stringify(source));
        }
      }
    });

  }
)();
