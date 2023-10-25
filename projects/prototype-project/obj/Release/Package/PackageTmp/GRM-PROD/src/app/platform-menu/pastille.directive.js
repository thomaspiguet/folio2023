(function () {
    'use strict';

	/* eslint angular/prefer-component: 0 */
    angular
        .module('app.platform')
        .directive('pastille', pastille);

    /* @ngInject */
    function pastille() {
        return {
            scope: {
                info: '@info'
            },
            templateUrl: 'platform-menu.pastille.template.html',
            restrict: 'E'
        };
    }
})();
