(
  function() {
    'use strict';

    angular
      .module('app.layout.common.set-height-from-content')
      .directive('setHeightFromContent', setHeightFromContent);

    /* @ngInject */
    function setHeightFromContent($timeout) {
      var cdo = {
        restrict: 'A',
        link: {
            post: setHeightFromContentLink
        }
      };

    function setHeightFromContentLink(scope, element, attrs) {
        var self = angular.element(element[0]);
        var parent = self.parent(attrs.setHeightFromContent);
        var clayElem = new Clay(parent[0]);
        angular.element(clayElem.el).css('resize', 'none');
        $timeout(function () {
            self.css('height', self[0].clientHeight + 'px');
        });
        clayElem.on('resize', function(size) {
          $timeout(function () {
            var totalScrollableHeight = 0;
            self.find('div').each(function () {
              var element = angular.element(this);
              //Check only if element can be scrolled. (a vertical scrollbar is visible)
              if (element.innerWidth() - element[0].clientWidth > 0) {
                if (element[0].scrollHeight > element[0].clientHeight) {
                  totalScrollableHeight += element[0].scrollHeight - element[0].clientHeight; // true = include margins
                }
              }

            });
            var height = self[0].clientHeight + totalScrollableHeight;
            self.css('height', height + 'px');
          });
        });
    }
      return cdo;
    }

 }
)();
