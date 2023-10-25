(
  function() {
    'use strict';

    angular
      .module('app.commons.authentication')
      .provider('AuthenticationManager', AuthenticationManagerProvider)
    ;

    /* @ngInject */
    function AuthenticationManagerProvider($stateProvider,CulturesProvider) {
      var provider = this;
      this.identityServerConfig = {
        url: undefined,
        authority: undefined,
        clientId: undefined,
        responseType: undefined,
        scope: undefined,
        redirectUri: undefined,
        postLogoutRedirectUri: undefined,
        checkSessionUri: undefined,
        silentRedirectUri: undefined,
        tokenName: undefined
      };

      provider.setUrl = function setUrl(value) {
        provider.identityServerConfig.url = value;
      };

      provider.setAuthority = function setAuthority(value) {
        provider.identityServerConfig.authority = value;
      };

      provider.setClientId = function setClientId(value) {
        provider.identityServerConfig.clientId = value;
      };

      provider.setResponseType = function setResponseType(value) {
        provider.identityServerConfig.responseType = value;
      };

      provider.setScope = function setScope(value) {
        provider.identityServerConfig.scope = value;
      };

      provider.setRedirectUri = function setRedirectUri(value) {
        provider.identityServerConfig.redirectUri = value;
      };

      provider.setPostLogoutRedirectUri = function setPostLogoutRedirectUri(value) {
        provider.identityServerConfig.postLogoutRedirectUri = value;
      };

      provider.setSilentRedirectUri = function setSilentRedirectUri(value) {
        provider.identityServerConfig.silentRedirectUri = value;
      };

      provider.setTokenName = function setTokenName(value) {
        provider.identityServerConfig.tokenName = value;
      };

      provider.setLoginLogoutCallbackStates = function setLoginLogoutCallbackStates() {
        /*The following is an adaptation/override of angular-openid to work with ui-router, instead of angular-route.
        The service could not simply be decorated, as following overrided section is originally defined in a config block.
        DO NOT ALTER, as code is identical to the angular-openid, except references to ui-router. We want to keep the same behavior
        than the original library to stick to it as much as possible.*/

        /* @ngInject */
        var loginResolver = function loginResolver($rootScope, $q, $stateParams, OpenIdManager) {
          $rootScope.$broadcast('openid:login_started');
          var d = $q.defer();
          var query = [];
          for (var param in $stateParams) {
            if ($stateParams.hasOwnProperty(param)) {
              query.push(param + '=' + $stateParams[param]);
            }
          }
          OpenIdManager
              .manager
              .processTokenCallbackAsync(query.join('&'))
              .then(function() {
                    $rootScope.$broadcast('openid:login_succeeded');
                    d.resolve();
                  },
                  function(err) {
                    $rootScope.$broadcast('openid:login_failed', err);
                    d.reject();
                  });
          return d.promise;
        };

        /* @ngInject */
        var logoutResolver = function logoutResolver($q, $rootScope) {
          var d = $q.defer();
          $rootScope.$broadcast('openid:logout_succeeded');
          d.reject();
          return d.promise;
        };

        /*Here, we must set states used by angular-openid, with resolve functions based on ui-router
         instead of those defined in the library based on angular-route.*/
        $stateProvider
            .state({
              name: 'login',
              url: '/callback/login',
              resolve: {
                login: loginResolver
              }
            })
            .state({
              name: 'logout',
              url: '/callback/logout',
              resolve: {
                logout: logoutResolver
              }
            });
      };

      this.$get = AuthenticationManagerService;

      /* @ngInject */
      function AuthenticationManagerService(OpenIdManager, $window, $q, Cultures) {
        var service = this;

        service.deferredTokenObtention = $q.defer();
        service.authenticationInfos = OpenIdManager.model;
        service.config = {
          authority: getAuthority(),
          'client_id': getClientId(),
          'redirect_uri': $window.location.protocol + '//' + $window.location.host + '/' + getRedirectUri(),
          'post_logout_redirect_uri': $window.location.protocol + '//' + $window.location.host + '/' + getPostLogoutRedirectUri(),
          scope: getScope(),
          'load_user_profile': true,
          'silent_redirect_uri': $window.location.protocol + '//' + $window.location.host  + '/'  + getSilentRedirectUri(),
          'silent_renew': true,
          'silent_renew_onload': true
        };

        service.login = function () {
          // get the current language
          OpenIdManager.login(Cultures.getCurrentCultureCode());
        };

        service.logout = function () {
          // get the current language
          OpenIdManager.logout(Cultures.getCurrentCultureCode());
        };

        service.setLoginRedirectUrl = function setLoginRedirectUrl(url) {
          sessionStorage.setItem('login-redirect-url', url);
        };

        service.getLoginRedirectUrl = function getLoginRedirectUrl() {
          var loginRedirectUrl = sessionStorage.getItem('login-redirect-url');
          return _.isNil(loginRedirectUrl) ? '/' : loginRedirectUrl;
        };

        service.onTokenObtention = function tokenRenewed() {
          this.deferredTokenObtention.resolve();
        };

        service.isUserIdentified = function isUserIdentified() {
          if (!_.isNil(service.authenticationInfos.identity) && !service.authenticationInfos.identity.expired) {
            return true;
          }
          return false;
        };

        service.willTokenBeRenewed = function willTokenBeRenewed() {
          if (service.config['silent_renew'] && service.config['silent_renew_onload']) {
            return true;
          }
          return false;
        };

        service.getLocaleIdFromAuthenticatedUser = function getLocaleIdFromAuthenticatedUser() {
          var token = sessionStorage.getItem('TokenManager.token');
          if (!_.isNil(token)) {
            return angular.fromJson(token).profile.locale.toLowerCase();
          }
          return Cultures.getCurrentCultureCodeLowerCase();
        };

        service.getTokenId = function getTokenId() {
          var token = sessionStorage.getItem('TokenManager.token');
          if (!_.isNil(token)) {
            return angular.fromJson(token)['id_token'];
          }
          return token;
        };

        service.configureOpenId = function getConfig() {
          OpenIdManager.setConfig(service.config);
        };

        service.getUrl = getUrl;

        service.getClientId = getClientId;

        service.getPostLogoutRedirectUri = getPostLogoutRedirectUri;

        function getUrl() {
          return provider.identityServerConfig.url || '';
        }

        function getAuthority() {
          return provider.identityServerConfig.authority || '';
        }

        function getClientId() {
          return provider.identityServerConfig.clientId || '';
        }

        function getResponseType() {
          return provider.identityServerConfig.responseType || '';
        }

        function getScope() {
          return provider.identityServerConfig.scope || '';
        }

        function getRedirectUri() {
          return provider.identityServerConfig.redirectUri || '';
        }

        function getPostLogoutRedirectUri() {
          return provider.identityServerConfig.postLogoutRedirectUri || '';
        }

        function getSilentRedirectUri() {
          return provider.identityServerConfig.silentRedirectUri || '';
        }

        return service;
      }
    }
  }
)();
