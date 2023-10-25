(function () {
    'use strict';

    angular
        .module('app.platform')
        .factory('buildMenuService', buildMenuService);

    /* @ngInject */
    function buildMenuService(OpenIdManager, $rootScope, $location, AuthenticationManager) {
        var service = {
            getUser: getUser,
            setBrand: setBrand,
            setMenu: setMenu,
        };

        return service;

        /* ------------- Public Functions -------------
        -------------------------------------------------*/

        function getUser() {
            //var config = $rootScope.componentsConfigs.logout;
            var profile = OpenIdManager.model.identity.profile;
            var language = profile.locale;

            var initial = getInitialUser(profile);
            var infoUserToDisplay = getInfoUserToDisplay(profile);
            var fullname = getFullName(profile);

            var configUser = {
                infoUserToDisplay: infoUserToDisplay,
                fullname: fullname,
                initial: initial,
                logoutUri: AuthenticationManager.identityServerConfig.url + 'endsession' + '?' + 'post_logout_redirect_uri=' + AuthenticationManager.config['post_logout_redirect_uri'] + '&id_token_hint=' + AuthenticationManager.getTokenId()
            };

            if (language) {
                configUser.logoutUri = configUser.logoutUri + '&ui_locales=' + language;
            }

            return configUser;
        }

        function setBrand(config, host) {
            var configBrand = {
                appInstance: '',
                appName: '',
                env: '',
                icon: ''
            };
            var userLanguage = OpenIdManager.model.identity.profile.locale;

            // App Instance
            configBrand.appInstance = config[host].DisplayNames[userLanguage];

            // App Name
            var currentApplication = currentHost(config[host].Domains, host);
            if (Object.keys(currentApplication).length !== 0) {
                configBrand.appName = currentApplication.application.ApplicationName;
                configBrand.env = currentApplication.application.Env;
            }

            //Icon
            configBrand.icon = 'icon-domain-' + currentApplication.domainName;
            return configBrand;
        }

        function setMenu(config, host) {
            var configMenu = {};
            var domains = [];
            config[host].Domains.forEach(function (domain) {
                var app = createApp(domain);
                var domainVisible = false;
                // Manage simple instance
                if (domain.Applications.length === 1) {
                    if (checkProperty(domain.Applications[0], 'ApplicationUrl')) {
                        if (compareHost(domain.Applications[0].ApplicationUrl, host)) {
                            app.isActive = true;
                        }
                        domainVisible = true;
                        app.url = domain.Applications[0].ApplicationUrl;
                        app.target = domain.Applications[0].Target ? domain.Applications[0].Target : undefined;
                        app.appInstances = [];
                    }
                }
                // Manage multiple instance
                else {
                    var listInstance = multipleInstance(domain, host);
                    if (listInstance.appInstances.length > 0) {
                        app.appInstances = listInstance.appInstances;
                        app.isActive = listInstance.domainActive;
                        domainVisible = true;
                        app.target = listInstance.target;
                    }
                }

                if (domainVisible) {
                    domains.push(app);
                }
            });

            configMenu.domains = domains;
            return configMenu;
        }

        /* ------------- Private Functions -------------
        -------------------------------------------------*/

        function checkProperty(value, prop) {
            var propExist = value.hasOwnProperty(prop);
            if (propExist && value[prop] !== '') {
                return true;
            } else {
                return false;
            }
        }

        function compareHost(hostToCompare, host) {
            if (hostToCompare === $location.protocol() + '://' + host) {
                return true;
            }
            return false;
        }

        function createApp(domain) {
            var app = {};
            app.name = domain.DomainName;
            app.tooltip = domain.DomainName + '_TOOLTIP_KEY';
            app.iconClass = 'icon-domain-' + domain.DomainName;
            return app;
        }

        function currentHost(domains, host) {
            var candidat = {};
            domains.forEach(function (domain) {
                domain.Applications.forEach(function (application) {
                    if (compareHost(application.ApplicationUrl, host)) {
                        candidat.application = application;
                        candidat.domainName = domain.DomainName;
                    }
                });
            });
            return candidat;
        }

        function getInfoUserToDisplay(profile) {
            var objInfoUser = {
                nameToDisplay: '',
                tooltipDisplay: false
            };
            var fullName = profile['given_name'] + ' ' + profile['family_name'];
            if (fullName.length < 27) {
                objInfoUser.nameToDisplay = profile['given_name'] + ' ' + profile['family_name'];
            } else {
                objInfoUser.nameToDisplay = profile['given_name'] + ' ' + profile['family_name'][0] + '.';
                objInfoUser.tooltipDisplay = true;
            }

            return objInfoUser;
        }

        function getFullName(profile) {
            return profile['given_name'] + ' ' + profile['family_name'];
        }

        function getInitialUser(profile) {
            return profile['given_name'][0] + profile['family_name'][0];
        }

        function multipleInstance(domain, host) {
            var obj = {};
            var appInstances = [];
            for (var i = 0; i < domain.Applications.length; i++) {
                if (checkProperty(domain.Applications[i], 'ApplicationUrl')) {
                    var instance = {};
                    if (compareHost(domain.Applications[i].ApplicationUrl, host)) {
                        // Main Domain
                        obj.domainActive = true;
                        // Sub Domain
                        instance.isActive = true;
                    }
                    instance.name = domain.Applications[i].ApplicationName;
                    instance.env = domain.Applications[i].Env;
                    instance.url = domain.Applications[i].ApplicationUrl;
                    instance.target = domain.Applications[i].Target ? domain.Applications[i].Target : undefined;
                    appInstances.push(instance);
                }
            }

            obj.appInstances = appInstances;
            return obj;
        }
    }
})();
