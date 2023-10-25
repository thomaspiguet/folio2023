(function () {
	'use strict';

	/* eslint angular/prefer-component: 0 */
	angular
		.module('app.platform')
		.directive('navBarUser', navBarUser)
		.controller('navBarUserController', navBarUserController);

	/* @ngInject */
	function navBarUser() {
		return {
			restrict: 'E',
			templateUrl: 'platform-menu.nav-bar-user.template.html',
			controller: 'navBarUserController',
			controllerAs: 'vm',
			bindToController: true,
			scope: {}
		};
	}

	function navBarUserController(navBarService) {
		/*jshint validthis:true */
		var vm = this;
		vm.userConfig = {
			nameToDisplay: '',
			logoutUri: '',
			initial: '',
			fullname: '',
			displayTooltip: ''
		};

		function setUserConfig(config) {
			vm.userConfig.nameToDisplay = config.infoUserToDisplay.nameToDisplay;
			vm.userConfig.displayTooltip = config.infoUserToDisplay.tooltipDisplay;
			vm.userConfig.logoutUri = config.logoutUri;
			vm.userConfig.initial = config.initial;
			vm.userConfig.fullname = config.fullname;
		}

		vm.$onInit = function () {
			navBarService.getUserConfig()
				.then(function (response) {
					setUserConfig(response);
				});
		};
	}
})();
