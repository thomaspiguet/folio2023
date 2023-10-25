(
  function() {
    'use strict';

    angular
      .module('app.models')
      .factory('HeaderListStateModel', HeaderListStateModelFactory)
    ;

    /* @ngInject */
    function HeaderListStateModelFactory() {
      return HeaderListStateModel;
    }

    function HeaderListStateModel(obj) {
      var that = _.extend({
        hidden: false,
        searching: false
      }, obj);

      this.hidden = that.hidden;
      this.searching = that.searching;

      this.clone = function clone() {
        return new HeaderListStateModel(this);
      };
    }
  }
)();
