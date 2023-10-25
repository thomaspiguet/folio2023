(
  function() {
    'use strict';

    angular
      .module('app.layout.requisition.requisition-item-list')
      .filter('requisitionItemListSorter', requisitionItemListSorter)
    ;

    /* @ngInject */
    function requisitionItemListSorter($filter, $log) {

      function filter(collection, predicate, reverse) {

        function requisitionItemComparator(value1, value2) {
          if (value1.type !== 'string' || value2.type !== 'string') {
            return (value1.value < value2.value) ? -1 : 1;
          }
          return value1.value.localeCompare(value2.value);
        }

        function requisitionItemListSorterHelper(requisitionItem) {
          if ('code' === predicate) {
            // uncatalogued items may have an empty [""] code, a null code or 0... so return 0 to avoid parsing to NaN
            if (_.isEmpty(requisitionItem.code) || _.isNull(requisitionItem.code)) {
              return 0;
            }
            else {
              return parseInt(requisitionItem.code);
            }
          }
          else {
            return requisitionItem[predicate];
          }
        }

        var toAppend = [];
        var filtered = _.filter(collection, function iterator(item) {
          // Don't sort newly added item
          if (!_.isNil(item.id) && item.id !== 0) {
            return true;
          }
          toAppend.push(item);
          return false;
        });
        return $filter('orderBy')(filtered, requisitionItemListSorterHelper, reverse, requisitionItemComparator).concat(toAppend);
      }

      return filter;
    }
  }
)();
