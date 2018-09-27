(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ngx-translate/core'), require('rxjs'), require('@angular/common'), require('@angular/router'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@gilsdav/ngx-translate-router', ['exports', '@angular/core', '@ngx-translate/core', 'rxjs', '@angular/common', '@angular/router', 'rxjs/operators'], factory) :
    (factory((global.gilsdav = global.gilsdav || {}, global.gilsdav['ngx-translate-router'] = {}),global.ng.core,null,global.rxjs,global.ng.common,global.ng.router,global.rxjs.operators));
}(this, (function (exports,core,core$1,rxjs,common,router,operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Guard to make sure we have single initialization of forRoot
     * @type {?}
     */
    var LOCALIZE_ROUTER_FORROOT_GUARD = new core.InjectionToken('LOCALIZE_ROUTER_FORROOT_GUARD');
    /**
     * Static provider for keeping track of routes
     * @type {?}
     */
    var RAW_ROUTES = new core.InjectionToken('RAW_ROUTES');
    /**
     * Namespace for fail proof access of CacheMechanism
     */
    (function (CacheMechanism) {
        CacheMechanism.LocalStorage = 'LocalStorage';
        CacheMechanism.Cookie = 'Cookie';
    })(exports.CacheMechanism || (exports.CacheMechanism = {}));
    /**
     * Boolean to indicate whether to use cached language value
     * @type {?}
     */
    var USE_CACHED_LANG = new core.InjectionToken('USE_CACHED_LANG');
    /**
     * Cache mechanism type
     * @type {?}
     */
    var CACHE_MECHANISM = new core.InjectionToken('CACHE_MECHANISM');
    /**
     * Cache name
     * @type {?}
     */
    var CACHE_NAME = new core.InjectionToken('CACHE_NAME');
    /**
     * Function for calculating default language
     * @type {?}
     */
    var DEFAULT_LANG_FUNCTION = new core.InjectionToken('DEFAULT_LANG_FUNCTION');
    /**
     * Boolean to indicate whether prefix should be set for single language scenarios
     * @type {?}
     */
    var ALWAYS_SET_PREFIX = new core.InjectionToken('ALWAYS_SET_PREFIX');
    /** @type {?} */
    var LOCALIZE_CACHE_NAME = 'LOCALIZE_DEFAULT_LANGUAGE';
    var LocalizeRouterSettings = (function () {
        /**
         * Settings for localize router
         */
        function LocalizeRouterSettings(useCachedLang, alwaysSetPrefix, cacheMechanism, cacheName, defaultLangFunction) {
            if (useCachedLang === void 0) {
                useCachedLang = true;
            }
            if (alwaysSetPrefix === void 0) {
                alwaysSetPrefix = true;
            }
            if (cacheMechanism === void 0) {
                cacheMechanism = exports.CacheMechanism.LocalStorage;
            }
            if (cacheName === void 0) {
                cacheName = LOCALIZE_CACHE_NAME;
            }
            if (defaultLangFunction === void 0) {
                defaultLangFunction = void 0;
            }
            this.useCachedLang = useCachedLang;
            this.alwaysSetPrefix = alwaysSetPrefix;
            this.cacheMechanism = cacheMechanism;
            this.cacheName = cacheName;
            this.defaultLangFunction = defaultLangFunction;
        }
        LocalizeRouterSettings.ctorParameters = function () {
            return [
                { type: Boolean, decorators: [{ type: core.Inject, args: [USE_CACHED_LANG,] }] },
                { type: Boolean, decorators: [{ type: core.Inject, args: [ALWAYS_SET_PREFIX,] }] },
                { type: exports.CacheMechanism, decorators: [{ type: core.Inject, args: [CACHE_MECHANISM,] }] },
                { type: String, decorators: [{ type: core.Inject, args: [CACHE_NAME,] }] },
                { type: undefined, decorators: [{ type: core.Inject, args: [DEFAULT_LANG_FUNCTION,] }] }
            ];
        };
        return LocalizeRouterSettings;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var COOKIE_EXPIRY = 30;
    // 1 month
    /**
     * Abstract class for parsing localization
     * @abstract
     */
    var LocalizeParser = (function () {
        /**
         * Loader constructor
         */
        function LocalizeParser(translate, location, settings) {
            this.translate = translate;
            this.location = location;
            this.settings = settings;
        }
        /**
       * Prepare routes to be fully usable by ngx-translate-router
       * @param routes
       */
        /* private initRoutes(routes: Routes, prefix = '') {
          routes.forEach(route => {
            if (route.path !== '**') {
              const routeData: any = route.data = route.data || {};
              routeData.localizeRouter = {};
              routeData.localizeRouter.fullPath = `${prefix}/${route.path}`;
              if (route.children && route.children.length > 0) {
                this.initRoutes(route.children, routeData.localizeRouter.fullPath);
              }
            }
          });
        } */
        /**
         * Initialize language and routes
         */
        /**
         * Prepare routes to be fully usable by ngx-translate-router
         * @param routes
         */
        /* private initRoutes(routes: Routes, prefix = '') {
            routes.forEach(route => {
              if (route.path !== '**') {
                const routeData: any = route.data = route.data || {};
                routeData.localizeRouter = {};
                routeData.localizeRouter.fullPath = `${prefix}/${route.path}`;
                if (route.children && route.children.length > 0) {
                  this.initRoutes(route.children, routeData.localizeRouter.fullPath);
                }
              }
            });
          } */
        /**
         * Initialize language and routes
         * @param {?} routes
         * @return {?}
         */
        LocalizeParser.prototype.init = /**
         * Prepare routes to be fully usable by ngx-translate-router
         * @param routes
         */
            /* private initRoutes(routes: Routes, prefix = '') {
                routes.forEach(route => {
                  if (route.path !== '**') {
                    const routeData: any = route.data = route.data || {};
                    routeData.localizeRouter = {};
                    routeData.localizeRouter.fullPath = `${prefix}/${route.path}`;
                    if (route.children && route.children.length > 0) {
                      this.initRoutes(route.children, routeData.localizeRouter.fullPath);
                    }
                  }
                });
              } */
            /**
             * Initialize language and routes
             * @param {?} routes
             * @return {?}
             */
            function (routes) {
                /** @type {?} */
                var selectedLanguage;
                // this.initRoutes(routes);
                this.routes = routes;
                if (!this.locales || !this.locales.length) {
                    return Promise.resolve();
                }
                /**
                 * detect current language
                 * @type {?}
                 */
                var locationLang = this.getLocationLang();
                /** @type {?} */
                var browserLang = this._getBrowserLang();
                if (this.settings.defaultLangFunction) {
                    this.defaultLang = this.settings.defaultLangFunction(this.locales, this._cachedLang, browserLang);
                }
                else {
                    this.defaultLang = this._cachedLang || browserLang || this.locales[0];
                }
                selectedLanguage = locationLang || this.defaultLang;
                this.translate.setDefaultLang(this.defaultLang);
                /** @type {?} */
                var children = [];
                /** if set prefix is enforced */
                if (this.settings.alwaysSetPrefix) {
                    /** @type {?} */
                    var baseRoute = { path: '', redirectTo: this.defaultLang, pathMatch: 'full' };
                    /**
                     * extract potential wildcard route
                     * @type {?}
                     */
                    var wildcardIndex = routes.findIndex(function (route) { return route.path === '**'; });
                    if (wildcardIndex !== -1) {
                        this._wildcardRoute = routes.splice(wildcardIndex, 1)[0];
                    }
                    children = this.routes.splice(0, this.routes.length, baseRoute);
                }
                else {
                    children = __spread(this.routes); // shallow copy of routes
                }
                /** exclude certain routes */
                for (var i = children.length - 1; i >= 0; i--) {
                    if (children[i].data && children[i].data['skipRouteLocalization']) {
                        if (this.settings.alwaysSetPrefix) {
                            // add directly to routes
                            this.routes.push(children[i]);
                        }
                        children.splice(i, 1);
                    }
                }
                /** append children routes */
                if (children && children.length) {
                    if (this.locales.length > 1 || this.settings.alwaysSetPrefix) {
                        this._languageRoute = { children: children };
                        this.routes.unshift(this._languageRoute);
                    }
                }
                /** ...and potential wildcard route */
                if (this._wildcardRoute && this.settings.alwaysSetPrefix) {
                    this.routes.push(this._wildcardRoute);
                }
                /**
                 * translate routes
                 * @type {?}
                 */
                var res = this.translateRoutes(selectedLanguage);
                return res.toPromise();
            };
        /**
         * @param {?} routes
         * @return {?}
         */
        LocalizeParser.prototype.initChildRoutes = /**
         * @param {?} routes
         * @return {?}
         */
            function (routes) {
                this._translateRouteTree(routes);
                return routes;
            };
        /**
         * Translate routes to selected language
         */
        /**
         * Translate routes to selected language
         * @param {?} language
         * @return {?}
         */
        LocalizeParser.prototype.translateRoutes = /**
         * Translate routes to selected language
         * @param {?} language
         * @return {?}
         */
            function (language) {
                var _this = this;
                return new rxjs.Observable(function (observer) {
                    _this._cachedLang = language;
                    if (_this._languageRoute) {
                        _this._languageRoute.path = language;
                    }
                    _this.translate.use(language).subscribe(function (translations) {
                        _this._translationObject = translations;
                        _this.currentLang = language;
                        if (_this._languageRoute) {
                            if (_this._languageRoute) {
                                _this._translateRouteTree(_this._languageRoute.children);
                            }
                            // if there is wildcard route
                            if (_this._wildcardRoute && _this._wildcardRoute.redirectTo) {
                                _this._translateProperty(_this._wildcardRoute, 'redirectTo', true);
                            }
                        }
                        else {
                            _this._translateRouteTree(_this.routes);
                        }
                        observer.next(void 0);
                        observer.complete();
                    });
                });
            };
        /**
         * Translate the route node and recursively call for all it's children
         */
        /**
         * Translate the route node and recursively call for all it's children
         * @param {?} routes
         * @return {?}
         */
        LocalizeParser.prototype._translateRouteTree = /**
         * Translate the route node and recursively call for all it's children
         * @param {?} routes
         * @return {?}
         */
            function (routes) {
                var _this = this;
                routes.forEach(function (route) {
                    if (route.path && route.path !== '**') {
                        _this._translateProperty(route, 'path');
                    }
                    if (route.redirectTo) {
                        _this._translateProperty(route, 'redirectTo', !route.redirectTo.indexOf('/'));
                    }
                    if (route.children) {
                        _this._translateRouteTree(route.children);
                    }
                    if (route.loadChildren && (((route)))._loadedConfig) {
                        _this._translateRouteTree((((route)))._loadedConfig.routes);
                    }
                });
            };
        /**
         * Translate property
         * If first time translation then add original to route data object
         */
        /**
         * Translate property
         * If first time translation then add original to route data object
         * @param {?} route
         * @param {?} property
         * @param {?=} prefixLang
         * @return {?}
         */
        LocalizeParser.prototype._translateProperty = /**
         * Translate property
         * If first time translation then add original to route data object
         * @param {?} route
         * @param {?} property
         * @param {?=} prefixLang
         * @return {?}
         */
            function (route, property, prefixLang) {
                // set property to data if not there yet
                /** @type {?} */
                var routeData = route.data = route.data || {};
                if (!routeData.localizeRouter) {
                    routeData.localizeRouter = {};
                }
                if (!routeData.localizeRouter[property]) {
                    routeData.localizeRouter[property] = (((route)))[property];
                }
                /** @type {?} */
                var result = this.translateRoute(routeData.localizeRouter[property]);
                (((route)))[property] = prefixLang ? "/" + this.urlPrefix + result : result;
            };
        Object.defineProperty(LocalizeParser.prototype, "urlPrefix", {
            get: /**
             * @return {?}
             */ function () {
                return this.settings.alwaysSetPrefix || this.currentLang !== this.defaultLang ? this.currentLang : '';
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Translate route and return observable
         */
        /**
         * Translate route and return observable
         * @param {?} path
         * @return {?}
         */
        LocalizeParser.prototype.translateRoute = /**
         * Translate route and return observable
         * @param {?} path
         * @return {?}
         */
            function (path) {
                var _this = this;
                /** @type {?} */
                var queryParts = path.split('?');
                if (queryParts.length > 2) {
                    throw Error('There should be only one query parameter block in the URL');
                }
                /** @type {?} */
                var pathSegments = queryParts[0].split('/');
                /** collect observables  */
                return pathSegments
                    .map(function (part) { return part.length ? _this.translateText(part) : part; })
                    .join('/') +
                    (queryParts.length > 1 ? "?" + queryParts[1] : '');
            };
        /**
         * Get language from url
         */
        /**
         * Get language from url
         * @param {?=} url
         * @return {?}
         */
        LocalizeParser.prototype.getLocationLang = /**
         * Get language from url
         * @param {?=} url
         * @return {?}
         */
            function (url) {
                /** @type {?} */
                var queryParamSplit = (url || this.location.path()).split('?');
                /** @type {?} */
                var pathSlices = [];
                if (queryParamSplit.length > 0) {
                    pathSlices = queryParamSplit[0].split('/');
                }
                if (pathSlices.length > 1 && this.locales.indexOf(pathSlices[1]) !== -1) {
                    return pathSlices[1];
                }
                if (pathSlices.length && this.locales.indexOf(pathSlices[0]) !== -1) {
                    return pathSlices[0];
                }
                return null;
            };
        /**
         * Get user's language set in the browser
         */
        /**
         * Get user's language set in the browser
         * @return {?}
         */
        LocalizeParser.prototype._getBrowserLang = /**
         * Get user's language set in the browser
         * @return {?}
         */
            function () {
                return this._returnIfInLocales(this.translate.getBrowserLang());
            };
        Object.defineProperty(LocalizeParser.prototype, "_cachedLang", {
            /**
             * Get language from local storage or cookie
             */
            get: /**
             * Get language from local storage or cookie
             * @return {?}
             */ function () {
                if (!this.settings.useCachedLang) {
                    return;
                }
                if (this.settings.cacheMechanism === exports.CacheMechanism.LocalStorage) {
                    return this._cacheWithLocalStorage();
                }
                if (this.settings.cacheMechanism === exports.CacheMechanism.Cookie) {
                    return this._cacheWithCookies();
                }
            },
            /**
             * Save language to local storage or cookie
             */
            set: /**
             * Save language to local storage or cookie
             * @param {?} value
             * @return {?}
             */ function (value) {
                if (!this.settings.useCachedLang) {
                    return;
                }
                if (this.settings.cacheMechanism === exports.CacheMechanism.LocalStorage) {
                    this._cacheWithLocalStorage(value);
                }
                if (this.settings.cacheMechanism === exports.CacheMechanism.Cookie) {
                    this._cacheWithCookies(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Cache value to local storage
         */
        /**
         * Cache value to local storage
         * @param {?=} value
         * @return {?}
         */
        LocalizeParser.prototype._cacheWithLocalStorage = /**
         * Cache value to local storage
         * @param {?=} value
         * @return {?}
         */
            function (value) {
                if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
                    return;
                }
                try {
                    if (value) {
                        window.localStorage.setItem(this.settings.cacheName, value);
                        return;
                    }
                    return this._returnIfInLocales(window.localStorage.getItem(this.settings.cacheName));
                }
                catch (e) {
                    // weird Safari issue in private mode, where LocalStorage is defined but throws error on access
                    return;
                }
            };
        /**
         * Cache value via cookies
         */
        /**
         * Cache value via cookies
         * @param {?=} value
         * @return {?}
         */
        LocalizeParser.prototype._cacheWithCookies = /**
         * Cache value via cookies
         * @param {?=} value
         * @return {?}
         */
            function (value) {
                if (typeof document === 'undefined' || typeof document.cookie === 'undefined') {
                    return;
                }
                try {
                    /** @type {?} */
                    var name_1 = encodeURIComponent(this.settings.cacheName);
                    if (value) {
                        /** @type {?} */
                        var d = new Date();
                        d.setTime(d.getTime() + COOKIE_EXPIRY * 86400000); // * days
                        document.cookie = name_1 + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString();
                        return;
                    }
                    /** @type {?} */
                    var regexp = new RegExp('(?:^' + name_1 + '|;\\s*' + name_1 + ')=(.*?)(?:;|$)', 'g');
                    /** @type {?} */
                    var result = regexp.exec(document.cookie);
                    return decodeURIComponent(result[1]);
                }
                catch (e) {
                    return; // should not happen but better safe than sorry
                }
            };
        /**
         * Check if value exists in locales list
         */
        /**
         * Check if value exists in locales list
         * @param {?} value
         * @return {?}
         */
        LocalizeParser.prototype._returnIfInLocales = /**
         * Check if value exists in locales list
         * @param {?} value
         * @return {?}
         */
            function (value) {
                if (value && this.locales.indexOf(value) !== -1) {
                    return value;
                }
                return null;
            };
        /**
         * Get translated value
         */
        /**
         * Get translated value
         * @param {?} key
         * @return {?}
         */
        LocalizeParser.prototype.translateText = /**
         * Get translated value
         * @param {?} key
         * @return {?}
         */
            function (key) {
                if (!this._translationObject) {
                    return key;
                }
                /** @type {?} */
                var fullKey = this.prefix + key;
                /** @type {?} */
                var res = this.translate.getParsedResult(this._translationObject, fullKey);
                return res !== fullKey ? res : key;
            };
        LocalizeParser.ctorParameters = function () {
            return [
                { type: core$1.TranslateService, decorators: [{ type: core.Inject, args: [core$1.TranslateService,] }] },
                { type: common.Location, decorators: [{ type: core.Inject, args: [common.Location,] }] },
                { type: LocalizeRouterSettings, decorators: [{ type: core.Inject, args: [LocalizeRouterSettings,] }] }
            ];
        };
        return LocalizeParser;
    }());
    /**
     * Manually set configuration
     */
    var /**
     * Manually set configuration
     */ ManualParserLoader = (function (_super) {
        __extends(ManualParserLoader, _super);
        /**
         * CTOR
         */
        function ManualParserLoader(translate, location, settings, locales, prefix) {
            if (locales === void 0) {
                locales = ['en'];
            }
            if (prefix === void 0) {
                prefix = 'ROUTES.';
            }
            var _this = _super.call(this, translate, location, settings) || this;
            _this.locales = locales;
            _this.prefix = prefix || '';
            return _this;
        }
        /**
         * Initialize or append routes
         */
        /**
         * Initialize or append routes
         * @param {?} routes
         * @return {?}
         */
        ManualParserLoader.prototype.load = /**
         * Initialize or append routes
         * @param {?} routes
         * @return {?}
         */
            function (routes) {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.init(routes).then(resolve);
                });
            };
        return ManualParserLoader;
    }(LocalizeParser));
    var DummyLocalizeParser = (function (_super) {
        __extends(DummyLocalizeParser, _super);
        function DummyLocalizeParser() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @param {?} routes
         * @return {?}
         */
        DummyLocalizeParser.prototype.load = /**
         * @param {?} routes
         * @return {?}
         */
            function (routes) {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.init(routes).then(resolve);
                });
            };
        return DummyLocalizeParser;
    }(LocalizeParser));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Localization service
     * modifyRoutes
     */
    var LocalizeRouterService = (function () {
        /**
         * CTOR
         */
        function LocalizeRouterService(parser, settings, router$$1, route) {
            this.parser = parser;
            this.settings = settings;
            this.router = router$$1;
            this.route = route;
            this.routerEvents = new rxjs.Subject();
        }
        /**
         * Start up the service
         */
        /**
         * Start up the service
         * @return {?}
         */
        LocalizeRouterService.prototype.init = /**
         * Start up the service
         * @return {?}
         */
            function () {
                this.router.resetConfig(this.parser.routes);
                // subscribe to router events
                this.router.events
                    .pipe(operators.filter(function (event) { return event instanceof router.NavigationStart; }), operators.pairwise())
                    .subscribe(this._routeChanged());
            };
        /**
         * Change language and navigate to translated route
         */
        /**
         * Change language and navigate to translated route
         * @param {?} lang
         * @param {?=} extras
         * @param {?=} useNavigateMethod
         * @return {?}
         */
        LocalizeRouterService.prototype.changeLanguage = /**
         * Change language and navigate to translated route
         * @param {?} lang
         * @param {?=} extras
         * @param {?=} useNavigateMethod
         * @return {?}
         */
            function (lang, extras, useNavigateMethod) {
                var _this = this;
                if (this.route) {
                    console.log(this.route);
                }
                if (lang !== this.parser.currentLang) {
                    /** @type {?} */
                    var rootSnapshot_1 = this.router.routerState.snapshot.root;
                    this.parser.translateRoutes(lang).subscribe(function () {
                        /** @type {?} */
                        var queryParams = rootSnapshot_1.queryParams;
                        /** @type {?} */
                        var url = '';
                        if (Object.keys(queryParams).length !== 0) {
                            /** @type {?} */
                            var queryString = Object.keys(queryParams).map(function (key) {
                                return key + '=' + queryParams[key];
                            }).join('&');
                            url = _this.traverseRouteSnapshot(rootSnapshot_1) + '?' + queryString;
                        }
                        else {
                            url = _this.traverseRouteSnapshot(rootSnapshot_1);
                        }
                        if (!_this.settings.alwaysSetPrefix) {
                            /** @type {?} */
                            var urlSegments = url.split('/');
                            /** @type {?} */
                            var languageSegmentIndex = urlSegments.indexOf(_this.parser.currentLang);
                            // If the default language has no prefix make sure to remove and add it when necessary
                            if (_this.parser.currentLang === _this.parser.defaultLang) {
                                // Remove the language prefix from url when current language is the default language
                                if (languageSegmentIndex === 0 || (languageSegmentIndex === 1 && urlSegments[0] === '')) {
                                    // Remove the current aka default language prefix from the url
                                    urlSegments = urlSegments.slice(0, languageSegmentIndex).concat(urlSegments.slice(languageSegmentIndex + 1));
                                }
                            }
                            else {
                                // When coming from a default language it's possible that the url doesn't contain the language, make sure it does.
                                if (languageSegmentIndex === -1) {
                                    // If the url starts with a slash make sure to keep it.
                                    /** @type {?} */
                                    var injectionIndex = urlSegments[0] === '' ? 1 : 0;
                                    urlSegments = urlSegments.slice(0, injectionIndex).concat(_this.parser.currentLang, urlSegments.slice(injectionIndex));
                                }
                            }
                            url = urlSegments.join('/');
                        }
                        _this.router.resetConfig(_this.parser.routes);
                        if (useNavigateMethod) {
                            _this.router.navigate([url], extras);
                        }
                        else {
                            _this.router.navigateByUrl(url, extras);
                        }
                    });
                }
            };
        /**
         * Traverses through the tree to assemble new translated url
         */
        /**
         * Traverses through the tree to assemble new translated url
         * @param {?} snapshot
         * @return {?}
         */
        LocalizeRouterService.prototype.traverseRouteSnapshot = /**
         * Traverses through the tree to assemble new translated url
         * @param {?} snapshot
         * @return {?}
         */
            function (snapshot) {
                if (snapshot.firstChild && snapshot.routeConfig) {
                    return this.parseSegmentValue(snapshot) + "/" + this.traverseRouteSnapshot(snapshot.firstChild);
                }
                else if (snapshot.firstChild) {
                    return this.traverseRouteSnapshot(snapshot.firstChild);
                }
                else {
                    return this.parseSegmentValue(snapshot);
                }
                /* if (snapshot.firstChild && snapshot.firstChild.routeConfig && snapshot.firstChild.routeConfig.path) {
                  if (snapshot.firstChild.routeConfig.path !== '**') {
                    return this.parseSegmentValue(snapshot) + '/' + this.traverseRouteSnapshot(snapshot.firstChild);
                  } else {
                    return this.parseSegmentValue(snapshot.firstChild);
                  }
                }
                return this.parseSegmentValue(snapshot); */
            };
        /**
         * Extracts new segment value based on routeConfig and url
         */
        /**
         * Extracts new segment value based on routeConfig and url
         * @param {?} snapshot
         * @return {?}
         */
        LocalizeRouterService.prototype.parseSegmentValue = /**
         * Extracts new segment value based on routeConfig and url
         * @param {?} snapshot
         * @return {?}
         */
            function (snapshot) {
                if (snapshot.data.localizeRouter) {
                    /** @type {?} */
                    var path = snapshot.data.localizeRouter.path;
                    /** @type {?} */
                    var subPathSegments = path.split('/');
                    return subPathSegments.map(function (s, i) { return s.indexOf(':') === 0 ? snapshot.url[i].path : s; }).join('/');
                }
                else {
                    return '';
                }
                /* if (snapshot.routeConfig) {
                  if (snapshot.routeConfig.path === '**') {
                    return snapshot.url.filter((segment: UrlSegment) => segment.path).map((segment: UrlSegment) => segment.path).join('/');
                  } else {
                    const subPathSegments = snapshot.routeConfig.path.split('/');
                    return subPathSegments.map((s: string, i: number) => s.indexOf(':') === 0 ? snapshot.url[i].path : s).join('/');
                  }
                }
                return ''; */
            };
        /**
         * Translate route to current language
         * If new language is explicitly provided then replace language part in url with new language
         */
        /**
         * Translate route to current language
         * If new language is explicitly provided then replace language part in url with new language
         * @param {?} path
         * @return {?}
         */
        LocalizeRouterService.prototype.translateRoute = /**
         * Translate route to current language
         * If new language is explicitly provided then replace language part in url with new language
         * @param {?} path
         * @return {?}
         */
            function (path) {
                var _this = this;
                if (typeof path === 'string') {
                    /** @type {?} */
                    var url = this.parser.translateRoute(path);
                    return !path.indexOf('/') ? "/" + this.parser.urlPrefix + url : url;
                }
                // it's an array
                /** @type {?} */
                var result = [];
                (((path))).forEach(function (segment, index) {
                    if (typeof segment === 'string') {
                        /** @type {?} */
                        var res = _this.parser.translateRoute(segment);
                        if (!index && !segment.indexOf('/')) {
                            result.push("/" + _this.parser.urlPrefix + res);
                        }
                        else {
                            result.push(res);
                        }
                    }
                    else {
                        result.push(segment);
                    }
                });
                return result;
            };
        /**
         * Event handler to react on route change
         */
        /**
         * Event handler to react on route change
         * @return {?}
         */
        LocalizeRouterService.prototype._routeChanged = /**
         * Event handler to react on route change
         * @return {?}
         */
            function () {
                var _this = this;
                return function (_a) {
                    var _b = __read(_a, 2), previousEvent = _b[0], currentEvent = _b[1];
                    /** @type {?} */
                    var previousLang = _this.parser.getLocationLang(previousEvent.url) || _this.parser.defaultLang;
                    /** @type {?} */
                    var currentLang = _this.parser.getLocationLang(currentEvent.url) || _this.parser.defaultLang;
                    if (currentLang !== previousLang) {
                        _this.parser.translateRoutes(currentLang).subscribe(function () {
                            _this.router.resetConfig(_this.parser.routes);
                            // Fire route change event
                            _this.routerEvents.next(currentLang);
                        });
                    }
                };
            };
        LocalizeRouterService.ctorParameters = function () {
            return [
                { type: LocalizeParser, decorators: [{ type: core.Inject, args: [LocalizeParser,] }] },
                { type: LocalizeRouterSettings, decorators: [{ type: core.Inject, args: [LocalizeRouterSettings,] }] },
                { type: router.Router, decorators: [{ type: core.Inject, args: [router.Router,] }] },
                { type: router.ActivatedRoute, decorators: [{ type: core.Inject, args: [router.ActivatedRoute,] }] }
            ];
        };
        return LocalizeRouterService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Compare if two objects are same
     * @param {?} o1
     * @param {?} o2
     * @return {?}
     */
    function equals(o1, o2) {
        if (o1 === o2) {
            return true;
        }
        if (o1 === null || o2 === null) {
            return false;
        }
        if (o1 !== o1 && o2 !== o2) {
            return true; // NaN === NaN
        }
        /** @type {?} */
        var t1 = typeof o1;
        /** @type {?} */
        var t2 = typeof o2;
        /** @type {?} */
        var length;
        /** @type {?} */
        var key;
        /** @type {?} */
        var keySet;
        if (t1 === t2 && t1 === 'object') {
            if (Array.isArray(o1)) {
                if (!Array.isArray(o2)) {
                    return false;
                }
                if ((length = o1.length) === o2.length) {
                    for (key = 0; key < length; key++) {
                        if (!equals(o1[key], o2[key])) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            else {
                if (Array.isArray(o2)) {
                    return false;
                }
                keySet = Object.create(null);
                for (key in o1) {
                    if (o1.hasOwnProperty(key)) {
                        if (!equals(o1[key], o2[key])) {
                            return false;
                        }
                        keySet[key] = true;
                    }
                }
                for (key in o2) {
                    if (o2.hasOwnProperty(key)) {
                        if (!(key in keySet) && typeof o2[key] !== 'undefined') {
                            return false;
                        }
                    }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var VIEW_DESTROYED_STATE = 128;
    var LocalizeRouterPipe = (function () {
        /**
         * CTOR
         */
        function LocalizeRouterPipe(localize, _ref) {
            var _this = this;
            this.localize = localize;
            this._ref = _ref;
            this.value = '';
            this.subscription = this.localize.routerEvents.subscribe(function () {
                _this.transform(_this.lastKey);
            });
        }
        /**
         * @return {?}
         */
        LocalizeRouterPipe.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                if (this.subscription) {
                    this.subscription.unsubscribe();
                }
            };
        /**
         * Transform current url to localized one
         */
        /**
         * Transform current url to localized one
         * @param {?} query
         * @return {?}
         */
        LocalizeRouterPipe.prototype.transform = /**
         * Transform current url to localized one
         * @param {?} query
         * @return {?}
         */
            function (query) {
                if (!query || query.length === 0 || !this.localize.parser.currentLang) {
                    return query;
                }
                if (equals(query, this.lastKey) && equals(this.lastLanguage, this.localize.parser.currentLang)) {
                    return this.value;
                }
                this.lastKey = query;
                this.lastLanguage = this.localize.parser.currentLang;
                /** translate key and update values */
                this.value = this.localize.translateRoute(query);
                this.lastKey = query;
                // if view is already destroyed, ignore firing change detection
                if ((((this._ref)))._view.state & VIEW_DESTROYED_STATE) {
                    return this.value;
                }
                this._ref.detectChanges();
                return this.value;
            };
        LocalizeRouterPipe.decorators = [
            { type: core.Pipe, args: [{
                        name: 'localize',
                        pure: false // required to update the value when the promise is resolved
                    },] },
        ];
        LocalizeRouterPipe.ctorParameters = function () {
            return [
                { type: LocalizeRouterService },
                { type: core.ChangeDetectorRef }
            ];
        };
        return LocalizeRouterPipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
     */
    var LocalizeRouterConfigLoader = (function (_super) {
        __extends(LocalizeRouterConfigLoader, _super);
        function LocalizeRouterConfigLoader(localize, _compiler, config) {
            var _this = _super.call(this, _compiler, config) || this;
            _this.localize = localize;
            return _this;
        }
        /**
         * Extend load with custom functionality
         */
        /**
         * Extend load with custom functionality
         * @param {?} path
         * @return {?}
         */
        LocalizeRouterConfigLoader.prototype.load = /**
         * Extend load with custom functionality
         * @param {?} path
         * @return {?}
         */
            function (path) {
                var _this = this;
                return _super.prototype.load.call(this, path).then(function (factory) {
                    return {
                        moduleType: factory.moduleType,
                        create: function (parentInjector) {
                            /** @type {?} */
                            var module = factory.create(parentInjector);
                            /** @type {?} */
                            var getMethod = module.injector.get.bind(module.injector);
                            module.injector['get'] = function (token, notFoundValue) {
                                /** @type {?} */
                                var getResult = getMethod(token, notFoundValue);
                                if (token === router.ROUTES) {
                                    // translate lazy routes
                                    return _this.localize.initChildRoutes([].concat.apply([], __spread(getResult)));
                                }
                                else {
                                    return getResult;
                                }
                            };
                            return module;
                        }
                    };
                });
            };
        LocalizeRouterConfigLoader.decorators = [
            { type: core.Injectable },
        ];
        LocalizeRouterConfigLoader.ctorParameters = function () {
            return [
                { type: LocalizeParser, decorators: [{ type: core.Inject, args: [core.forwardRef(function () { return LocalizeParser; }),] }] },
                { type: core.Compiler },
                { type: core.SystemJsNgModuleLoaderConfig, decorators: [{ type: core.Optional }] }
            ];
        };
        return LocalizeRouterConfigLoader;
    }(core.SystemJsNgModuleLoader));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ParserInitializer = (function () {
        /**
         * CTOR
         */
        function ParserInitializer(injector) {
            this.injector = injector;
        }
        /**
         * @return {?}
         */
        ParserInitializer.prototype.appInitializer = /**
         * @return {?}
         */
            function () {
                var _this = this;
                /** @type {?} */
                var res = this.parser.load(this.routes);
                res.then(function () {
                    /** @type {?} */
                    var localize = _this.injector.get(LocalizeRouterService);
                    localize.init();
                });
                return res;
            };
        /**
         * @param {?} parser
         * @param {?} routes
         * @return {?}
         */
        ParserInitializer.prototype.generateInitializer = /**
         * @param {?} parser
         * @param {?} routes
         * @return {?}
         */
            function (parser, routes) {
                this.parser = parser;
                this.routes = routes.reduce(function (a, b) { return a.concat(b); });
                return this.appInitializer;
            };
        ParserInitializer.decorators = [
            { type: core.Injectable },
        ];
        ParserInitializer.ctorParameters = function () {
            return [
                { type: core.Injector }
            ];
        };
        return ParserInitializer;
    }());
    /**
     * @param {?} p
     * @param {?} parser
     * @param {?} routes
     * @return {?}
     */
    function getAppInitializer(p, parser, routes) {
        return p.generateInitializer(parser, routes).bind(p);
    }
    var LocalizeRouterModule = (function () {
        function LocalizeRouterModule() {
        }
        /**
         * @param {?} routes
         * @param {?=} config
         * @return {?}
         */
        LocalizeRouterModule.forRoot = /**
         * @param {?} routes
         * @param {?=} config
         * @return {?}
         */
            function (routes, config) {
                if (config === void 0) {
                    config = {};
                }
                return {
                    ngModule: LocalizeRouterModule,
                    providers: [
                        {
                            provide: LOCALIZE_ROUTER_FORROOT_GUARD,
                            useFactory: provideForRootGuard,
                            deps: [[LocalizeRouterModule, new core.Optional(), new core.SkipSelf()]]
                        },
                        { provide: USE_CACHED_LANG, useValue: config.useCachedLang },
                        { provide: ALWAYS_SET_PREFIX, useValue: config.alwaysSetPrefix },
                        { provide: CACHE_NAME, useValue: config.cacheName },
                        { provide: CACHE_MECHANISM, useValue: config.cacheMechanism },
                        { provide: DEFAULT_LANG_FUNCTION, useValue: config.defaultLangFunction },
                        LocalizeRouterSettings,
                        config.parser || { provide: LocalizeParser, useClass: DummyLocalizeParser },
                        {
                            provide: RAW_ROUTES,
                            multi: true,
                            useValue: routes
                        },
                        LocalizeRouterService,
                        ParserInitializer,
                        { provide: core.NgModuleFactoryLoader, useClass: LocalizeRouterConfigLoader },
                        {
                            provide: core.APP_INITIALIZER,
                            multi: true,
                            useFactory: getAppInitializer,
                            deps: [ParserInitializer, LocalizeParser, RAW_ROUTES]
                        }
                    ]
                };
            };
        /**
         * @param {?} routes
         * @return {?}
         */
        LocalizeRouterModule.forChild = /**
         * @param {?} routes
         * @return {?}
         */
            function (routes) {
                return {
                    ngModule: LocalizeRouterModule,
                    providers: [
                        {
                            provide: RAW_ROUTES,
                            multi: true,
                            useValue: routes
                        }
                    ]
                };
            };
        LocalizeRouterModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, router.RouterModule, core$1.TranslateModule],
                        declarations: [LocalizeRouterPipe],
                        exports: [LocalizeRouterPipe]
                    },] },
        ];
        return LocalizeRouterModule;
    }());
    /**
     * @param {?} localizeRouterModule
     * @return {?}
     */
    function provideForRootGuard(localizeRouterModule) {
        if (localizeRouterModule) {
            throw new Error("LocalizeRouterModule.forRoot() called twice. Lazy loaded modules should use LocalizeRouterModule.forChild() instead.");
        }
        return 'guarded';
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.ParserInitializer = ParserInitializer;
    exports.getAppInitializer = getAppInitializer;
    exports.LocalizeRouterModule = LocalizeRouterModule;
    exports.provideForRootGuard = provideForRootGuard;
    exports.LocalizeParser = LocalizeParser;
    exports.ManualParserLoader = ManualParserLoader;
    exports.DummyLocalizeParser = DummyLocalizeParser;
    exports.LocalizeRouterService = LocalizeRouterService;
    exports.LocalizeRouterPipe = LocalizeRouterPipe;
    exports.LOCALIZE_ROUTER_FORROOT_GUARD = LOCALIZE_ROUTER_FORROOT_GUARD;
    exports.RAW_ROUTES = RAW_ROUTES;
    exports.USE_CACHED_LANG = USE_CACHED_LANG;
    exports.CACHE_MECHANISM = CACHE_MECHANISM;
    exports.CACHE_NAME = CACHE_NAME;
    exports.DEFAULT_LANG_FUNCTION = DEFAULT_LANG_FUNCTION;
    exports.ALWAYS_SET_PREFIX = ALWAYS_SET_PREFIX;
    exports.LocalizeRouterSettings = LocalizeRouterSettings;
    exports.LocalizeRouterConfigLoader = LocalizeRouterConfigLoader;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2lsc2Rhdi1uZ3gtdHJhbnNsYXRlLXJvdXRlci51bWQuanMubWFwIiwic291cmNlcyI6W251bGwsIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5jb25maWcudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnNlcnZpY2UudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi91dGlsLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnBpcGUudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlci50cyIsIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3QsIEluamVjdGlvblRva2VuLCBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyTW9kdWxlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIubW9kdWxlJztcblxuLyoqXG4gKiBHdWFyZCB0byBtYWtlIHN1cmUgd2UgaGF2ZSBzaW5nbGUgaW5pdGlhbGl6YXRpb24gb2YgZm9yUm9vdFxuICovXG5leHBvcnQgY29uc3QgTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQgPSBuZXcgSW5qZWN0aW9uVG9rZW48TG9jYWxpemVSb3V0ZXJNb2R1bGU+KCdMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCcpO1xuXG4vKipcbiAqIFN0YXRpYyBwcm92aWRlciBmb3Iga2VlcGluZyB0cmFjayBvZiByb3V0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IFJBV19ST1VURVM6IEluamVjdGlvblRva2VuPFJvdXRlc1tdPiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSb3V0ZXNbXT4oJ1JBV19ST1VURVMnKTtcblxuLyoqXG4gKiBUeXBlIGZvciBDYWNoaW5nIG9mIGRlZmF1bHQgbGFuZ3VhZ2VcbiAqL1xuZXhwb3J0IHR5cGUgQ2FjaGVNZWNoYW5pc20gPSAnTG9jYWxTdG9yYWdlJyB8ICdDb29raWUnO1xuXG4vKipcbiAqIE5hbWVzcGFjZSBmb3IgZmFpbCBwcm9vZiBhY2Nlc3Mgb2YgQ2FjaGVNZWNoYW5pc21cbiAqL1xuZXhwb3J0IG5hbWVzcGFjZSBDYWNoZU1lY2hhbmlzbSB7XG4gIGV4cG9ydCBjb25zdCBMb2NhbFN0b3JhZ2U6IENhY2hlTWVjaGFuaXNtID0gJ0xvY2FsU3RvcmFnZSc7XG4gIGV4cG9ydCBjb25zdCBDb29raWU6IENhY2hlTWVjaGFuaXNtID0gJ0Nvb2tpZSc7XG59XG5cbi8qKlxuICogQm9vbGVhbiB0byBpbmRpY2F0ZSB3aGV0aGVyIHRvIHVzZSBjYWNoZWQgbGFuZ3VhZ2UgdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IFVTRV9DQUNIRURfTEFORyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignVVNFX0NBQ0hFRF9MQU5HJyk7XG4vKipcbiAqIENhY2hlIG1lY2hhbmlzbSB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBDQUNIRV9NRUNIQU5JU00gPSBuZXcgSW5qZWN0aW9uVG9rZW48Q2FjaGVNZWNoYW5pc20+KCdDQUNIRV9NRUNIQU5JU00nKTtcbi8qKlxuICogQ2FjaGUgbmFtZVxuICovXG5leHBvcnQgY29uc3QgQ0FDSEVfTkFNRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdDQUNIRV9OQU1FJyk7XG5cbi8qKlxuICogVHlwZSBmb3IgZGVmYXVsdCBsYW5ndWFnZSBmdW5jdGlvblxuICogVXNlZCB0byBvdmVycmlkZSBiYXNpYyBiZWhhdmlvdXJcbiAqL1xuZXhwb3J0IHR5cGUgRGVmYXVsdExhbmd1YWdlRnVuY3Rpb24gPSAobGFuZ3VhZ2VzOiBzdHJpbmdbXSwgY2FjaGVkTGFuZz86IHN0cmluZywgYnJvd3Nlckxhbmc/OiBzdHJpbmcpID0+IHN0cmluZztcblxuLyoqXG4gKiBGdW5jdGlvbiBmb3IgY2FsY3VsYXRpbmcgZGVmYXVsdCBsYW5ndWFnZVxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQU5HX0ZVTkNUSU9OID0gbmV3IEluamVjdGlvblRva2VuPERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uPignREVGQVVMVF9MQU5HX0ZVTkNUSU9OJyk7XG5cbi8qKlxuICogQm9vbGVhbiB0byBpbmRpY2F0ZSB3aGV0aGVyIHByZWZpeCBzaG91bGQgYmUgc2V0IGZvciBzaW5nbGUgbGFuZ3VhZ2Ugc2NlbmFyaW9zXG4gKi9cbmV4cG9ydCBjb25zdCBBTFdBWVNfU0VUX1BSRUZJWCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignQUxXQVlTX1NFVF9QUkVGSVgnKTtcblxuLyoqXG4gKiBDb25maWcgaW50ZXJmYWNlIGZvciBMb2NhbGl6ZVJvdXRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvY2FsaXplUm91dGVyQ29uZmlnIHtcbiAgcGFyc2VyPzogUHJvdmlkZXI7XG4gIHVzZUNhY2hlZExhbmc/OiBib29sZWFuO1xuICBjYWNoZU1lY2hhbmlzbT86IENhY2hlTWVjaGFuaXNtO1xuICBjYWNoZU5hbWU/OiBzdHJpbmc7XG4gIGRlZmF1bHRMYW5nRnVuY3Rpb24/OiBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbjtcbiAgYWx3YXlzU2V0UHJlZml4PzogYm9vbGVhbjtcbn1cblxuY29uc3QgTE9DQUxJWkVfQ0FDSEVfTkFNRSA9ICdMT0NBTElaRV9ERUZBVUxUX0xBTkdVQUdFJztcblxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyU2V0dGluZ3MgaW1wbGVtZW50cyBMb2NhbGl6ZVJvdXRlckNvbmZpZyB7XG4gIC8qKlxuICAgKiBTZXR0aW5ncyBmb3IgbG9jYWxpemUgcm91dGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KFVTRV9DQUNIRURfTEFORykgcHVibGljIHVzZUNhY2hlZExhbmc6IGJvb2xlYW4gPSB0cnVlLFxuICAgIEBJbmplY3QoQUxXQVlTX1NFVF9QUkVGSVgpIHB1YmxpYyBhbHdheXNTZXRQcmVmaXg6IGJvb2xlYW4gPSB0cnVlLFxuICAgIEBJbmplY3QoQ0FDSEVfTUVDSEFOSVNNKSBwdWJsaWMgY2FjaGVNZWNoYW5pc206IENhY2hlTWVjaGFuaXNtID0gQ2FjaGVNZWNoYW5pc20uTG9jYWxTdG9yYWdlLFxuICAgIEBJbmplY3QoQ0FDSEVfTkFNRSkgcHVibGljIGNhY2hlTmFtZTogc3RyaW5nID0gTE9DQUxJWkVfQ0FDSEVfTkFNRSxcbiAgICBASW5qZWN0KERFRkFVTFRfTEFOR19GVU5DVElPTikgcHVibGljIGRlZmF1bHRMYW5nRnVuY3Rpb246IERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uID0gdm9pZCAwXG4gICkge1xuICB9XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXMsIFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDYWNoZU1lY2hhbmlzbSwgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLmNvbmZpZyc7XG5pbXBvcnQgeyBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuY29uc3QgQ09PS0lFX0VYUElSWSA9IDMwOyAvLyAxIG1vbnRoXG5cbi8qKlxuICogQWJzdHJhY3QgY2xhc3MgZm9yIHBhcnNpbmcgbG9jYWxpemF0aW9uXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMb2NhbGl6ZVBhcnNlciB7XG4gIGxvY2FsZXM6IEFycmF5PHN0cmluZz47XG4gIGN1cnJlbnRMYW5nOiBzdHJpbmc7XG4gIHJvdXRlczogUm91dGVzO1xuICBkZWZhdWx0TGFuZzogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBwcmVmaXg6IHN0cmluZztcblxuICBwcml2YXRlIF90cmFuc2xhdGlvbk9iamVjdDogYW55O1xuICBwcml2YXRlIF93aWxkY2FyZFJvdXRlOiBSb3V0ZTtcbiAgcHJpdmF0ZSBfbGFuZ3VhZ2VSb3V0ZTogUm91dGU7XG5cbiAgLyoqXG4gICAqIExvYWRlciBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoQEluamVjdChUcmFuc2xhdGVTZXJ2aWNlKSBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcbiAgICBASW5qZWN0KExvY2F0aW9uKSBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbixcbiAgICBASW5qZWN0KExvY2FsaXplUm91dGVyU2V0dGluZ3MpIHByaXZhdGUgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIHJvdXRlcyBhbmQgZmV0Y2ggbmVjZXNzYXJ5IGRhdGFcbiAgICovXG4gIGFic3RyYWN0IGxvYWQocm91dGVzOiBSb3V0ZXMpOiBQcm9taXNlPGFueT47XG5cbiAgLyoqXG4gKiBQcmVwYXJlIHJvdXRlcyB0byBiZSBmdWxseSB1c2FibGUgYnkgbmd4LXRyYW5zbGF0ZS1yb3V0ZXJcbiAqIEBwYXJhbSByb3V0ZXNcbiAqL1xuICAvKiBwcml2YXRlIGluaXRSb3V0ZXMocm91dGVzOiBSb3V0ZXMsIHByZWZpeCA9ICcnKSB7XG4gICAgcm91dGVzLmZvckVhY2gocm91dGUgPT4ge1xuICAgICAgaWYgKHJvdXRlLnBhdGggIT09ICcqKicpIHtcbiAgICAgICAgY29uc3Qgcm91dGVEYXRhOiBhbnkgPSByb3V0ZS5kYXRhID0gcm91dGUuZGF0YSB8fCB7fTtcbiAgICAgICAgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyID0ge307XG4gICAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlci5mdWxsUGF0aCA9IGAke3ByZWZpeH0vJHtyb3V0ZS5wYXRofWA7XG4gICAgICAgIGlmIChyb3V0ZS5jaGlsZHJlbiAmJiByb3V0ZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5pbml0Um91dGVzKHJvdXRlLmNoaWxkcmVuLCByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIuZnVsbFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gKi9cblxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGxhbmd1YWdlIGFuZCByb3V0ZXNcbiAgICovXG4gIHByb3RlY3RlZCBpbml0KHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+IHtcbiAgICBsZXQgc2VsZWN0ZWRMYW5ndWFnZTogc3RyaW5nO1xuXG4gICAgLy8gdGhpcy5pbml0Um91dGVzKHJvdXRlcyk7XG4gICAgdGhpcy5yb3V0ZXMgPSByb3V0ZXM7XG5cbiAgICBpZiAoIXRoaXMubG9jYWxlcyB8fCAhdGhpcy5sb2NhbGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICAvKiogZGV0ZWN0IGN1cnJlbnQgbGFuZ3VhZ2UgKi9cbiAgICBjb25zdCBsb2NhdGlvbkxhbmcgPSB0aGlzLmdldExvY2F0aW9uTGFuZygpO1xuICAgIGNvbnN0IGJyb3dzZXJMYW5nID0gdGhpcy5fZ2V0QnJvd3NlckxhbmcoKTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmRlZmF1bHRMYW5nRnVuY3Rpb24pIHtcbiAgICAgIHRoaXMuZGVmYXVsdExhbmcgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRMYW5nRnVuY3Rpb24odGhpcy5sb2NhbGVzLCB0aGlzLl9jYWNoZWRMYW5nLCBicm93c2VyTGFuZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVmYXVsdExhbmcgPSB0aGlzLl9jYWNoZWRMYW5nIHx8IGJyb3dzZXJMYW5nIHx8IHRoaXMubG9jYWxlc1swXTtcbiAgICB9XG4gICAgc2VsZWN0ZWRMYW5ndWFnZSA9IGxvY2F0aW9uTGFuZyB8fCB0aGlzLmRlZmF1bHRMYW5nO1xuICAgIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKHRoaXMuZGVmYXVsdExhbmcpO1xuXG4gICAgbGV0IGNoaWxkcmVuOiBSb3V0ZXMgPSBbXTtcbiAgICAvKiogaWYgc2V0IHByZWZpeCBpcyBlbmZvcmNlZCAqL1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgY29uc3QgYmFzZVJvdXRlID0geyBwYXRoOiAnJywgcmVkaXJlY3RUbzogdGhpcy5kZWZhdWx0TGFuZywgcGF0aE1hdGNoOiAnZnVsbCcgfTtcblxuICAgICAgLyoqIGV4dHJhY3QgcG90ZW50aWFsIHdpbGRjYXJkIHJvdXRlICovXG4gICAgICBjb25zdCB3aWxkY2FyZEluZGV4ID0gcm91dGVzLmZpbmRJbmRleCgocm91dGU6IFJvdXRlKSA9PiByb3V0ZS5wYXRoID09PSAnKionKTtcbiAgICAgIGlmICh3aWxkY2FyZEluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLl93aWxkY2FyZFJvdXRlID0gcm91dGVzLnNwbGljZSh3aWxkY2FyZEluZGV4LCAxKVswXTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuID0gdGhpcy5yb3V0ZXMuc3BsaWNlKDAsIHRoaXMucm91dGVzLmxlbmd0aCwgYmFzZVJvdXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGRyZW4gPSBbLi4udGhpcy5yb3V0ZXNdOyAvLyBzaGFsbG93IGNvcHkgb2Ygcm91dGVzXG4gICAgfVxuXG4gICAgLyoqIGV4Y2x1ZGUgY2VydGFpbiByb3V0ZXMgKi9cbiAgICBmb3IgKGxldCBpID0gY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChjaGlsZHJlbltpXS5kYXRhICYmIGNoaWxkcmVuW2ldLmRhdGFbJ3NraXBSb3V0ZUxvY2FsaXphdGlvbiddKSB7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgICAgIC8vIGFkZCBkaXJlY3RseSB0byByb3V0ZXNcbiAgICAgICAgICB0aGlzLnJvdXRlcy5wdXNoKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIGFwcGVuZCBjaGlsZHJlbiByb3V0ZXMgKi9cbiAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy5sb2NhbGVzLmxlbmd0aCA+IDEgfHwgdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgICAgdGhpcy5fbGFuZ3VhZ2VSb3V0ZSA9IHsgY2hpbGRyZW46IGNoaWxkcmVuIH07XG4gICAgICAgIHRoaXMucm91dGVzLnVuc2hpZnQodGhpcy5fbGFuZ3VhZ2VSb3V0ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIC4uLmFuZCBwb3RlbnRpYWwgd2lsZGNhcmQgcm91dGUgKi9cbiAgICBpZiAodGhpcy5fd2lsZGNhcmRSb3V0ZSAmJiB0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgdGhpcy5yb3V0ZXMucHVzaCh0aGlzLl93aWxkY2FyZFJvdXRlKTtcbiAgICB9XG5cbiAgICAvKiogdHJhbnNsYXRlIHJvdXRlcyAqL1xuICAgIGNvbnN0IHJlcyA9IHRoaXMudHJhbnNsYXRlUm91dGVzKHNlbGVjdGVkTGFuZ3VhZ2UpO1xuICAgIHJldHVybiByZXMudG9Qcm9taXNlKCk7XG4gIH1cblxuICBpbml0Q2hpbGRSb3V0ZXMocm91dGVzOiBSb3V0ZXMpIHtcbiAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUocm91dGVzKTtcbiAgICByZXR1cm4gcm91dGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSByb3V0ZXMgdG8gc2VsZWN0ZWQgbGFuZ3VhZ2VcbiAgICovXG4gIHRyYW5zbGF0ZVJvdXRlcyhsYW5ndWFnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8YW55Pigob2JzZXJ2ZXI6IE9ic2VydmVyPGFueT4pID0+IHtcbiAgICAgIHRoaXMuX2NhY2hlZExhbmcgPSBsYW5ndWFnZTtcbiAgICAgIGlmICh0aGlzLl9sYW5ndWFnZVJvdXRlKSB7XG4gICAgICAgIHRoaXMuX2xhbmd1YWdlUm91dGUucGF0aCA9IGxhbmd1YWdlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRyYW5zbGF0ZS51c2UobGFuZ3VhZ2UpLnN1YnNjcmliZSgodHJhbnNsYXRpb25zOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25PYmplY3QgPSB0cmFuc2xhdGlvbnM7XG4gICAgICAgIHRoaXMuY3VycmVudExhbmcgPSBsYW5ndWFnZTtcblxuICAgICAgICBpZiAodGhpcy5fbGFuZ3VhZ2VSb3V0ZSkge1xuICAgICAgICAgIGlmICh0aGlzLl9sYW5ndWFnZVJvdXRlKSB7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUodGhpcy5fbGFuZ3VhZ2VSb3V0ZS5jaGlsZHJlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIHdpbGRjYXJkIHJvdXRlXG4gICAgICAgICAgaWYgKHRoaXMuX3dpbGRjYXJkUm91dGUgJiYgdGhpcy5fd2lsZGNhcmRSb3V0ZS5yZWRpcmVjdFRvKSB7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVQcm9wZXJ0eSh0aGlzLl93aWxkY2FyZFJvdXRlLCAncmVkaXJlY3RUbycsIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUodGhpcy5yb3V0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh2b2lkIDApO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHRoZSByb3V0ZSBub2RlIGFuZCByZWN1cnNpdmVseSBjYWxsIGZvciBhbGwgaXQncyBjaGlsZHJlblxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhbnNsYXRlUm91dGVUcmVlKHJvdXRlczogUm91dGVzKTogdm9pZCB7XG4gICAgcm91dGVzLmZvckVhY2goKHJvdXRlOiBSb3V0ZSkgPT4ge1xuICAgICAgaWYgKHJvdXRlLnBhdGggJiYgcm91dGUucGF0aCAhPT0gJyoqJykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGVQcm9wZXJ0eShyb3V0ZSwgJ3BhdGgnKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3V0ZS5yZWRpcmVjdFRvKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVByb3BlcnR5KHJvdXRlLCAncmVkaXJlY3RUbycsICFyb3V0ZS5yZWRpcmVjdFRvLmluZGV4T2YoJy8nKSk7XG4gICAgICB9XG4gICAgICBpZiAocm91dGUuY2hpbGRyZW4pIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHJvdXRlLmNoaWxkcmVuKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3V0ZS5sb2FkQ2hpbGRyZW4gJiYgKDxhbnk+cm91dGUpLl9sb2FkZWRDb25maWcpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKCg8YW55PnJvdXRlKS5fbG9hZGVkQ29uZmlnLnJvdXRlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHByb3BlcnR5XG4gICAqIElmIGZpcnN0IHRpbWUgdHJhbnNsYXRpb24gdGhlbiBhZGQgb3JpZ2luYWwgdG8gcm91dGUgZGF0YSBvYmplY3RcbiAgICovXG4gIHByaXZhdGUgX3RyYW5zbGF0ZVByb3BlcnR5KHJvdXRlOiBSb3V0ZSwgcHJvcGVydHk6IHN0cmluZywgcHJlZml4TGFuZz86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAvLyBzZXQgcHJvcGVydHkgdG8gZGF0YSBpZiBub3QgdGhlcmUgeWV0XG4gICAgY29uc3Qgcm91dGVEYXRhOiBhbnkgPSByb3V0ZS5kYXRhID0gcm91dGUuZGF0YSB8fCB7fTtcbiAgICBpZiAoIXJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcikge1xuICAgICAgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyID0ge307XG4gICAgfVxuICAgIGlmICghcm91dGVEYXRhLmxvY2FsaXplUm91dGVyW3Byb3BlcnR5XSkge1xuICAgICAgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyW3Byb3BlcnR5XSA9ICg8YW55PnJvdXRlKVtwcm9wZXJ0eV07XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGVSb3V0ZShyb3V0ZURhdGEubG9jYWxpemVSb3V0ZXJbcHJvcGVydHldKTtcbiAgICAoPGFueT5yb3V0ZSlbcHJvcGVydHldID0gcHJlZml4TGFuZyA/IGAvJHt0aGlzLnVybFByZWZpeH0ke3Jlc3VsdH1gIDogcmVzdWx0O1xuICB9XG5cbiAgZ2V0IHVybFByZWZpeCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXggfHwgdGhpcy5jdXJyZW50TGFuZyAhPT0gdGhpcy5kZWZhdWx0TGFuZyA/IHRoaXMuY3VycmVudExhbmcgOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcm91dGUgYW5kIHJldHVybiBvYnNlcnZhYmxlXG4gICAqL1xuICB0cmFuc2xhdGVSb3V0ZShwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHF1ZXJ5UGFydHMgPSBwYXRoLnNwbGl0KCc/Jyk7XG4gICAgaWYgKHF1ZXJ5UGFydHMubGVuZ3RoID4gMikge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RoZXJlIHNob3VsZCBiZSBvbmx5IG9uZSBxdWVyeSBwYXJhbWV0ZXIgYmxvY2sgaW4gdGhlIFVSTCcpO1xuICAgIH1cbiAgICBjb25zdCBwYXRoU2VnbWVudHMgPSBxdWVyeVBhcnRzWzBdLnNwbGl0KCcvJyk7XG5cbiAgICAvKiogY29sbGVjdCBvYnNlcnZhYmxlcyAgKi9cbiAgICByZXR1cm4gcGF0aFNlZ21lbnRzXG4gICAgICAubWFwKChwYXJ0OiBzdHJpbmcpID0+IHBhcnQubGVuZ3RoID8gdGhpcy50cmFuc2xhdGVUZXh0KHBhcnQpIDogcGFydClcbiAgICAgIC5qb2luKCcvJykgK1xuICAgICAgKHF1ZXJ5UGFydHMubGVuZ3RoID4gMSA/IGA/JHtxdWVyeVBhcnRzWzFdfWAgOiAnJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGxhbmd1YWdlIGZyb20gdXJsXG4gICAqL1xuICBnZXRMb2NhdGlvbkxhbmcodXJsPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBxdWVyeVBhcmFtU3BsaXQgPSAodXJsIHx8IHRoaXMubG9jYXRpb24ucGF0aCgpKS5zcGxpdCgnPycpO1xuICAgIGxldCBwYXRoU2xpY2VzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmIChxdWVyeVBhcmFtU3BsaXQubGVuZ3RoID4gMCkge1xuICAgICAgcGF0aFNsaWNlcyA9IHF1ZXJ5UGFyYW1TcGxpdFswXS5zcGxpdCgnLycpO1xuICAgIH1cbiAgICBpZiAocGF0aFNsaWNlcy5sZW5ndGggPiAxICYmIHRoaXMubG9jYWxlcy5pbmRleE9mKHBhdGhTbGljZXNbMV0pICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHBhdGhTbGljZXNbMV07XG4gICAgfVxuICAgIGlmIChwYXRoU2xpY2VzLmxlbmd0aCAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZihwYXRoU2xpY2VzWzBdKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBwYXRoU2xpY2VzWzBdO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdXNlcidzIGxhbmd1YWdlIHNldCBpbiB0aGUgYnJvd3NlclxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0QnJvd3NlckxhbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcmV0dXJuSWZJbkxvY2FsZXModGhpcy50cmFuc2xhdGUuZ2V0QnJvd3NlckxhbmcoKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGxhbmd1YWdlIGZyb20gbG9jYWwgc3RvcmFnZSBvciBjb29raWVcbiAgICovXG4gIHByaXZhdGUgZ2V0IF9jYWNoZWRMYW5nKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLnVzZUNhY2hlZExhbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkxvY2FsU3RvcmFnZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlV2l0aExvY2FsU3RvcmFnZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWNoZU1lY2hhbmlzbSA9PT0gQ2FjaGVNZWNoYW5pc20uQ29va2llKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVXaXRoQ29va2llcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIGxhbmd1YWdlIHRvIGxvY2FsIHN0b3JhZ2Ugb3IgY29va2llXG4gICAqL1xuICBwcml2YXRlIHNldCBfY2FjaGVkTGFuZyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLnVzZUNhY2hlZExhbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkxvY2FsU3RvcmFnZSkge1xuICAgICAgdGhpcy5fY2FjaGVXaXRoTG9jYWxTdG9yYWdlKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkNvb2tpZSkge1xuICAgICAgdGhpcy5fY2FjaGVXaXRoQ29va2llcyh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlIHZhbHVlIHRvIGxvY2FsIHN0b3JhZ2VcbiAgICovXG4gIHByaXZhdGUgX2NhY2hlV2l0aExvY2FsU3RvcmFnZSh2YWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSwgdmFsdWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fcmV0dXJuSWZJbkxvY2FsZXMod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc2V0dGluZ3MuY2FjaGVOYW1lKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gd2VpcmQgU2FmYXJpIGlzc3VlIGluIHByaXZhdGUgbW9kZSwgd2hlcmUgTG9jYWxTdG9yYWdlIGlzIGRlZmluZWQgYnV0IHRocm93cyBlcnJvciBvbiBhY2Nlc3NcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FjaGUgdmFsdWUgdmlhIGNvb2tpZXNcbiAgICovXG4gIHByaXZhdGUgX2NhY2hlV2l0aENvb2tpZXModmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBkb2N1bWVudC5jb29raWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBuYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuc2V0dGluZ3MuY2FjaGVOYW1lKTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBjb25zdCBkOiBEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgQ09PS0lFX0VYUElSWSAqIDg2NDAwMDAwKTsgLy8gKiBkYXlzXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke25hbWV9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKX07ZXhwaXJlcz0ke2QudG9VVENTdHJpbmcoKX1gO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKCcoPzpeJyArIG5hbWUgKyAnfDtcXFxccyonICsgbmFtZSArICcpPSguKj8pKD86O3wkKScsICdnJyk7XG4gICAgICBjb25zdCByZXN1bHQgPSByZWdleHAuZXhlYyhkb2N1bWVudC5jb29raWUpO1xuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRbMV0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybjsgLy8gc2hvdWxkIG5vdCBoYXBwZW4gYnV0IGJldHRlciBzYWZlIHRoYW4gc29ycnlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdmFsdWUgZXhpc3RzIGluIGxvY2FsZXMgbGlzdFxuICAgKi9cbiAgcHJpdmF0ZSBfcmV0dXJuSWZJbkxvY2FsZXModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHZhbHVlICYmIHRoaXMubG9jYWxlcy5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRyYW5zbGF0ZWQgdmFsdWVcbiAgICovXG4gIHByaXZhdGUgdHJhbnNsYXRlVGV4dChrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLl90cmFuc2xhdGlvbk9iamVjdCkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgY29uc3QgZnVsbEtleSA9IHRoaXMucHJlZml4ICsga2V5O1xuICAgIGNvbnN0IHJlcyA9IHRoaXMudHJhbnNsYXRlLmdldFBhcnNlZFJlc3VsdCh0aGlzLl90cmFuc2xhdGlvbk9iamVjdCwgZnVsbEtleSk7XG4gICAgcmV0dXJuIHJlcyAhPT0gZnVsbEtleSA/IHJlcyA6IGtleTtcbiAgfVxufVxuXG4vKipcbiAqIE1hbnVhbGx5IHNldCBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBNYW51YWxQYXJzZXJMb2FkZXIgZXh0ZW5kcyBMb2NhbGl6ZVBhcnNlciB7XG5cbiAgLyoqXG4gICAqIENUT1JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSwgbG9jYXRpb246IExvY2F0aW9uLCBzZXR0aW5nczogTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcbiAgICBsb2NhbGVzOiBzdHJpbmdbXSA9IFsnZW4nXSwgcHJlZml4OiBzdHJpbmcgPSAnUk9VVEVTLicpIHtcbiAgICBzdXBlcih0cmFuc2xhdGUsIGxvY2F0aW9uLCBzZXR0aW5ncyk7XG4gICAgdGhpcy5sb2NhbGVzID0gbG9jYWxlcztcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCB8fCAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIG9yIGFwcGVuZCByb3V0ZXNcbiAgICovXG4gIGxvYWQocm91dGVzOiBSb3V0ZXMpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55KSA9PiB7XG4gICAgICB0aGlzLmluaXQocm91dGVzKS50aGVuKHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEdW1teUxvY2FsaXplUGFyc2VyIGV4dGVuZHMgTG9jYWxpemVQYXJzZXIge1xuICBsb2FkKHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5pbml0KHJvdXRlcykudGhlbihyZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25TdGFydCwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgTmF2aWdhdGlvbkV4dHJhcywgVXJsU2VnbWVudCwgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBwYWlyd2lzZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTG9jYWxpemVQYXJzZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5wYXJzZXInO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLmNvbmZpZyc7XG5cbi8qKlxuICogTG9jYWxpemF0aW9uIHNlcnZpY2VcbiAqIG1vZGlmeVJvdXRlc1xuICovXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlIHtcbiAgcm91dGVyRXZlbnRzOiBTdWJqZWN0PHN0cmluZz47XG5cbiAgLyoqXG4gICAqIENUT1JcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQEluamVjdChMb2NhbGl6ZVBhcnNlcikgcHVibGljIHBhcnNlcjogTG9jYWxpemVQYXJzZXIsXG4gICAgICBASW5qZWN0KExvY2FsaXplUm91dGVyU2V0dGluZ3MpIHB1YmxpYyBzZXR0aW5nczogTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcbiAgICAgIEBJbmplY3QoUm91dGVyKSBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgQEluamVjdChBY3RpdmF0ZWRSb3V0ZSkgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGVcbiAgICApIHtcbiAgICAgIHRoaXMucm91dGVyRXZlbnRzID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHVwIHRoZSBzZXJ2aWNlXG4gICAqL1xuICBpbml0KCk6IHZvaWQge1xuICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKHRoaXMucGFyc2VyLnJvdXRlcyk7XG4gICAgLy8gc3Vic2NyaWJlIHRvIHJvdXRlciBldmVudHNcbiAgICB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpLFxuICAgICAgICBwYWlyd2lzZSgpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKHRoaXMuX3JvdXRlQ2hhbmdlZCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgbGFuZ3VhZ2UgYW5kIG5hdmlnYXRlIHRvIHRyYW5zbGF0ZWQgcm91dGVcbiAgICovXG4gIGNoYW5nZUxhbmd1YWdlKGxhbmc6IHN0cmluZywgZXh0cmFzPzogTmF2aWdhdGlvbkV4dHJhcywgdXNlTmF2aWdhdGVNZXRob2Q/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucm91dGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMucm91dGUpO1xuICAgIH1cbiAgICBpZiAobGFuZyAhPT0gdGhpcy5wYXJzZXIuY3VycmVudExhbmcpIHtcbiAgICAgIGNvbnN0IHJvb3RTbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCA9IHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90LnJvb3Q7XG5cbiAgICAgIHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlcyhsYW5nKS5zdWJzY3JpYmUoKCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHF1ZXJ5UGFyYW1zID0gcm9vdFNuYXBzaG90LnF1ZXJ5UGFyYW1zO1xuICAgICAgICBsZXQgdXJsID0gJyc7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhxdWVyeVBhcmFtcykubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgY29uc3QgcXVlcnlTdHJpbmcgPSBPYmplY3Qua2V5cyhxdWVyeVBhcmFtcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXkgKyAnPScgKyBxdWVyeVBhcmFtc1trZXldXG4gICAgICAgICAgfSkuam9pbignJicpO1xuICAgICAgICAgIHVybCA9IHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHJvb3RTbmFwc2hvdCkgKyAnPycgKyBxdWVyeVN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmwgPSB0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChyb290U25hcHNob3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgICAgIGxldCB1cmxTZWdtZW50cyA9IHVybC5zcGxpdCgnLycpO1xuICAgICAgICAgIGNvbnN0IGxhbmd1YWdlU2VnbWVudEluZGV4ID0gdXJsU2VnbWVudHMuaW5kZXhPZih0aGlzLnBhcnNlci5jdXJyZW50TGFuZyk7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UgaGFzIG5vIHByZWZpeCBtYWtlIHN1cmUgdG8gcmVtb3ZlIGFuZCBhZGQgaXQgd2hlbiBuZWNlc3NhcnlcbiAgICAgICAgICBpZiAodGhpcy5wYXJzZXIuY3VycmVudExhbmcgPT09IHRoaXMucGFyc2VyLmRlZmF1bHRMYW5nKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGxhbmd1YWdlIHByZWZpeCBmcm9tIHVybCB3aGVuIGN1cnJlbnQgbGFuZ3VhZ2UgaXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2VcbiAgICAgICAgICAgIGlmIChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gMCB8fCAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IDEgJiYgdXJsU2VnbWVudHNbMF0gPT09ICcnKSkge1xuICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGN1cnJlbnQgYWthIGRlZmF1bHQgbGFuZ3VhZ2UgcHJlZml4IGZyb20gdGhlIHVybFxuICAgICAgICAgICAgICB1cmxTZWdtZW50cyA9IHVybFNlZ21lbnRzLnNsaWNlKDAsIGxhbmd1YWdlU2VnbWVudEluZGV4KS5jb25jYXQodXJsU2VnbWVudHMuc2xpY2UobGFuZ3VhZ2VTZWdtZW50SW5kZXggKyAxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdoZW4gY29taW5nIGZyb20gYSBkZWZhdWx0IGxhbmd1YWdlIGl0J3MgcG9zc2libGUgdGhhdCB0aGUgdXJsIGRvZXNuJ3QgY29udGFpbiB0aGUgbGFuZ3VhZ2UsIG1ha2Ugc3VyZSBpdCBkb2VzLlxuICAgICAgICAgICAgaWYgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAvLyBJZiB0aGUgdXJsIHN0YXJ0cyB3aXRoIGEgc2xhc2ggbWFrZSBzdXJlIHRvIGtlZXAgaXQuXG4gICAgICAgICAgICAgIGNvbnN0IGluamVjdGlvbkluZGV4ID0gdXJsU2VnbWVudHNbMF0gPT09ICcnID8gMSA6IDA7XG4gICAgICAgICAgICAgIHVybFNlZ21lbnRzID0gdXJsU2VnbWVudHMuc2xpY2UoMCwgaW5qZWN0aW9uSW5kZXgpLmNvbmNhdCh0aGlzLnBhcnNlci5jdXJyZW50TGFuZywgdXJsU2VnbWVudHMuc2xpY2UoaW5qZWN0aW9uSW5kZXgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdXJsID0gdXJsU2VnbWVudHMuam9pbignLycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIucmVzZXRDb25maWcodGhpcy5wYXJzZXIucm91dGVzKTtcbiAgICAgICAgaWYgKHVzZU5hdmlnYXRlTWV0aG9kKSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3VybF0sIGV4dHJhcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybCh1cmwsIGV4dHJhcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmF2ZXJzZXMgdGhyb3VnaCB0aGUgdHJlZSB0byBhc3NlbWJsZSBuZXcgdHJhbnNsYXRlZCB1cmxcbiAgICovXG4gIHByaXZhdGUgdHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogc3RyaW5nIHtcblxuICAgIGlmIChzbmFwc2hvdC5maXJzdENoaWxkICYmIHNuYXBzaG90LnJvdXRlQ29uZmlnKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCl9LyR7dGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3QuZmlyc3RDaGlsZCl9YDtcbiAgICB9IGVsc2UgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpO1xuICAgIH1cblxuICAgIC8qIGlmIChzbmFwc2hvdC5maXJzdENoaWxkICYmIHNuYXBzaG90LmZpcnN0Q2hpbGQucm91dGVDb25maWcgJiYgc25hcHNob3QuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZy5wYXRoKSB7XG4gICAgICBpZiAoc25hcHNob3QuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZy5wYXRoICE9PSAnKionKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KSArICcvJyArIHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QuZmlyc3RDaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KTsgKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0cyBuZXcgc2VnbWVudCB2YWx1ZSBiYXNlZCBvbiByb3V0ZUNvbmZpZyBhbmQgdXJsXG4gICAqL1xuICBwcml2YXRlIHBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogc3RyaW5nIHtcbiAgICBpZiAoc25hcHNob3QuZGF0YS5sb2NhbGl6ZVJvdXRlcikge1xuICAgICAgY29uc3QgcGF0aCA9IHNuYXBzaG90LmRhdGEubG9jYWxpemVSb3V0ZXIucGF0aDtcbiAgICAgIGNvbnN0IHN1YlBhdGhTZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICAgIHJldHVybiBzdWJQYXRoU2VnbWVudHMubWFwKChzOiBzdHJpbmcsIGk6IG51bWJlcikgPT4gcy5pbmRleE9mKCc6JykgPT09IDAgPyBzbmFwc2hvdC51cmxbaV0ucGF0aCA6IHMpLmpvaW4oJy8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICAvKiBpZiAoc25hcHNob3Qucm91dGVDb25maWcpIHtcbiAgICAgIGlmIChzbmFwc2hvdC5yb3V0ZUNvbmZpZy5wYXRoID09PSAnKionKSB7XG4gICAgICAgIHJldHVybiBzbmFwc2hvdC51cmwuZmlsdGVyKChzZWdtZW50OiBVcmxTZWdtZW50KSA9PiBzZWdtZW50LnBhdGgpLm1hcCgoc2VnbWVudDogVXJsU2VnbWVudCkgPT4gc2VnbWVudC5wYXRoKS5qb2luKCcvJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdWJQYXRoU2VnbWVudHMgPSBzbmFwc2hvdC5yb3V0ZUNvbmZpZy5wYXRoLnNwbGl0KCcvJyk7XG4gICAgICAgIHJldHVybiBzdWJQYXRoU2VnbWVudHMubWFwKChzOiBzdHJpbmcsIGk6IG51bWJlcikgPT4gcy5pbmRleE9mKCc6JykgPT09IDAgPyBzbmFwc2hvdC51cmxbaV0ucGF0aCA6IHMpLmpvaW4oJy8nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICcnOyAqL1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSByb3V0ZSB0byBjdXJyZW50IGxhbmd1YWdlXG4gICAqIElmIG5ldyBsYW5ndWFnZSBpcyBleHBsaWNpdGx5IHByb3ZpZGVkIHRoZW4gcmVwbGFjZSBsYW5ndWFnZSBwYXJ0IGluIHVybCB3aXRoIG5ldyBsYW5ndWFnZVxuICAgKi9cbiAgdHJhbnNsYXRlUm91dGUocGF0aDogc3RyaW5nIHwgYW55W10pOiBzdHJpbmcgfCBhbnlbXSB7XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgdXJsID0gdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGUocGF0aCk7XG4gICAgICByZXR1cm4gIXBhdGguaW5kZXhPZignLycpID8gYC8ke3RoaXMucGFyc2VyLnVybFByZWZpeH0ke3VybH1gIDogdXJsO1xuICAgIH1cbiAgICAvLyBpdCdzIGFuIGFycmF5XG4gICAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xuICAgIChwYXRoIGFzIEFycmF5PGFueT4pLmZvckVhY2goKHNlZ21lbnQ6IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBzZWdtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZShzZWdtZW50KTtcbiAgICAgICAgaWYgKCFpbmRleCAmJiAhc2VnbWVudC5pbmRleE9mKCcvJykpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChgLyR7dGhpcy5wYXJzZXIudXJsUHJlZml4fSR7cmVzfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciB0byByZWFjdCBvbiByb3V0ZSBjaGFuZ2VcbiAgICovXG4gIHByaXZhdGUgX3JvdXRlQ2hhbmdlZCgpOiAoZXZlbnRQYWlyOiBbTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uU3RhcnRdKSA9PiB2b2lkIHtcbiAgICByZXR1cm4gKFtwcmV2aW91c0V2ZW50LCBjdXJyZW50RXZlbnRdOiBbTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uU3RhcnRdKSA9PiB7XG4gICAgICBjb25zdCBwcmV2aW91c0xhbmcgPSB0aGlzLnBhcnNlci5nZXRMb2NhdGlvbkxhbmcocHJldmlvdXNFdmVudC51cmwpIHx8IHRoaXMucGFyc2VyLmRlZmF1bHRMYW5nO1xuICAgICAgY29uc3QgY3VycmVudExhbmcgPSB0aGlzLnBhcnNlci5nZXRMb2NhdGlvbkxhbmcoY3VycmVudEV2ZW50LnVybCkgfHwgdGhpcy5wYXJzZXIuZGVmYXVsdExhbmc7XG5cbiAgICAgIGlmIChjdXJyZW50TGFuZyAhPT0gcHJldmlvdXNMYW5nKSB7XG4gICAgICAgIHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlcyhjdXJyZW50TGFuZykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgICAgICAgIC8vIEZpcmUgcm91dGUgY2hhbmdlIGV2ZW50XG4gICAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMubmV4dChjdXJyZW50TGFuZyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cbiIsIi8qKlxuICogQ29tcGFyZSBpZiB0d28gb2JqZWN0cyBhcmUgc2FtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXF1YWxzKG8xOiBhbnksIG8yOiBhbnkpOiBib29sZWFuIHtcbiAgaWYgKG8xID09PSBvMikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChvMSA9PT0gbnVsbCB8fCBvMiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAobzEgIT09IG8xICYmIG8yICE9PSBvMikge1xuICAgIHJldHVybiB0cnVlOyAvLyBOYU4gPT09IE5hTlxuICB9XG4gIGNvbnN0IHQxID0gdHlwZW9mIG8xLFxuICAgIHQyID0gdHlwZW9mIG8yO1xuICBsZXQgbGVuZ3RoOiBudW1iZXIsXG4gICAga2V5OiBhbnksXG4gICAga2V5U2V0OiBhbnk7XG5cbiAgaWYgKHQxID09PSB0MiAmJiB0MSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvMSkpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShvMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKChsZW5ndGggPSBvMS5sZW5ndGgpID09PSBvMi5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG4gICAgICAgICAgaWYgKCFlcXVhbHMobzFba2V5XSwgbzJba2V5XSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG8yKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBrZXlTZXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgZm9yIChrZXkgaW4gbzEpIHtcbiAgICAgICAgaWYgKG8xLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAoIWVxdWFscyhvMVtrZXldLCBvMltrZXldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBrZXlTZXRba2V5XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoa2V5IGluIG8yKSB7XG4gICAgICAgIGlmIChvMi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKCEoa2V5IGluIGtleVNldCkgJiYgdHlwZW9mIG8yW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiaW1wb3J0IHsgUGlwZVRyYW5zZm9ybSwgUGlwZSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGVxdWFscyB9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IFZJRVdfREVTVFJPWUVEX1NUQVRFID0gMTI4O1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdsb2NhbGl6ZScsXG4gIHB1cmU6IGZhbHNlIC8vIHJlcXVpcmVkIHRvIHVwZGF0ZSB0aGUgdmFsdWUgd2hlbiB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZFxufSlcbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlclBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHZhbHVlOiBzdHJpbmcgfCBhbnlbXSA9ICcnO1xuICBwcml2YXRlIGxhc3RLZXk6IHN0cmluZyB8IGFueVtdO1xuICBwcml2YXRlIGxhc3RMYW5ndWFnZTogc3RyaW5nO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvY2FsaXplOiBMb2NhbGl6ZVJvdXRlclNlcnZpY2UsIHByaXZhdGUgX3JlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMubG9jYWxpemUucm91dGVyRXZlbnRzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnRyYW5zZm9ybSh0aGlzLmxhc3RLZXkpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm0gY3VycmVudCB1cmwgdG8gbG9jYWxpemVkIG9uZVxuICAgKi9cbiAgdHJhbnNmb3JtKHF1ZXJ5OiBzdHJpbmcgfCBhbnlbXSk6IHN0cmluZyB8IGFueVtdIHtcbiAgICBpZiAoIXF1ZXJ5IHx8IHF1ZXJ5Lmxlbmd0aCA9PT0gMCB8fCAhdGhpcy5sb2NhbGl6ZS5wYXJzZXIuY3VycmVudExhbmcpIHtcbiAgICAgIHJldHVybiBxdWVyeTtcbiAgICB9XG4gICAgaWYgKGVxdWFscyhxdWVyeSwgdGhpcy5sYXN0S2V5KSAmJiBlcXVhbHModGhpcy5sYXN0TGFuZ3VhZ2UsIHRoaXMubG9jYWxpemUucGFyc2VyLmN1cnJlbnRMYW5nKSkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfVxuICAgIHRoaXMubGFzdEtleSA9IHF1ZXJ5O1xuICAgIHRoaXMubGFzdExhbmd1YWdlID0gdGhpcy5sb2NhbGl6ZS5wYXJzZXIuY3VycmVudExhbmc7XG5cbiAgICAvKiogdHJhbnNsYXRlIGtleSBhbmQgdXBkYXRlIHZhbHVlcyAqL1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLmxvY2FsaXplLnRyYW5zbGF0ZVJvdXRlKHF1ZXJ5KTtcbiAgICB0aGlzLmxhc3RLZXkgPSBxdWVyeTtcbiAgICAvLyBpZiB2aWV3IGlzIGFscmVhZHkgZGVzdHJveWVkLCBpZ25vcmUgZmlyaW5nIGNoYW5nZSBkZXRlY3Rpb25cbiAgICBpZiAoKDxhbnk+IHRoaXMuX3JlZikuX3ZpZXcuc3RhdGUgJiBWSUVXX0RFU1RST1lFRF9TVEFURSkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfVxuICAgIHRoaXMuX3JlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cbn1cbiIsImltcG9ydCB7IFJPVVRFUyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1xuICBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyLCBOZ01vZHVsZUZhY3RvcnksIEluamVjdG9yLFxuICBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyQ29uZmlnLCBPcHRpb25hbCwgQ29tcGlsZXIsIEluamVjdGFibGUsIEluamVjdCwgZm9yd2FyZFJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcblxuLyoqXG4gKiBFeHRlbnNpb24gb2YgU3lzdGVtSnNOZ01vZHVsZUxvYWRlciB0byBlbmFibGUgbG9jYWxpemF0aW9uIG9mIHJvdXRlIG9uIGxhenkgbG9hZFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJDb25maWdMb2FkZXIgZXh0ZW5kcyBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyIHtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTG9jYWxpemVQYXJzZXIpKSBwcml2YXRlIGxvY2FsaXplOiBMb2NhbGl6ZVBhcnNlcixcbiAgICBfY29tcGlsZXI6IENvbXBpbGVyLCBAT3B0aW9uYWwoKSBjb25maWc/OiBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyQ29uZmlnKSB7XG4gICAgICBzdXBlcihfY29tcGlsZXIsIGNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogRXh0ZW5kIGxvYWQgd2l0aCBjdXN0b20gZnVuY3Rpb25hbGl0eVxuICAgKi9cbiAgbG9hZChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPE5nTW9kdWxlRmFjdG9yeTxhbnk+PiB7XG4gICAgcmV0dXJuIHN1cGVyLmxvYWQocGF0aCkudGhlbigoZmFjdG9yeTogTmdNb2R1bGVGYWN0b3J5PGFueT4pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1vZHVsZVR5cGU6IGZhY3RvcnkubW9kdWxlVHlwZSxcbiAgICAgICAgY3JlYXRlOiAocGFyZW50SW5qZWN0b3I6IEluamVjdG9yKSA9PiB7XG4gICAgICAgICAgY29uc3QgbW9kdWxlID0gZmFjdG9yeS5jcmVhdGUocGFyZW50SW5qZWN0b3IpO1xuICAgICAgICAgIGNvbnN0IGdldE1ldGhvZCA9IG1vZHVsZS5pbmplY3Rvci5nZXQuYmluZChtb2R1bGUuaW5qZWN0b3IpO1xuXG4gICAgICAgICAgbW9kdWxlLmluamVjdG9yWydnZXQnXSA9ICh0b2tlbjogYW55LCBub3RGb3VuZFZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGdldFJlc3VsdCA9IGdldE1ldGhvZCh0b2tlbiwgbm90Rm91bmRWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gUk9VVEVTKSB7XG4gICAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSBsYXp5IHJvdXRlc1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGl6ZS5pbml0Q2hpbGRSb3V0ZXMoW10uY29uY2F0KC4uLmdldFJlc3VsdCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGdldFJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBBUFBfSU5JVElBTElaRVIsIE9wdGlvbmFsLCBTa2lwU2VsZixcbiAgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIE5nTW9kdWxlRmFjdG9yeUxvYWRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2VydmljZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRHVtbXlMb2NhbGl6ZVBhcnNlciwgTG9jYWxpemVQYXJzZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5wYXJzZXInO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlLCBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJQaXBlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGlwZSc7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBTFdBWVNfU0VUX1BSRUZJWCxcbiAgQ0FDSEVfTUVDSEFOSVNNLCBDQUNIRV9OQU1FLCBERUZBVUxUX0xBTkdfRlVOQ1RJT04sIExPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJELCBMb2NhbGl6ZVJvdXRlckNvbmZpZywgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcbiAgUkFXX1JPVVRFUyxcbiAgVVNFX0NBQ0hFRF9MQU5HXG59IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLmNvbmZpZyc7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlckNvbmZpZ0xvYWRlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLWNvbmZpZy1sb2FkZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGFyc2VySW5pdGlhbGl6ZXIge1xuICBwYXJzZXI6IExvY2FsaXplUGFyc2VyO1xuICByb3V0ZXM6IFJvdXRlcztcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgfVxuXG4gIGFwcEluaXRpYWxpemVyKCk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcmVzID0gdGhpcy5wYXJzZXIubG9hZCh0aGlzLnJvdXRlcyk7XG4gICAgcmVzLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgbG9jYWxpemU6IExvY2FsaXplUm91dGVyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KExvY2FsaXplUm91dGVyU2VydmljZSk7XG4gICAgICBsb2NhbGl6ZS5pbml0KCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgZ2VuZXJhdGVJbml0aWFsaXplcihwYXJzZXI6IExvY2FsaXplUGFyc2VyLCByb3V0ZXM6IFJvdXRlc1tdKTogKCkgPT4gUHJvbWlzZTxhbnk+IHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlcjtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcy5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpKTtcbiAgICByZXR1cm4gdGhpcy5hcHBJbml0aWFsaXplcjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwSW5pdGlhbGl6ZXIocDogUGFyc2VySW5pdGlhbGl6ZXIsIHBhcnNlcjogTG9jYWxpemVQYXJzZXIsIHJvdXRlczogUm91dGVzW10pOiBhbnkge1xuICByZXR1cm4gcC5nZW5lcmF0ZUluaXRpYWxpemVyKHBhcnNlciwgcm91dGVzKS5iaW5kKHApO1xufVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFRyYW5zbGF0ZU1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0xvY2FsaXplUm91dGVyUGlwZV0sXG4gIGV4cG9ydHM6IFtMb2NhbGl6ZVJvdXRlclBpcGVdXG59KVxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyTW9kdWxlIHtcblxuICBzdGF0aWMgZm9yUm9vdChyb3V0ZXM6IFJvdXRlcywgY29uZmlnOiBMb2NhbGl6ZVJvdXRlckNvbmZpZyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQsXG4gICAgICAgICAgdXNlRmFjdG9yeTogcHJvdmlkZUZvclJvb3RHdWFyZCxcbiAgICAgICAgICBkZXBzOiBbW0xvY2FsaXplUm91dGVyTW9kdWxlLCBuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCldXVxuICAgICAgICB9LFxuICAgICAgICB7IHByb3ZpZGU6IFVTRV9DQUNIRURfTEFORywgdXNlVmFsdWU6IGNvbmZpZy51c2VDYWNoZWRMYW5nIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQUxXQVlTX1NFVF9QUkVGSVgsIHVzZVZhbHVlOiBjb25maWcuYWx3YXlzU2V0UHJlZml4IH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ0FDSEVfTkFNRSwgdXNlVmFsdWU6IGNvbmZpZy5jYWNoZU5hbWUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDQUNIRV9NRUNIQU5JU00sIHVzZVZhbHVlOiBjb25maWcuY2FjaGVNZWNoYW5pc20gfSxcbiAgICAgICAgeyBwcm92aWRlOiBERUZBVUxUX0xBTkdfRlVOQ1RJT04sIHVzZVZhbHVlOiBjb25maWcuZGVmYXVsdExhbmdGdW5jdGlvbiB9LFxuICAgICAgICBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICAgICAgICBjb25maWcucGFyc2VyIHx8IHsgcHJvdmlkZTogTG9jYWxpemVQYXJzZXIsIHVzZUNsYXNzOiBEdW1teUxvY2FsaXplUGFyc2VyIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSQVdfUk9VVEVTLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiByb3V0ZXNcbiAgICAgICAgfSxcbiAgICAgICAgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlLFxuICAgICAgICBQYXJzZXJJbml0aWFsaXplcixcbiAgICAgICAgeyBwcm92aWRlOiBOZ01vZHVsZUZhY3RvcnlMb2FkZXIsIHVzZUNsYXNzOiBMb2NhbGl6ZVJvdXRlckNvbmZpZ0xvYWRlciB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGdldEFwcEluaXRpYWxpemVyLFxuICAgICAgICAgIGRlcHM6IFtQYXJzZXJJbml0aWFsaXplciwgTG9jYWxpemVQYXJzZXIsIFJBV19ST1VURVNdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZvckNoaWxkKHJvdXRlczogUm91dGVzKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUkFXX1JPVVRFUyxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogcm91dGVzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlRm9yUm9vdEd1YXJkKGxvY2FsaXplUm91dGVyTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSk6IHN0cmluZyB7XG4gIGlmIChsb2NhbGl6ZVJvdXRlck1vZHVsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBMb2NhbGl6ZVJvdXRlck1vZHVsZS5mb3JSb290KCkgY2FsbGVkIHR3aWNlLiBMYXp5IGxvYWRlZCBtb2R1bGVzIHNob3VsZCB1c2UgTG9jYWxpemVSb3V0ZXJNb2R1bGUuZm9yQ2hpbGQoKSBpbnN0ZWFkLmApO1xuICB9XG4gIHJldHVybiAnZ3VhcmRlZCc7XG59XG4iXSwibmFtZXMiOlsiSW5qZWN0aW9uVG9rZW4iLCJDYWNoZU1lY2hhbmlzbSIsIkluamVjdCIsIk9ic2VydmFibGUiLCJUcmFuc2xhdGVTZXJ2aWNlIiwiTG9jYXRpb24iLCJ0c2xpYl8xLl9fZXh0ZW5kcyIsInJvdXRlciIsIlN1YmplY3QiLCJmaWx0ZXIiLCJOYXZpZ2F0aW9uU3RhcnQiLCJwYWlyd2lzZSIsIlJvdXRlciIsIkFjdGl2YXRlZFJvdXRlIiwiUGlwZSIsIkNoYW5nZURldGVjdG9yUmVmIiwiUk9VVEVTIiwiSW5qZWN0YWJsZSIsImZvcndhcmRSZWYiLCJDb21waWxlciIsIlN5c3RlbUpzTmdNb2R1bGVMb2FkZXJDb25maWciLCJPcHRpb25hbCIsIlN5c3RlbUpzTmdNb2R1bGVMb2FkZXIiLCJJbmplY3RvciIsIlNraXBTZWxmIiwiTmdNb2R1bGVGYWN0b3J5TG9hZGVyIiwiQVBQX0lOSVRJQUxJWkVSIiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJSb3V0ZXJNb2R1bGUiLCJUcmFuc2xhdGVNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFBOzs7Ozs7Ozs7Ozs7OztJQWNBO0lBRUEsSUFBSSxhQUFhLEdBQUcsVUFBUyxDQUFDLEVBQUUsQ0FBQztRQUM3QixhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7YUFDaEMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDNUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQztnQkFBRSxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQy9FLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUM7QUFFRix1QkFBMEIsQ0FBQyxFQUFFLENBQUM7UUFDMUIsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwQixnQkFBZ0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUN2QyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFF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