(
  function() {
    //
    'use strict';

    angular
      .module('app')
      .run(runner)
    ;

    function runner(
        $log,
        $rootScope,
        $window,
        $location,
        $state,
        AuthenticationManager,
        FormService,
        NotificationHandler,
        PopupService,
        SideMenuService,
        TraceService
      ) {

      var unbindHandler;
      var unbindHandlers = [];

      //Needed, will be use in application "index" (embedded.html) view...
      $rootScope.authenticationInfos = AuthenticationManager.authenticationInfos;

      AuthenticationManager.configureOpenId();

      unbindHandler = $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams, stateChangeError) {
        //logout and login fails should be managed within their event listener, and manage redirection themselves.
        if (toState.name !== 'logout' && toState.name !== 'login') {
          event.preventDefault();
          $state.go('error', { localeId: toParams.localeId, error: stateChangeError }, { reload: true });
        }
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options) {

        // If toState has a redirectTo attribute, perform redirection (inheriting initial state params) and bypass original destination
        if (toState.redirectTo) {
          event.preventDefault();
          $state.go(toState.redirectTo, _.extend(toState.redirectParams, toParams), { location: 'replace' });

          return;
        }

        //for every state change (excluding "control" state), we want to save the destination state URL.
        if (toState.name !== 'logout' && toState.name !== 'login' && toState.name !== 'error') {
          setRedirectLoginUrl(toState, toParams, options);
        }

        if (toState.tracing && true === toState.tracing) {
          TraceService.enableTracing();
        }

        // Detecting:
        //
        // - if next state is equal to current state
        // - if next state is parent of current state
        // - if next state is a child of current state
        //
        // If true, simply return and bypass dirty check
        //
        if ($state.is(toState) || ($state.includes(toState) && options && options.ignoreDirtyState) || (fromState.name.length > 0 && toState.name.indexOf(fromState.name) > -1)) {

          // In the case where one of the above conditions is true, return only if we are not forcing a reload
          if (options && false === options.reload) {
            return;
          }
        }

        if (FormService.isDirty()) {
          event.preventDefault();
          NotificationHandler
            .confirm({messageOrKey: 'unsavedChanges'})
            .then(
              function success(response) {
                FormService.setPristine();
                PopupService.clearModals();
                SideMenuService.setCurrentSideMenuItem(toState.name);

                $state.go(toState, toParams, {notify: true, reload: true});
              }
            )
          ;
        }
        else {
          PopupService.clearModals();
          SideMenuService.setCurrentSideMenuItem(toState.name);
        }
      });
      unbindHandlers.push(unbindHandler);

      angular.element($window).on('beforeunload',function($event) {
        if (FormService.isDirty()) {
          return ''; //Returning a string will trigger browser confirmation before leaving page.
        }
      });

      unbindHandler = $rootScope.$on('$destroy',
        function onDestroy() {
          // Unbind all registered event handlers
          _.forEach(unbindHandlers, function iterator(unbindHandler, index) {
            unbindHandler();
            unbindHandlers[index] = undefined;
          });
          unbindHandlers = undefined;

          $log.debug('$rootScope.$destroy');
        }
      );
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:silent_renew_failed', function () {
        // The user has logged out for another tab/browser session
        // TODO : Should redirect to a logged out page ? for now, reprompt login.
        $log.warn('openid:silent_renew_failed');
        AuthenticationManager.login();
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:expired', function () {
        // The session has expired
        // TODO : Should redirect to a logged out page ? for now, reprompt login.
        $log.warn('openid:expired');
        AuthenticationManager.login();
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:expiring', function () {
        // The session is about to expired, silent renew will be called next
        // Add any code that can be useful to use if the session is about to expired
        $log.warn('openid:expiring');
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:obtained', function () {
        // Happens on login callback or on silent renew.
        $log.debug('openid:obtained');
        AuthenticationManager.onTokenObtention();
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:removed', function () {
        // User was logged out, sessionStorage is cleared
        $log.warn('openid:removed');
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:login_url_started', function () {
        $log.debug('openid:login_url_started');
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:login_url_succeeded', function () {
        $log.debug('openid:login_url_succeeded');
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:login_url_failed', function (e, error) {
        $state.go('error', {error: error}, {reload: 'error'});
        $log.warn('openid:login_url_failed');
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:login_started', function () {
        $log.debug('openid:login_started');
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:login_required', function () {
        $log.warn('openid:login_required');
        AuthenticationManager.login();
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:login_succeeded', function () {
        $log.debug('openid:login_succeeded');
        $location.url(AuthenticationManager.getLoginRedirectUrl()).replace();
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:login_failed', function (e, error) {
        // An error occurred with the user authentication
        $log.warn('openid:login_failed');
        //For now, redirect to a "generic" error page, with a link to "relog".
        $state.go('error', {error: error}, {reload: 'error'});
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:logout_url_started', function () {
        $log.debug('openid:logout_started');
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:logout_url_succeeded', function () {
        $log.debug('openid:logout_url_succeeded');
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:logout_url_failed', function (e, error) {
        $log.warn('openid:logout_url_failed');
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:logout_succeeded', function () {
        // TODO : Should redirect to a logged out page ? for now, reprompt login.
        AuthenticationManager.setLoginRedirectUrl('/');
        AuthenticationManager.login();
      });
      unbindHandlers.push(unbindHandler);

      unbindHandler = $rootScope.$on('openid:initialized', function () {
        $log.debug('openid:initialized');
      });
      unbindHandlers.push(unbindHandler);

      function setRedirectLoginUrl(toState, toParams, options) {
        //TODO: Some states cannot be directly navigated (ex: requisition/product-search..) we should not set redirect URL on them
        //TODO: Checking options.location dosen't seems to work, because when url is directly manipulated (without state.go), location is always false...
        var destinationUrl = $state.href(toState, toParams, {inherit: false});
        AuthenticationManager.setLoginRedirectUrl(destinationUrl);
      }
    }
  }
)();
