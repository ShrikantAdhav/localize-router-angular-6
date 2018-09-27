import { Inject, InjectionToken, Pipe, ChangeDetectorRef, SystemJsNgModuleLoader, SystemJsNgModuleLoaderConfig, Optional, Compiler, Injectable, forwardRef, NgModule, APP_INITIALIZER, SkipSelf, Injector, NgModuleFactoryLoader } from '@angular/core';
import { __extends, __spread, __read } from 'tslib';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { Location, CommonModule } from '@angular/common';
import { Router, NavigationStart, ActivatedRoute, ROUTES, RouterModule } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Guard to make sure we have single initialization of forRoot
 * @type {?}
 */
var LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken('LOCALIZE_ROUTER_FORROOT_GUARD');
/**
 * Static provider for keeping track of routes
 * @type {?}
 */
var RAW_ROUTES = new InjectionToken('RAW_ROUTES');
/**
 * Namespace for fail proof access of CacheMechanism
 */
/**
 * Namespace for fail proof access of CacheMechanism
 */
var CacheMechanism;
/**
 * Namespace for fail proof access of CacheMechanism
 */
(function (CacheMechanism) {
    CacheMechanism.LocalStorage = 'LocalStorage';
    CacheMechanism.Cookie = 'Cookie';
})(CacheMechanism || (CacheMechanism = {}));
/**
 * Boolean to indicate whether to use cached language value
 * @type {?}
 */
var USE_CACHED_LANG = new InjectionToken('USE_CACHED_LANG');
/**
 * Cache mechanism type
 * @type {?}
 */
var CACHE_MECHANISM = new InjectionToken('CACHE_MECHANISM');
/**
 * Cache name
 * @type {?}
 */
var CACHE_NAME = new InjectionToken('CACHE_NAME');
/**
 * Function for calculating default language
 * @type {?}
 */
var DEFAULT_LANG_FUNCTION = new InjectionToken('DEFAULT_LANG_FUNCTION');
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 * @type {?}
 */
var ALWAYS_SET_PREFIX = new InjectionToken('ALWAYS_SET_PREFIX');
/** @type {?} */
var LOCALIZE_CACHE_NAME = 'LOCALIZE_DEFAULT_LANGUAGE';
var LocalizeRouterSettings = /** @class */ (function () {
    /**
     * Settings for localize router
     */
    function LocalizeRouterSettings(useCachedLang, alwaysSetPrefix, cacheMechanism, cacheName, defaultLangFunction) {
        if (useCachedLang === void 0) { useCachedLang = true; }
        if (alwaysSetPrefix === void 0) { alwaysSetPrefix = true; }
        if (cacheMechanism === void 0) { cacheMechanism = CacheMechanism.LocalStorage; }
        if (cacheName === void 0) { cacheName = LOCALIZE_CACHE_NAME; }
        if (defaultLangFunction === void 0) { defaultLangFunction = void 0; }
        this.useCachedLang = useCachedLang;
        this.alwaysSetPrefix = alwaysSetPrefix;
        this.cacheMechanism = cacheMechanism;
        this.cacheName = cacheName;
        this.defaultLangFunction = defaultLangFunction;
    }
    LocalizeRouterSettings.ctorParameters = function () { return [
        { type: Boolean, decorators: [{ type: Inject, args: [USE_CACHED_LANG,] }] },
        { type: Boolean, decorators: [{ type: Inject, args: [ALWAYS_SET_PREFIX,] }] },
        { type: CacheMechanism, decorators: [{ type: Inject, args: [CACHE_MECHANISM,] }] },
        { type: String, decorators: [{ type: Inject, args: [CACHE_NAME,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [DEFAULT_LANG_FUNCTION,] }] }
    ]; };
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
var LocalizeParser = /** @class */ (function () {
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
        return new Observable(function (observer) {
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
            if (route.loadChildren && ((/** @type {?} */ (route)))._loadedConfig) {
                _this._translateRouteTree(((/** @type {?} */ (route)))._loadedConfig.routes);
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
            routeData.localizeRouter[property] = ((/** @type {?} */ (route)))[property];
        }
        /** @type {?} */
        var result = this.translateRoute(routeData.localizeRouter[property]);
        ((/** @type {?} */ (route)))[property] = prefixLang ? "/" + this.urlPrefix + result : result;
    };
    Object.defineProperty(LocalizeParser.prototype, "urlPrefix", {
        get: /**
         * @return {?}
         */
        function () {
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
         */
        function () {
            if (!this.settings.useCachedLang) {
                return;
            }
            if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
                return this._cacheWithLocalStorage();
            }
            if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
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
         */
        function (value) {
            if (!this.settings.useCachedLang) {
                return;
            }
            if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
                this._cacheWithLocalStorage(value);
            }
            if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
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
    LocalizeParser.ctorParameters = function () { return [
        { type: TranslateService, decorators: [{ type: Inject, args: [TranslateService,] }] },
        { type: Location, decorators: [{ type: Inject, args: [Location,] }] },
        { type: LocalizeRouterSettings, decorators: [{ type: Inject, args: [LocalizeRouterSettings,] }] }
    ]; };
    return LocalizeParser;
}());
/**
 * Manually set configuration
 */
var  /**
 * Manually set configuration
 */
ManualParserLoader = /** @class */ (function (_super) {
    __extends(ManualParserLoader, _super);
    /**
     * CTOR
     */
    function ManualParserLoader(translate, location, settings, locales, prefix) {
        if (locales === void 0) { locales = ['en']; }
        if (prefix === void 0) { prefix = 'ROUTES.'; }
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
var DummyLocalizeParser = /** @class */ (function (_super) {
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
var LocalizeRouterService = /** @class */ (function () {
    /**
     * CTOR
     */
    function LocalizeRouterService(parser, settings, router, route) {
        this.parser = parser;
        this.settings = settings;
        this.router = router;
        this.route = route;
        this.routerEvents = new Subject();
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
            .pipe(filter(function (event) { return event instanceof NavigationStart; }), pairwise())
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
        ((/** @type {?} */ (path))).forEach(function (segment, index) {
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
    LocalizeRouterService.ctorParameters = function () { return [
        { type: LocalizeParser, decorators: [{ type: Inject, args: [LocalizeParser,] }] },
        { type: LocalizeRouterSettings, decorators: [{ type: Inject, args: [LocalizeRouterSettings,] }] },
        { type: Router, decorators: [{ type: Inject, args: [Router,] }] },
        { type: ActivatedRoute, decorators: [{ type: Inject, args: [ActivatedRoute,] }] }
    ]; };
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
var LocalizeRouterPipe = /** @class */ (function () {
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
        if (((/** @type {?} */ (this._ref)))._view.state & VIEW_DESTROYED_STATE) {
            return this.value;
        }
        this._ref.detectChanges();
        return this.value;
    };
    LocalizeRouterPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'localize',
                    pure: false // required to update the value when the promise is resolved
                },] },
    ];
    LocalizeRouterPipe.ctorParameters = function () { return [
        { type: LocalizeRouterService },
        { type: ChangeDetectorRef }
    ]; };
    return LocalizeRouterPipe;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
 */
var LocalizeRouterConfigLoader = /** @class */ (function (_super) {
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
                        if (token === ROUTES) {
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
        { type: Injectable },
    ];
    LocalizeRouterConfigLoader.ctorParameters = function () { return [
        { type: LocalizeParser, decorators: [{ type: Inject, args: [forwardRef(function () { return LocalizeParser; }),] }] },
        { type: Compiler },
        { type: SystemJsNgModuleLoaderConfig, decorators: [{ type: Optional }] }
    ]; };
    return LocalizeRouterConfigLoader;
}(SystemJsNgModuleLoader));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ParserInitializer = /** @class */ (function () {
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
        { type: Injectable },
    ];
    ParserInitializer.ctorParameters = function () { return [
        { type: Injector }
    ]; };
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
var LocalizeRouterModule = /** @class */ (function () {
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
        if (config === void 0) { config = {}; }
        return {
            ngModule: LocalizeRouterModule,
            providers: [
                {
                    provide: LOCALIZE_ROUTER_FORROOT_GUARD,
                    useFactory: provideForRootGuard,
                    deps: [[LocalizeRouterModule, new Optional(), new SkipSelf()]]
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
                { provide: NgModuleFactoryLoader, useClass: LocalizeRouterConfigLoader },
                {
                    provide: APP_INITIALIZER,
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
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule, TranslateModule],
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

export { ParserInitializer, getAppInitializer, LocalizeRouterModule, provideForRootGuard, LocalizeParser, ManualParserLoader, DummyLocalizeParser, LocalizeRouterService, LocalizeRouterPipe, LOCALIZE_ROUTER_FORROOT_GUARD, RAW_ROUTES, CacheMechanism, USE_CACHED_LANG, CACHE_MECHANISM, CACHE_NAME, DEFAULT_LANG_FUNCTION, ALWAYS_SET_PREFIX, LocalizeRouterSettings, LocalizeRouterConfigLoader };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2lsc2Rhdi1uZ3gtdHJhbnNsYXRlLXJvdXRlci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5jb25maWcudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnNlcnZpY2UudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi91dGlsLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnBpcGUudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlci50cyIsIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgUHJvdmlkZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlck1vZHVsZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLm1vZHVsZSc7XG5cbi8qKlxuICogR3VhcmQgdG8gbWFrZSBzdXJlIHdlIGhhdmUgc2luZ2xlIGluaXRpYWxpemF0aW9uIG9mIGZvclJvb3RcbiAqL1xuZXhwb3J0IGNvbnN0IExPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJEID0gbmV3IEluamVjdGlvblRva2VuPExvY2FsaXplUm91dGVyTW9kdWxlPignTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQnKTtcblxuLyoqXG4gKiBTdGF0aWMgcHJvdmlkZXIgZm9yIGtlZXBpbmcgdHJhY2sgb2Ygcm91dGVzXG4gKi9cbmV4cG9ydCBjb25zdCBSQVdfUk9VVEVTOiBJbmplY3Rpb25Ub2tlbjxSb3V0ZXNbXT4gPSBuZXcgSW5qZWN0aW9uVG9rZW48Um91dGVzW10+KCdSQVdfUk9VVEVTJyk7XG5cbi8qKlxuICogVHlwZSBmb3IgQ2FjaGluZyBvZiBkZWZhdWx0IGxhbmd1YWdlXG4gKi9cbmV4cG9ydCB0eXBlIENhY2hlTWVjaGFuaXNtID0gJ0xvY2FsU3RvcmFnZScgfCAnQ29va2llJztcblxuLyoqXG4gKiBOYW1lc3BhY2UgZm9yIGZhaWwgcHJvb2YgYWNjZXNzIG9mIENhY2hlTWVjaGFuaXNtXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgQ2FjaGVNZWNoYW5pc20ge1xuICBleHBvcnQgY29uc3QgTG9jYWxTdG9yYWdlOiBDYWNoZU1lY2hhbmlzbSA9ICdMb2NhbFN0b3JhZ2UnO1xuICBleHBvcnQgY29uc3QgQ29va2llOiBDYWNoZU1lY2hhbmlzbSA9ICdDb29raWUnO1xufVxuXG4vKipcbiAqIEJvb2xlYW4gdG8gaW5kaWNhdGUgd2hldGhlciB0byB1c2UgY2FjaGVkIGxhbmd1YWdlIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBVU0VfQ0FDSEVEX0xBTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ1VTRV9DQUNIRURfTEFORycpO1xuLyoqXG4gKiBDYWNoZSBtZWNoYW5pc20gdHlwZVxuICovXG5leHBvcnQgY29uc3QgQ0FDSEVfTUVDSEFOSVNNID0gbmV3IEluamVjdGlvblRva2VuPENhY2hlTWVjaGFuaXNtPignQ0FDSEVfTUVDSEFOSVNNJyk7XG4vKipcbiAqIENhY2hlIG5hbWVcbiAqL1xuZXhwb3J0IGNvbnN0IENBQ0hFX05BTUUgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignQ0FDSEVfTkFNRScpO1xuXG4vKipcbiAqIFR5cGUgZm9yIGRlZmF1bHQgbGFuZ3VhZ2UgZnVuY3Rpb25cbiAqIFVzZWQgdG8gb3ZlcnJpZGUgYmFzaWMgYmVoYXZpb3VyXG4gKi9cbmV4cG9ydCB0eXBlIERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uID0gKGxhbmd1YWdlczogc3RyaW5nW10sIGNhY2hlZExhbmc/OiBzdHJpbmcsIGJyb3dzZXJMYW5nPzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cbi8qKlxuICogRnVuY3Rpb24gZm9yIGNhbGN1bGF0aW5nIGRlZmF1bHQgbGFuZ3VhZ2VcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTEFOR19GVU5DVElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbj4oJ0RFRkFVTFRfTEFOR19GVU5DVElPTicpO1xuXG4vKipcbiAqIEJvb2xlYW4gdG8gaW5kaWNhdGUgd2hldGhlciBwcmVmaXggc2hvdWxkIGJlIHNldCBmb3Igc2luZ2xlIGxhbmd1YWdlIHNjZW5hcmlvc1xuICovXG5leHBvcnQgY29uc3QgQUxXQVlTX1NFVF9QUkVGSVggPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ0FMV0FZU19TRVRfUFJFRklYJyk7XG5cbi8qKlxuICogQ29uZmlnIGludGVyZmFjZSBmb3IgTG9jYWxpemVSb3V0ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhbGl6ZVJvdXRlckNvbmZpZyB7XG4gIHBhcnNlcj86IFByb3ZpZGVyO1xuICB1c2VDYWNoZWRMYW5nPzogYm9vbGVhbjtcbiAgY2FjaGVNZWNoYW5pc20/OiBDYWNoZU1lY2hhbmlzbTtcbiAgY2FjaGVOYW1lPzogc3RyaW5nO1xuICBkZWZhdWx0TGFuZ0Z1bmN0aW9uPzogRGVmYXVsdExhbmd1YWdlRnVuY3Rpb247XG4gIGFsd2F5c1NldFByZWZpeD86IGJvb2xlYW47XG59XG5cbmNvbnN0IExPQ0FMSVpFX0NBQ0hFX05BTUUgPSAnTE9DQUxJWkVfREVGQVVMVF9MQU5HVUFHRSc7XG5cbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlclNldHRpbmdzIGltcGxlbWVudHMgTG9jYWxpemVSb3V0ZXJDb25maWcge1xuICAvKipcbiAgICogU2V0dGluZ3MgZm9yIGxvY2FsaXplIHJvdXRlclxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChVU0VfQ0FDSEVEX0xBTkcpIHB1YmxpYyB1c2VDYWNoZWRMYW5nOiBib29sZWFuID0gdHJ1ZSxcbiAgICBASW5qZWN0KEFMV0FZU19TRVRfUFJFRklYKSBwdWJsaWMgYWx3YXlzU2V0UHJlZml4OiBib29sZWFuID0gdHJ1ZSxcbiAgICBASW5qZWN0KENBQ0hFX01FQ0hBTklTTSkgcHVibGljIGNhY2hlTWVjaGFuaXNtOiBDYWNoZU1lY2hhbmlzbSA9IENhY2hlTWVjaGFuaXNtLkxvY2FsU3RvcmFnZSxcbiAgICBASW5qZWN0KENBQ0hFX05BTUUpIHB1YmxpYyBjYWNoZU5hbWU6IHN0cmluZyA9IExPQ0FMSVpFX0NBQ0hFX05BTUUsXG4gICAgQEluamVjdChERUZBVUxUX0xBTkdfRlVOQ1RJT04pIHB1YmxpYyBkZWZhdWx0TGFuZ0Z1bmN0aW9uOiBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbiA9IHZvaWQgMFxuICApIHtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUm91dGVzLCBSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ2FjaGVNZWNoYW5pc20sIExvY2FsaXplUm91dGVyU2V0dGluZ3MgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuaW1wb3J0IHsgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmNvbnN0IENPT0tJRV9FWFBJUlkgPSAzMDsgLy8gMSBtb250aFxuXG4vKipcbiAqIEFic3RyYWN0IGNsYXNzIGZvciBwYXJzaW5nIGxvY2FsaXphdGlvblxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTG9jYWxpemVQYXJzZXIge1xuICBsb2NhbGVzOiBBcnJheTxzdHJpbmc+O1xuICBjdXJyZW50TGFuZzogc3RyaW5nO1xuICByb3V0ZXM6IFJvdXRlcztcbiAgZGVmYXVsdExhbmc6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgcHJlZml4OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfdHJhbnNsYXRpb25PYmplY3Q6IGFueTtcbiAgcHJpdmF0ZSBfd2lsZGNhcmRSb3V0ZTogUm91dGU7XG4gIHByaXZhdGUgX2xhbmd1YWdlUm91dGU6IFJvdXRlO1xuXG4gIC8qKlxuICAgKiBMb2FkZXIgY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoVHJhbnNsYXRlU2VydmljZSkgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXG4gICAgQEluamVjdChMb2NhdGlvbikgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sXG4gICAgQEluamVjdChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSBwcml2YXRlIHNldHRpbmdzOiBMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSB7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCByb3V0ZXMgYW5kIGZldGNoIG5lY2Vzc2FyeSBkYXRhXG4gICAqL1xuICBhYnN0cmFjdCBsb2FkKHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+O1xuXG4gIC8qKlxuICogUHJlcGFyZSByb3V0ZXMgdG8gYmUgZnVsbHkgdXNhYmxlIGJ5IG5neC10cmFuc2xhdGUtcm91dGVyXG4gKiBAcGFyYW0gcm91dGVzXG4gKi9cbiAgLyogcHJpdmF0ZSBpbml0Um91dGVzKHJvdXRlczogUm91dGVzLCBwcmVmaXggPSAnJykge1xuICAgIHJvdXRlcy5mb3JFYWNoKHJvdXRlID0+IHtcbiAgICAgIGlmIChyb3V0ZS5wYXRoICE9PSAnKionKSB7XG4gICAgICAgIGNvbnN0IHJvdXRlRGF0YTogYW55ID0gcm91dGUuZGF0YSA9IHJvdXRlLmRhdGEgfHwge307XG4gICAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlciA9IHt9O1xuICAgICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIuZnVsbFBhdGggPSBgJHtwcmVmaXh9LyR7cm91dGUucGF0aH1gO1xuICAgICAgICBpZiAocm91dGUuY2hpbGRyZW4gJiYgcm91dGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuaW5pdFJvdXRlcyhyb3V0ZS5jaGlsZHJlbiwgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyLmZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9ICovXG5cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBsYW5ndWFnZSBhbmQgcm91dGVzXG4gICAqL1xuICBwcm90ZWN0ZWQgaW5pdChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PiB7XG4gICAgbGV0IHNlbGVjdGVkTGFuZ3VhZ2U6IHN0cmluZztcblxuICAgIC8vIHRoaXMuaW5pdFJvdXRlcyhyb3V0ZXMpO1xuICAgIHRoaXMucm91dGVzID0gcm91dGVzO1xuXG4gICAgaWYgKCF0aGlzLmxvY2FsZXMgfHwgIXRoaXMubG9jYWxlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgLyoqIGRldGVjdCBjdXJyZW50IGxhbmd1YWdlICovXG4gICAgY29uc3QgbG9jYXRpb25MYW5nID0gdGhpcy5nZXRMb2NhdGlvbkxhbmcoKTtcbiAgICBjb25zdCBicm93c2VyTGFuZyA9IHRoaXMuX2dldEJyb3dzZXJMYW5nKCk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWZhdWx0TGFuZ0Z1bmN0aW9uKSB7XG4gICAgICB0aGlzLmRlZmF1bHRMYW5nID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0TGFuZ0Z1bmN0aW9uKHRoaXMubG9jYWxlcywgdGhpcy5fY2FjaGVkTGFuZywgYnJvd3NlckxhbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlZmF1bHRMYW5nID0gdGhpcy5fY2FjaGVkTGFuZyB8fCBicm93c2VyTGFuZyB8fCB0aGlzLmxvY2FsZXNbMF07XG4gICAgfVxuICAgIHNlbGVjdGVkTGFuZ3VhZ2UgPSBsb2NhdGlvbkxhbmcgfHwgdGhpcy5kZWZhdWx0TGFuZztcbiAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZyh0aGlzLmRlZmF1bHRMYW5nKTtcblxuICAgIGxldCBjaGlsZHJlbjogUm91dGVzID0gW107XG4gICAgLyoqIGlmIHNldCBwcmVmaXggaXMgZW5mb3JjZWQgKi9cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgIGNvbnN0IGJhc2VSb3V0ZSA9IHsgcGF0aDogJycsIHJlZGlyZWN0VG86IHRoaXMuZGVmYXVsdExhbmcsIHBhdGhNYXRjaDogJ2Z1bGwnIH07XG5cbiAgICAgIC8qKiBleHRyYWN0IHBvdGVudGlhbCB3aWxkY2FyZCByb3V0ZSAqL1xuICAgICAgY29uc3Qgd2lsZGNhcmRJbmRleCA9IHJvdXRlcy5maW5kSW5kZXgoKHJvdXRlOiBSb3V0ZSkgPT4gcm91dGUucGF0aCA9PT0gJyoqJyk7XG4gICAgICBpZiAod2lsZGNhcmRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5fd2lsZGNhcmRSb3V0ZSA9IHJvdXRlcy5zcGxpY2Uod2lsZGNhcmRJbmRleCwgMSlbMF07XG4gICAgICB9XG4gICAgICBjaGlsZHJlbiA9IHRoaXMucm91dGVzLnNwbGljZSgwLCB0aGlzLnJvdXRlcy5sZW5ndGgsIGJhc2VSb3V0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkcmVuID0gWy4uLnRoaXMucm91dGVzXTsgLy8gc2hhbGxvdyBjb3B5IG9mIHJvdXRlc1xuICAgIH1cblxuICAgIC8qKiBleGNsdWRlIGNlcnRhaW4gcm91dGVzICovXG4gICAgZm9yIChsZXQgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoY2hpbGRyZW5baV0uZGF0YSAmJiBjaGlsZHJlbltpXS5kYXRhWydza2lwUm91dGVMb2NhbGl6YXRpb24nXSkge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgICAgICAvLyBhZGQgZGlyZWN0bHkgdG8gcm91dGVzXG4gICAgICAgICAgdGhpcy5yb3V0ZXMucHVzaChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBhcHBlbmQgY2hpbGRyZW4gcm91dGVzICovXG4gICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMubG9jYWxlcy5sZW5ndGggPiAxIHx8IHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICAgIHRoaXMuX2xhbmd1YWdlUm91dGUgPSB7IGNoaWxkcmVuOiBjaGlsZHJlbiB9O1xuICAgICAgICB0aGlzLnJvdXRlcy51bnNoaWZ0KHRoaXMuX2xhbmd1YWdlUm91dGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiAuLi5hbmQgcG90ZW50aWFsIHdpbGRjYXJkIHJvdXRlICovXG4gICAgaWYgKHRoaXMuX3dpbGRjYXJkUm91dGUgJiYgdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgIHRoaXMucm91dGVzLnB1c2godGhpcy5fd2lsZGNhcmRSb3V0ZSk7XG4gICAgfVxuXG4gICAgLyoqIHRyYW5zbGF0ZSByb3V0ZXMgKi9cbiAgICBjb25zdCByZXMgPSB0aGlzLnRyYW5zbGF0ZVJvdXRlcyhzZWxlY3RlZExhbmd1YWdlKTtcbiAgICByZXR1cm4gcmVzLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgaW5pdENoaWxkUm91dGVzKHJvdXRlczogUm91dGVzKSB7XG4gICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHJvdXRlcyk7XG4gICAgcmV0dXJuIHJvdXRlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcm91dGVzIHRvIHNlbGVjdGVkIGxhbmd1YWdlXG4gICAqL1xuICB0cmFuc2xhdGVSb3V0ZXMobGFuZ3VhZ2U6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPGFueT4oKG9ic2VydmVyOiBPYnNlcnZlcjxhbnk+KSA9PiB7XG4gICAgICB0aGlzLl9jYWNoZWRMYW5nID0gbGFuZ3VhZ2U7XG4gICAgICBpZiAodGhpcy5fbGFuZ3VhZ2VSb3V0ZSkge1xuICAgICAgICB0aGlzLl9sYW5ndWFnZVJvdXRlLnBhdGggPSBsYW5ndWFnZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmFuc2xhdGUudXNlKGxhbmd1YWdlKS5zdWJzY3JpYmUoKHRyYW5zbGF0aW9uczogYW55KSA9PiB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uT2JqZWN0ID0gdHJhbnNsYXRpb25zO1xuICAgICAgICB0aGlzLmN1cnJlbnRMYW5nID0gbGFuZ3VhZ2U7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xhbmd1YWdlUm91dGUpIHtcbiAgICAgICAgICBpZiAodGhpcy5fbGFuZ3VhZ2VSb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHRoaXMuX2xhbmd1YWdlUm91dGUuY2hpbGRyZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBpZiB0aGVyZSBpcyB3aWxkY2FyZCByb3V0ZVxuICAgICAgICAgIGlmICh0aGlzLl93aWxkY2FyZFJvdXRlICYmIHRoaXMuX3dpbGRjYXJkUm91dGUucmVkaXJlY3RUbykge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUHJvcGVydHkodGhpcy5fd2lsZGNhcmRSb3V0ZSwgJ3JlZGlyZWN0VG8nLCB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHRoaXMucm91dGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVyLm5leHQodm9pZCAwKTtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSB0aGUgcm91dGUgbm9kZSBhbmQgcmVjdXJzaXZlbHkgY2FsbCBmb3IgYWxsIGl0J3MgY2hpbGRyZW5cbiAgICovXG4gIHByaXZhdGUgX3RyYW5zbGF0ZVJvdXRlVHJlZShyb3V0ZXM6IFJvdXRlcyk6IHZvaWQge1xuICAgIHJvdXRlcy5mb3JFYWNoKChyb3V0ZTogUm91dGUpID0+IHtcbiAgICAgIGlmIChyb3V0ZS5wYXRoICYmIHJvdXRlLnBhdGggIT09ICcqKicpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRlUHJvcGVydHkocm91dGUsICdwYXRoJyk7XG4gICAgICB9XG4gICAgICBpZiAocm91dGUucmVkaXJlY3RUbykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGVQcm9wZXJ0eShyb3V0ZSwgJ3JlZGlyZWN0VG8nLCAhcm91dGUucmVkaXJlY3RUby5pbmRleE9mKCcvJykpO1xuICAgICAgfVxuICAgICAgaWYgKHJvdXRlLmNoaWxkcmVuKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZShyb3V0ZS5jaGlsZHJlbik7XG4gICAgICB9XG4gICAgICBpZiAocm91dGUubG9hZENoaWxkcmVuICYmICg8YW55PnJvdXRlKS5fbG9hZGVkQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZSgoPGFueT5yb3V0ZSkuX2xvYWRlZENvbmZpZy5yb3V0ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSBwcm9wZXJ0eVxuICAgKiBJZiBmaXJzdCB0aW1lIHRyYW5zbGF0aW9uIHRoZW4gYWRkIG9yaWdpbmFsIHRvIHJvdXRlIGRhdGEgb2JqZWN0XG4gICAqL1xuICBwcml2YXRlIF90cmFuc2xhdGVQcm9wZXJ0eShyb3V0ZTogUm91dGUsIHByb3BlcnR5OiBzdHJpbmcsIHByZWZpeExhbmc/OiBib29sZWFuKTogdm9pZCB7XG4gICAgLy8gc2V0IHByb3BlcnR5IHRvIGRhdGEgaWYgbm90IHRoZXJlIHlldFxuICAgIGNvbnN0IHJvdXRlRGF0YTogYW55ID0gcm91dGUuZGF0YSA9IHJvdXRlLmRhdGEgfHwge307XG4gICAgaWYgKCFyb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIpIHtcbiAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcltwcm9wZXJ0eV0pIHtcbiAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcltwcm9wZXJ0eV0gPSAoPGFueT5yb3V0ZSlbcHJvcGVydHldO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlUm91dGUocm91dGVEYXRhLmxvY2FsaXplUm91dGVyW3Byb3BlcnR5XSk7XG4gICAgKDxhbnk+cm91dGUpW3Byb3BlcnR5XSA9IHByZWZpeExhbmcgPyBgLyR7dGhpcy51cmxQcmVmaXh9JHtyZXN1bHR9YCA6IHJlc3VsdDtcbiAgfVxuXG4gIGdldCB1cmxQcmVmaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4IHx8IHRoaXMuY3VycmVudExhbmcgIT09IHRoaXMuZGVmYXVsdExhbmcgPyB0aGlzLmN1cnJlbnRMYW5nIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHJvdXRlIGFuZCByZXR1cm4gb2JzZXJ2YWJsZVxuICAgKi9cbiAgdHJhbnNsYXRlUm91dGUocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBxdWVyeVBhcnRzID0gcGF0aC5zcGxpdCgnPycpO1xuICAgIGlmIChxdWVyeVBhcnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGVyZSBzaG91bGQgYmUgb25seSBvbmUgcXVlcnkgcGFyYW1ldGVyIGJsb2NrIGluIHRoZSBVUkwnKTtcbiAgICB9XG4gICAgY29uc3QgcGF0aFNlZ21lbnRzID0gcXVlcnlQYXJ0c1swXS5zcGxpdCgnLycpO1xuXG4gICAgLyoqIGNvbGxlY3Qgb2JzZXJ2YWJsZXMgICovXG4gICAgcmV0dXJuIHBhdGhTZWdtZW50c1xuICAgICAgLm1hcCgocGFydDogc3RyaW5nKSA9PiBwYXJ0Lmxlbmd0aCA/IHRoaXMudHJhbnNsYXRlVGV4dChwYXJ0KSA6IHBhcnQpXG4gICAgICAuam9pbignLycpICtcbiAgICAgIChxdWVyeVBhcnRzLmxlbmd0aCA+IDEgPyBgPyR7cXVlcnlQYXJ0c1sxXX1gIDogJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsYW5ndWFnZSBmcm9tIHVybFxuICAgKi9cbiAgZ2V0TG9jYXRpb25MYW5nKHVybD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlQYXJhbVNwbGl0ID0gKHVybCB8fCB0aGlzLmxvY2F0aW9uLnBhdGgoKSkuc3BsaXQoJz8nKTtcbiAgICBsZXQgcGF0aFNsaWNlczogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAocXVlcnlQYXJhbVNwbGl0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBhdGhTbGljZXMgPSBxdWVyeVBhcmFtU3BsaXRbMF0uc3BsaXQoJy8nKTtcbiAgICB9XG4gICAgaWYgKHBhdGhTbGljZXMubGVuZ3RoID4gMSAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZihwYXRoU2xpY2VzWzFdKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBwYXRoU2xpY2VzWzFdO1xuICAgIH1cbiAgICBpZiAocGF0aFNsaWNlcy5sZW5ndGggJiYgdGhpcy5sb2NhbGVzLmluZGV4T2YocGF0aFNsaWNlc1swXSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gcGF0aFNsaWNlc1swXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHVzZXIncyBsYW5ndWFnZSBzZXQgaW4gdGhlIGJyb3dzZXJcbiAgICovXG4gIHByaXZhdGUgX2dldEJyb3dzZXJMYW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3JldHVybklmSW5Mb2NhbGVzKHRoaXMudHJhbnNsYXRlLmdldEJyb3dzZXJMYW5nKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsYW5ndWFnZSBmcm9tIGxvY2FsIHN0b3JhZ2Ugb3IgY29va2llXG4gICAqL1xuICBwcml2YXRlIGdldCBfY2FjaGVkTGFuZygpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy51c2VDYWNoZWRMYW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Mb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVdpdGhMb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkNvb2tpZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlV2l0aENvb2tpZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSBsYW5ndWFnZSB0byBsb2NhbCBzdG9yYWdlIG9yIGNvb2tpZVxuICAgKi9cbiAgcHJpdmF0ZSBzZXQgX2NhY2hlZExhbmcodmFsdWU6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy51c2VDYWNoZWRMYW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Mb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHRoaXMuX2NhY2hlV2l0aExvY2FsU3RvcmFnZSh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Db29raWUpIHtcbiAgICAgIHRoaXMuX2NhY2hlV2l0aENvb2tpZXModmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZSB2YWx1ZSB0byBsb2NhbCBzdG9yYWdlXG4gICAqL1xuICBwcml2YXRlIF9jYWNoZVdpdGhMb2NhbFN0b3JhZ2UodmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93LmxvY2FsU3RvcmFnZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5zZXR0aW5ncy5jYWNoZU5hbWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3JldHVybklmSW5Mb2NhbGVzKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHdlaXJkIFNhZmFyaSBpc3N1ZSBpbiBwcml2YXRlIG1vZGUsIHdoZXJlIExvY2FsU3RvcmFnZSBpcyBkZWZpbmVkIGJ1dCB0aHJvd3MgZXJyb3Igb24gYWNjZXNzXG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlIHZhbHVlIHZpYSBjb29raWVzXG4gICAqL1xuICBwcml2YXRlIF9jYWNoZVdpdGhDb29raWVzKHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZG9jdW1lbnQuY29va2llID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgbmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSk7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgY29uc3QgZDogRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIENPT0tJRV9FWFBJUlkgKiA4NjQwMDAwMCk7IC8vICogZGF5c1xuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke2VuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSl9O2V4cGlyZXM9JHtkLnRvVVRDU3RyaW5nKCl9YDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cCgnKD86XicgKyBuYW1lICsgJ3w7XFxcXHMqJyArIG5hbWUgKyAnKT0oLio/KSg/Ojt8JCknLCAnZycpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVnZXhwLmV4ZWMoZG9jdW1lbnQuY29va2llKTtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzFdKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm47IC8vIHNob3VsZCBub3QgaGFwcGVuIGJ1dCBiZXR0ZXIgc2FmZSB0aGFuIHNvcnJ5XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHZhbHVlIGV4aXN0cyBpbiBsb2NhbGVzIGxpc3RcbiAgICovXG4gIHByaXZhdGUgX3JldHVybklmSW5Mb2NhbGVzKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh2YWx1ZSAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0cmFuc2xhdGVkIHZhbHVlXG4gICAqL1xuICBwcml2YXRlIHRyYW5zbGF0ZVRleHQoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5fdHJhbnNsYXRpb25PYmplY3QpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIGNvbnN0IGZ1bGxLZXkgPSB0aGlzLnByZWZpeCArIGtleTtcbiAgICBjb25zdCByZXMgPSB0aGlzLnRyYW5zbGF0ZS5nZXRQYXJzZWRSZXN1bHQodGhpcy5fdHJhbnNsYXRpb25PYmplY3QsIGZ1bGxLZXkpO1xuICAgIHJldHVybiByZXMgIT09IGZ1bGxLZXkgPyByZXMgOiBrZXk7XG4gIH1cbn1cblxuLyoqXG4gKiBNYW51YWxseSBzZXQgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgY2xhc3MgTWFudWFsUGFyc2VyTG9hZGVyIGV4dGVuZHMgTG9jYWxpemVQYXJzZXIge1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsIGxvY2F0aW9uOiBMb2NhdGlvbiwgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgbG9jYWxlczogc3RyaW5nW10gPSBbJ2VuJ10sIHByZWZpeDogc3RyaW5nID0gJ1JPVVRFUy4nKSB7XG4gICAgc3VwZXIodHJhbnNsYXRlLCBsb2NhdGlvbiwgc2V0dGluZ3MpO1xuICAgIHRoaXMubG9jYWxlcyA9IGxvY2FsZXM7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXggfHwgJyc7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBvciBhcHBlbmQgcm91dGVzXG4gICAqL1xuICBsb2FkKHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5pbml0KHJvdXRlcykudGhlbihyZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRHVtbXlMb2NhbGl6ZVBhcnNlciBleHRlbmRzIExvY2FsaXplUGFyc2VyIHtcbiAgbG9hZChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuaW5pdChyb3V0ZXMpLnRoZW4ocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uU3RhcnQsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIE5hdmlnYXRpb25FeHRyYXMsIFVybFNlZ21lbnQsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgcGFpcndpc2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2V0dGluZ3MgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuXG4vKipcbiAqIExvY2FsaXphdGlvbiBzZXJ2aWNlXG4gKiBtb2RpZnlSb3V0ZXNcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyU2VydmljZSB7XG4gIHJvdXRlckV2ZW50czogU3ViamVjdDxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoTG9jYWxpemVQYXJzZXIpIHB1YmxpYyBwYXJzZXI6IExvY2FsaXplUGFyc2VyLFxuICAgICAgQEluamVjdChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSBwdWJsaWMgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgICBASW5qZWN0KFJvdXRlcikgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgIEBJbmplY3QoQWN0aXZhdGVkUm91dGUpIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlXG4gICAgKSB7XG4gICAgICB0aGlzLnJvdXRlckV2ZW50cyA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cCB0aGUgc2VydmljZVxuICAgKi9cbiAgaW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgIC8vIHN1YnNjcmliZSB0byByb3V0ZXIgZXZlbnRzXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSxcbiAgICAgICAgcGFpcndpc2UoKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSh0aGlzLl9yb3V0ZUNoYW5nZWQoKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIGxhbmd1YWdlIGFuZCBuYXZpZ2F0ZSB0byB0cmFuc2xhdGVkIHJvdXRlXG4gICAqL1xuICBjaGFuZ2VMYW5ndWFnZShsYW5nOiBzdHJpbmcsIGV4dHJhcz86IE5hdmlnYXRpb25FeHRyYXMsIHVzZU5hdmlnYXRlTWV0aG9kPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnJvdXRlKTtcbiAgICB9XG4gICAgaWYgKGxhbmcgIT09IHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKSB7XG4gICAgICBjb25zdCByb290U25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QgPSB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdC5yb290O1xuXG4gICAgICB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZXMobGFuZykuc3Vic2NyaWJlKCgpID0+IHtcblxuICAgICAgICBjb25zdCBxdWVyeVBhcmFtcyA9IHJvb3RTbmFwc2hvdC5xdWVyeVBhcmFtcztcbiAgICAgICAgbGV0IHVybCA9ICcnO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMocXVlcnlQYXJhbXMpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gT2JqZWN0LmtleXMocXVlcnlQYXJhbXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5ICsgJz0nICsgcXVlcnlQYXJhbXNba2V5XVxuICAgICAgICAgIH0pLmpvaW4oJyYnKTtcbiAgICAgICAgICB1cmwgPSB0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChyb290U25hcHNob3QpICsgJz8nICsgcXVlcnlTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsID0gdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qocm9vdFNuYXBzaG90KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgICAgICBsZXQgdXJsU2VnbWVudHMgPSB1cmwuc3BsaXQoJy8nKTtcbiAgICAgICAgICBjb25zdCBsYW5ndWFnZVNlZ21lbnRJbmRleCA9IHVybFNlZ21lbnRzLmluZGV4T2YodGhpcy5wYXJzZXIuY3VycmVudExhbmcpO1xuICAgICAgICAgIC8vIElmIHRoZSBkZWZhdWx0IGxhbmd1YWdlIGhhcyBubyBwcmVmaXggbWFrZSBzdXJlIHRvIHJlbW92ZSBhbmQgYWRkIGl0IHdoZW4gbmVjZXNzYXJ5XG4gICAgICAgICAgaWYgKHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nID09PSB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBsYW5ndWFnZSBwcmVmaXggZnJvbSB1cmwgd2hlbiBjdXJyZW50IGxhbmd1YWdlIGlzIHRoZSBkZWZhdWx0IGxhbmd1YWdlXG4gICAgICAgICAgICBpZiAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IDAgfHwgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAxICYmIHVybFNlZ21lbnRzWzBdID09PSAnJykpIHtcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBjdXJyZW50IGFrYSBkZWZhdWx0IGxhbmd1YWdlIHByZWZpeCBmcm9tIHRoZSB1cmxcbiAgICAgICAgICAgICAgdXJsU2VnbWVudHMgPSB1cmxTZWdtZW50cy5zbGljZSgwLCBsYW5ndWFnZVNlZ21lbnRJbmRleCkuY29uY2F0KHVybFNlZ21lbnRzLnNsaWNlKGxhbmd1YWdlU2VnbWVudEluZGV4ICsgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBXaGVuIGNvbWluZyBmcm9tIGEgZGVmYXVsdCBsYW5ndWFnZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlIHVybCBkb2Vzbid0IGNvbnRhaW4gdGhlIGxhbmd1YWdlLCBtYWtlIHN1cmUgaXQgZG9lcy5cbiAgICAgICAgICAgIGlmIChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgLy8gSWYgdGhlIHVybCBzdGFydHMgd2l0aCBhIHNsYXNoIG1ha2Ugc3VyZSB0byBrZWVwIGl0LlxuICAgICAgICAgICAgICBjb25zdCBpbmplY3Rpb25JbmRleCA9IHVybFNlZ21lbnRzWzBdID09PSAnJyA/IDEgOiAwO1xuICAgICAgICAgICAgICB1cmxTZWdtZW50cyA9IHVybFNlZ21lbnRzLnNsaWNlKDAsIGluamVjdGlvbkluZGV4KS5jb25jYXQodGhpcy5wYXJzZXIuY3VycmVudExhbmcsIHVybFNlZ21lbnRzLnNsaWNlKGluamVjdGlvbkluZGV4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHVybCA9IHVybFNlZ21lbnRzLmpvaW4oJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKHRoaXMucGFyc2VyLnJvdXRlcyk7XG4gICAgICAgIGlmICh1c2VOYXZpZ2F0ZU1ldGhvZCkge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt1cmxdLCBleHRyYXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsLCBleHRyYXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJhdmVyc2VzIHRocm91Z2ggdGhlIHRyZWUgdG8gYXNzZW1ibGUgbmV3IHRyYW5zbGF0ZWQgdXJsXG4gICAqL1xuICBwcml2YXRlIHRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IHN0cmluZyB7XG5cbiAgICBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCAmJiBzbmFwc2hvdC5yb3V0ZUNvbmZpZykge1xuICAgICAgcmV0dXJuIGAke3RoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpfS8ke3RoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpfWA7XG4gICAgfSBlbHNlIGlmIChzbmFwc2hvdC5maXJzdENoaWxkKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3QuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KTtcbiAgICB9XG5cbiAgICAvKiBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCAmJiBzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnICYmIHNuYXBzaG90LmZpcnN0Q2hpbGQucm91dGVDb25maWcucGF0aCkge1xuICAgICAgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQucm91dGVDb25maWcucGF0aCAhPT0gJyoqJykge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCkgKyAnLycgKyB0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdC5maXJzdENoaWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCk7ICovXG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdHMgbmV3IHNlZ21lbnQgdmFsdWUgYmFzZWQgb24gcm91dGVDb25maWcgYW5kIHVybFxuICAgKi9cbiAgcHJpdmF0ZSBwYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IHN0cmluZyB7XG4gICAgaWYgKHNuYXBzaG90LmRhdGEubG9jYWxpemVSb3V0ZXIpIHtcbiAgICAgIGNvbnN0IHBhdGggPSBzbmFwc2hvdC5kYXRhLmxvY2FsaXplUm91dGVyLnBhdGg7XG4gICAgICBjb25zdCBzdWJQYXRoU2VnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gICAgICByZXR1cm4gc3ViUGF0aFNlZ21lbnRzLm1hcCgoczogc3RyaW5nLCBpOiBudW1iZXIpID0+IHMuaW5kZXhPZignOicpID09PSAwID8gc25hcHNob3QudXJsW2ldLnBhdGggOiBzKS5qb2luKCcvJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgLyogaWYgKHNuYXBzaG90LnJvdXRlQ29uZmlnKSB7XG4gICAgICBpZiAoc25hcHNob3Qucm91dGVDb25maWcucGF0aCA9PT0gJyoqJykge1xuICAgICAgICByZXR1cm4gc25hcHNob3QudXJsLmZpbHRlcigoc2VnbWVudDogVXJsU2VnbWVudCkgPT4gc2VnbWVudC5wYXRoKS5tYXAoKHNlZ21lbnQ6IFVybFNlZ21lbnQpID0+IHNlZ21lbnQucGF0aCkuam9pbignLycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3ViUGF0aFNlZ21lbnRzID0gc25hcHNob3Qucm91dGVDb25maWcucGF0aC5zcGxpdCgnLycpO1xuICAgICAgICByZXR1cm4gc3ViUGF0aFNlZ21lbnRzLm1hcCgoczogc3RyaW5nLCBpOiBudW1iZXIpID0+IHMuaW5kZXhPZignOicpID09PSAwID8gc25hcHNob3QudXJsW2ldLnBhdGggOiBzKS5qb2luKCcvJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJzsgKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcm91dGUgdG8gY3VycmVudCBsYW5ndWFnZVxuICAgKiBJZiBuZXcgbGFuZ3VhZ2UgaXMgZXhwbGljaXRseSBwcm92aWRlZCB0aGVuIHJlcGxhY2UgbGFuZ3VhZ2UgcGFydCBpbiB1cmwgd2l0aCBuZXcgbGFuZ3VhZ2VcbiAgICovXG4gIHRyYW5zbGF0ZVJvdXRlKHBhdGg6IHN0cmluZyB8IGFueVtdKTogc3RyaW5nIHwgYW55W10ge1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlKHBhdGgpO1xuICAgICAgcmV0dXJuICFwYXRoLmluZGV4T2YoJy8nKSA/IGAvJHt0aGlzLnBhcnNlci51cmxQcmVmaXh9JHt1cmx9YCA6IHVybDtcbiAgICB9XG4gICAgLy8gaXQncyBhbiBhcnJheVxuICAgIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXTtcbiAgICAocGF0aCBhcyBBcnJheTxhbnk+KS5mb3JFYWNoKChzZWdtZW50OiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygc2VnbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGUoc2VnbWVudCk7XG4gICAgICAgIGlmICghaW5kZXggJiYgIXNlZ21lbnQuaW5kZXhPZignLycpKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goYC8ke3RoaXMucGFyc2VyLnVybFByZWZpeH0ke3Jlc31gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQucHVzaChyZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGhhbmRsZXIgdG8gcmVhY3Qgb24gcm91dGUgY2hhbmdlXG4gICAqL1xuICBwcml2YXRlIF9yb3V0ZUNoYW5nZWQoKTogKGV2ZW50UGFpcjogW05hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvblN0YXJ0XSkgPT4gdm9pZCB7XG4gICAgcmV0dXJuIChbcHJldmlvdXNFdmVudCwgY3VycmVudEV2ZW50XTogW05hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvblN0YXJ0XSkgPT4ge1xuICAgICAgY29uc3QgcHJldmlvdXNMYW5nID0gdGhpcy5wYXJzZXIuZ2V0TG9jYXRpb25MYW5nKHByZXZpb3VzRXZlbnQudXJsKSB8fCB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZztcbiAgICAgIGNvbnN0IGN1cnJlbnRMYW5nID0gdGhpcy5wYXJzZXIuZ2V0TG9jYXRpb25MYW5nKGN1cnJlbnRFdmVudC51cmwpIHx8IHRoaXMucGFyc2VyLmRlZmF1bHRMYW5nO1xuXG4gICAgICBpZiAoY3VycmVudExhbmcgIT09IHByZXZpb3VzTGFuZykge1xuICAgICAgICB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZXMoY3VycmVudExhbmcpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIucmVzZXRDb25maWcodGhpcy5wYXJzZXIucm91dGVzKTtcbiAgICAgICAgICAvLyBGaXJlIHJvdXRlIGNoYW5nZSBldmVudFxuICAgICAgICAgIHRoaXMucm91dGVyRXZlbnRzLm5leHQoY3VycmVudExhbmcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iLCIvKipcbiAqIENvbXBhcmUgaWYgdHdvIG9iamVjdHMgYXJlIHNhbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVxdWFscyhvMTogYW55LCBvMjogYW55KTogYm9vbGVhbiB7XG4gIGlmIChvMSA9PT0gbzIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobzEgPT09IG51bGwgfHwgbzIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG8xICE9PSBvMSAmJiBvMiAhPT0gbzIpIHtcbiAgICByZXR1cm4gdHJ1ZTsgLy8gTmFOID09PSBOYU5cbiAgfVxuICBjb25zdCB0MSA9IHR5cGVvZiBvMSxcbiAgICB0MiA9IHR5cGVvZiBvMjtcbiAgbGV0IGxlbmd0aDogbnVtYmVyLFxuICAgIGtleTogYW55LFxuICAgIGtleVNldDogYW55O1xuXG4gIGlmICh0MSA9PT0gdDIgJiYgdDEgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobzEpKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkobzIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICgobGVuZ3RoID0gbzEubGVuZ3RoKSA9PT0gbzIubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoa2V5ID0gMDsga2V5IDwgbGVuZ3RoOyBrZXkrKykge1xuICAgICAgICAgIGlmICghZXF1YWxzKG8xW2tleV0sIG8yW2tleV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAga2V5U2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIGZvciAoa2V5IGluIG8xKSB7XG4gICAgICAgIGlmIChvMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKCFlcXVhbHMobzFba2V5XSwgbzJba2V5XSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAga2V5U2V0W2tleV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGtleSBpbiBvMikge1xuICAgICAgICBpZiAobzIuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGlmICghKGtleSBpbiBrZXlTZXQpICYmIHR5cGVvZiBvMltrZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsImltcG9ydCB7IFBpcGVUcmFuc2Zvcm0sIFBpcGUsIENoYW5nZURldGVjdG9yUmVmLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2VydmljZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBlcXVhbHMgfSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBWSUVXX0RFU1RST1lFRF9TVEFURSA9IDEyODtcblxuQFBpcGUoe1xuICBuYW1lOiAnbG9jYWxpemUnLFxuICBwdXJlOiBmYWxzZSAvLyByZXF1aXJlZCB0byB1cGRhdGUgdGhlIHZhbHVlIHdoZW4gdGhlIHByb21pc2UgaXMgcmVzb2x2ZWRcbn0pXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nIHwgYW55W10gPSAnJztcbiAgcHJpdmF0ZSBsYXN0S2V5OiBzdHJpbmcgfCBhbnlbXTtcbiAgcHJpdmF0ZSBsYXN0TGFuZ3VhZ2U6IHN0cmluZztcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2NhbGl6ZTogTG9jYWxpemVSb3V0ZXJTZXJ2aWNlLCBwcml2YXRlIF9yZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmxvY2FsaXplLnJvdXRlckV2ZW50cy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2Zvcm0odGhpcy5sYXN0S2V5KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtIGN1cnJlbnQgdXJsIHRvIGxvY2FsaXplZCBvbmVcbiAgICovXG4gIHRyYW5zZm9ybShxdWVyeTogc3RyaW5nIHwgYW55W10pOiBzdHJpbmcgfCBhbnlbXSB7XG4gICAgaWYgKCFxdWVyeSB8fCBxdWVyeS5sZW5ndGggPT09IDAgfHwgIXRoaXMubG9jYWxpemUucGFyc2VyLmN1cnJlbnRMYW5nKSB7XG4gICAgICByZXR1cm4gcXVlcnk7XG4gICAgfVxuICAgIGlmIChlcXVhbHMocXVlcnksIHRoaXMubGFzdEtleSkgJiYgZXF1YWxzKHRoaXMubGFzdExhbmd1YWdlLCB0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZykpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICB0aGlzLmxhc3RLZXkgPSBxdWVyeTtcbiAgICB0aGlzLmxhc3RMYW5ndWFnZSA9IHRoaXMubG9jYWxpemUucGFyc2VyLmN1cnJlbnRMYW5nO1xuXG4gICAgLyoqIHRyYW5zbGF0ZSBrZXkgYW5kIHVwZGF0ZSB2YWx1ZXMgKi9cbiAgICB0aGlzLnZhbHVlID0gdGhpcy5sb2NhbGl6ZS50cmFuc2xhdGVSb3V0ZShxdWVyeSk7XG4gICAgdGhpcy5sYXN0S2V5ID0gcXVlcnk7XG4gICAgLy8gaWYgdmlldyBpcyBhbHJlYWR5IGRlc3Ryb3llZCwgaWdub3JlIGZpcmluZyBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAgaWYgKCg8YW55PiB0aGlzLl9yZWYpLl92aWV3LnN0YXRlICYgVklFV19ERVNUUk9ZRURfU1RBVEUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICB0aGlzLl9yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBST1VURVMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtcbiAgU3lzdGVtSnNOZ01vZHVsZUxvYWRlciwgTmdNb2R1bGVGYWN0b3J5LCBJbmplY3RvcixcbiAgU3lzdGVtSnNOZ01vZHVsZUxvYWRlckNvbmZpZywgT3B0aW9uYWwsIENvbXBpbGVyLCBJbmplY3RhYmxlLCBJbmplY3QsIGZvcndhcmRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhbGl6ZVBhcnNlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBhcnNlcic7XG5cbi8qKlxuICogRXh0ZW5zaW9uIG9mIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIgdG8gZW5hYmxlIGxvY2FsaXphdGlvbiBvZiByb3V0ZSBvbiBsYXp5IGxvYWRcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyQ29uZmlnTG9hZGVyIGV4dGVuZHMgU3lzdGVtSnNOZ01vZHVsZUxvYWRlciB7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IExvY2FsaXplUGFyc2VyKSkgcHJpdmF0ZSBsb2NhbGl6ZTogTG9jYWxpemVQYXJzZXIsXG4gICAgX2NvbXBpbGVyOiBDb21waWxlciwgQE9wdGlvbmFsKCkgY29uZmlnPzogU3lzdGVtSnNOZ01vZHVsZUxvYWRlckNvbmZpZykge1xuICAgICAgc3VwZXIoX2NvbXBpbGVyLCBjb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZCBsb2FkIHdpdGggY3VzdG9tIGZ1bmN0aW9uYWxpdHlcbiAgICovXG4gIGxvYWQocGF0aDogc3RyaW5nKTogUHJvbWlzZTxOZ01vZHVsZUZhY3Rvcnk8YW55Pj4ge1xuICAgIHJldHVybiBzdXBlci5sb2FkKHBhdGgpLnRoZW4oKGZhY3Rvcnk6IE5nTW9kdWxlRmFjdG9yeTxhbnk+KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtb2R1bGVUeXBlOiBmYWN0b3J5Lm1vZHVsZVR5cGUsXG4gICAgICAgIGNyZWF0ZTogKHBhcmVudEluamVjdG9yOiBJbmplY3RvcikgPT4ge1xuICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IGZhY3RvcnkuY3JlYXRlKHBhcmVudEluamVjdG9yKTtcbiAgICAgICAgICBjb25zdCBnZXRNZXRob2QgPSBtb2R1bGUuaW5qZWN0b3IuZ2V0LmJpbmQobW9kdWxlLmluamVjdG9yKTtcblxuICAgICAgICAgIG1vZHVsZS5pbmplY3RvclsnZ2V0J10gPSAodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBnZXRSZXN1bHQgPSBnZXRNZXRob2QodG9rZW4sIG5vdEZvdW5kVmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodG9rZW4gPT09IFJPVVRFUykge1xuICAgICAgICAgICAgICAvLyB0cmFuc2xhdGUgbGF6eSByb3V0ZXNcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxpemUuaW5pdENoaWxkUm91dGVzKFtdLmNvbmNhdCguLi5nZXRSZXN1bHQpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBnZXRSZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycywgQVBQX0lOSVRJQUxJWkVSLCBPcHRpb25hbCwgU2tpcFNlbGYsXG4gIEluamVjdGFibGUsIEluamVjdG9yLCBOZ01vZHVsZUZhY3RvcnlMb2FkZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclNlcnZpY2UgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5zZXJ2aWNlJztcbmltcG9ydCB7IER1bW15TG9jYWxpemVQYXJzZXIsIExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSwgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyUGlwZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBpcGUnO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQUxXQVlTX1NFVF9QUkVGSVgsXG4gIENBQ0hFX01FQ0hBTklTTSwgQ0FDSEVfTkFNRSwgREVGQVVMVF9MQU5HX0ZVTkNUSU9OLCBMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCwgTG9jYWxpemVSb3V0ZXJDb25maWcsIExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gIFJBV19ST1VURVMsXG4gIFVTRV9DQUNIRURfTEFOR1xufSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJDb25maWdMb2FkZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci1jb25maWctbG9hZGVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBhcnNlckluaXRpYWxpemVyIHtcbiAgcGFyc2VyOiBMb2NhbGl6ZVBhcnNlcjtcbiAgcm91dGVzOiBSb3V0ZXM7XG5cbiAgLyoqXG4gICAqIENUT1JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gIH1cblxuICBhcHBJbml0aWFsaXplcigpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlcyA9IHRoaXMucGFyc2VyLmxvYWQodGhpcy5yb3V0ZXMpO1xuICAgIHJlcy50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGxvY2FsaXplOiBMb2NhbGl6ZVJvdXRlclNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChMb2NhbGl6ZVJvdXRlclNlcnZpY2UpO1xuICAgICAgbG9jYWxpemUuaW5pdCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGdlbmVyYXRlSW5pdGlhbGl6ZXIocGFyc2VyOiBMb2NhbGl6ZVBhcnNlciwgcm91dGVzOiBSb3V0ZXNbXSk6ICgpID0+IFByb21pc2U8YW55PiB7XG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZXI7XG4gICAgdGhpcy5yb3V0ZXMgPSByb3V0ZXMucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSk7XG4gICAgcmV0dXJuIHRoaXMuYXBwSW5pdGlhbGl6ZXI7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcEluaXRpYWxpemVyKHA6IFBhcnNlckluaXRpYWxpemVyLCBwYXJzZXI6IExvY2FsaXplUGFyc2VyLCByb3V0ZXM6IFJvdXRlc1tdKTogYW55IHtcbiAgcmV0dXJuIHAuZ2VuZXJhdGVJbml0aWFsaXplcihwYXJzZXIsIHJvdXRlcykuYmluZChwKTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUm91dGVyTW9kdWxlLCBUcmFuc2xhdGVNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtMb2NhbGl6ZVJvdXRlclBpcGVdLFxuICBleHBvcnRzOiBbTG9jYWxpemVSb3V0ZXJQaXBlXVxufSlcbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlck1vZHVsZSB7XG5cbiAgc3RhdGljIGZvclJvb3Qocm91dGVzOiBSb3V0ZXMsIGNvbmZpZzogTG9jYWxpemVSb3V0ZXJDb25maWcgPSB7fSk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTG9jYWxpemVSb3V0ZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IExPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJELFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IHByb3ZpZGVGb3JSb290R3VhcmQsXG4gICAgICAgICAgZGVwczogW1tMb2NhbGl6ZVJvdXRlck1vZHVsZSwgbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpXV1cbiAgICAgICAgfSxcbiAgICAgICAgeyBwcm92aWRlOiBVU0VfQ0FDSEVEX0xBTkcsIHVzZVZhbHVlOiBjb25maWcudXNlQ2FjaGVkTGFuZyB9LFxuICAgICAgICB7IHByb3ZpZGU6IEFMV0FZU19TRVRfUFJFRklYLCB1c2VWYWx1ZTogY29uZmlnLmFsd2F5c1NldFByZWZpeCB9LFxuICAgICAgICB7IHByb3ZpZGU6IENBQ0hFX05BTUUsIHVzZVZhbHVlOiBjb25maWcuY2FjaGVOYW1lIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ0FDSEVfTUVDSEFOSVNNLCB1c2VWYWx1ZTogY29uZmlnLmNhY2hlTWVjaGFuaXNtIH0sXG4gICAgICAgIHsgcHJvdmlkZTogREVGQVVMVF9MQU5HX0ZVTkNUSU9OLCB1c2VWYWx1ZTogY29uZmlnLmRlZmF1bHRMYW5nRnVuY3Rpb24gfSxcbiAgICAgICAgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcbiAgICAgICAgY29uZmlnLnBhcnNlciB8fCB7IHByb3ZpZGU6IExvY2FsaXplUGFyc2VyLCB1c2VDbGFzczogRHVtbXlMb2NhbGl6ZVBhcnNlciB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUkFXX1JPVVRFUyxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIExvY2FsaXplUm91dGVyU2VydmljZSxcbiAgICAgICAgUGFyc2VySW5pdGlhbGl6ZXIsXG4gICAgICAgIHsgcHJvdmlkZTogTmdNb2R1bGVGYWN0b3J5TG9hZGVyLCB1c2VDbGFzczogTG9jYWxpemVSb3V0ZXJDb25maWdMb2FkZXIgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBnZXRBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbUGFyc2VySW5pdGlhbGl6ZXIsIExvY2FsaXplUGFyc2VyLCBSQVdfUk9VVEVTXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmb3JDaGlsZChyb3V0ZXM6IFJvdXRlcyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTG9jYWxpemVSb3V0ZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJBV19ST1VURVMsXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IHJvdXRlc1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUZvclJvb3RHdWFyZChsb2NhbGl6ZVJvdXRlck1vZHVsZTogTG9jYWxpemVSb3V0ZXJNb2R1bGUpOiBzdHJpbmcge1xuICBpZiAobG9jYWxpemVSb3V0ZXJNb2R1bGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgTG9jYWxpemVSb3V0ZXJNb2R1bGUuZm9yUm9vdCgpIGNhbGxlZCB0d2ljZS4gTGF6eSBsb2FkZWQgbW9kdWxlcyBzaG91bGQgdXNlIExvY2FsaXplUm91dGVyTW9kdWxlLmZvckNoaWxkKCkgaW5zdGVhZC5gKTtcbiAgfVxuICByZXR1cm4gJ2d1YXJkZWQnO1xufVxuIl0sIm5hbWVzIjpbInRzbGliXzEuX19leHRlbmRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQU9BLElBQWEsNkJBQTZCLEdBQUcsSUFBSSxjQUFjLENBQXVCLCtCQUErQixDQUFDOzs7OztBQUt0SCxJQUFhLFVBQVUsR0FBNkIsSUFBSSxjQUFjLENBQVcsWUFBWSxDQUFDOzs7Ozs7O0FBVTlGLElBQWlCLGNBQWMsQ0FHOUI7Ozs7QUFIRCxXQUFpQixjQUFjO0lBQ2hCLDJCQUFZLEdBQW1CLGNBQWM7SUFDN0MscUJBQU0sR0FBbUIsUUFBUTtDQUMvQyxFQUhnQixjQUFjLEtBQWQsY0FBYyxRQUc5Qjs7Ozs7QUFLRCxJQUFhLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBVSxpQkFBaUIsQ0FBQzs7Ozs7QUFJN0UsSUFBYSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQWlCLGlCQUFpQixDQUFDOzs7OztBQUlwRixJQUFhLFVBQVUsR0FBRyxJQUFJLGNBQWMsQ0FBUyxZQUFZLENBQUM7Ozs7O0FBV2xFLElBQWEscUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQTBCLHVCQUF1QixDQUFDOzs7OztBQUt6RyxJQUFhLGlCQUFpQixHQUFHLElBQUksY0FBYyxDQUFVLG1CQUFtQixDQUFDOztJQWMzRSxtQkFBbUIsR0FBRywyQkFBMkI7QUFFdkQ7Ozs7SUFJRSxnQ0FDa0MsYUFBNkIsRUFDM0IsZUFBK0IsRUFDakMsY0FBNEQsRUFDakUsU0FBdUMsRUFDNUIsbUJBQXFEO1FBSjNELDhCQUFBLEVBQUEsb0JBQTZCO1FBQzNCLGdDQUFBLEVBQUEsc0JBQStCO1FBQ2pD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