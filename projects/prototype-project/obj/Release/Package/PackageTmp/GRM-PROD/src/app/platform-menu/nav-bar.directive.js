(function() {
	'use strict';

	/* eslint angular/prefer-component: 0 */
	angular
		.module('app.platform')
		.directive('navBar', navBar)
		.controller('navBarController', navBarController);

	/* @ngInject */
	function navBar() {
		return {
			restrict: 'E',
			templateUrl: 'platform-menu.nav-bar.template.html',
			controller: 'navBarController',
			controllerAs: 'vm',
			hasResources: true,
			bindToController: true
		};
	}

	function navBarController($rootScope, navBarService) {
		/*jshint validthis:true */
		var vm = this;
		vm.ready = false;

		vm.closeMenuFromOverlay = function() {
			$rootScope.$broadcast('close-app-menu');
		};

		vm.$onInit = function() {
			navBarService.getTenantConfig().then(function() {
				vm.ready = true;
			});
		};
	}
})();
