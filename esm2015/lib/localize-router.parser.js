/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { CacheMechanism, LocalizeRouterSettings } from './localize-router.config';
import { Inject } from '@angular/core';
/** @type {?} */
const COOKIE_EXPIRY = 30;
// 1 month
/**
 * Abstract class for parsing localization
 * @abstract
 */
export class LocalizeParser {
    /**
     * Loader constructor
     * @param {?} translate
     * @param {?} location
     * @param {?} settings
     */
    constructor(translate, location, settings) {
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
     * @param {?} routes
     * @return {?}
     */
    init(routes) {
        /** @type {?} */
        let selectedLanguage;
        // this.initRoutes(routes);
        this.routes = routes;
        if (!this.locales || !this.locales.length) {
            return Promise.resolve();
        }
        /**
         * detect current language
         * @type {?}
         */
        const locationLang = this.getLocationLang();
        /** @type {?} */
        const browserLang = this._getBrowserLang();
        if (this.settings.defaultLangFunction) {
            this.defaultLang = this.settings.defaultLangFunction(this.locales, this._cachedLang, browserLang);
        }
        else {
            this.defaultLang = this._cachedLang || browserLang || this.locales[0];
        }
        selectedLanguage = locationLang || this.defaultLang;
        this.translate.setDefaultLang(this.defaultLang);
        /** @type {?} */
        let children = [];
        /** if set prefix is enforced */
        if (this.settings.alwaysSetPrefix) {
            /** @type {?} */
            const baseRoute = { path: '', redirectTo: this.defaultLang, pathMatch: 'full' };
            /**
             * extract potential wildcard route
             * @type {?}
             */
            const wildcardIndex = routes.findIndex((route) => route.path === '**');
            if (wildcardIndex !== -1) {
                this._wildcardRoute = routes.splice(wildcardIndex, 1)[0];
            }
            children = this.routes.splice(0, this.routes.length, baseRoute);
        }
        else {
            children = [...this.routes]; // shallow copy of routes
        }
        /** exclude certain routes */
        for (let i = children.length - 1; i >= 0; i--) {
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
        const res = this.translateRoutes(selectedLanguage);
        return res.toPromise();
    }
    /**
     * @param {?} routes
     * @return {?}
     */
    initChildRoutes(routes) {
        this._translateRouteTree(routes);
        return routes;
    }
    /**
     * Translate routes to selected language
     * @param {?} language
     * @return {?}
     */
    translateRoutes(language) {
        return new Observable((observer) => {
            this._cachedLang = language;
            if (this._languageRoute) {
                this._languageRoute.path = language;
            }
            this.translate.use(language).subscribe((translations) => {
                this._translationObject = translations;
                this.currentLang = language;
                if (this._languageRoute) {
                    if (this._languageRoute) {
                        this._translateRouteTree(this._languageRoute.children);
                    }
                    // if there is wildcard route
                    if (this._wildcardRoute && this._wildcardRoute.redirectTo) {
                        this._translateProperty(this._wildcardRoute, 'redirectTo', true);
                    }
                }
                else {
                    this._translateRouteTree(this.routes);
                }
                observer.next(void 0);
                observer.complete();
            });
        });
    }
    /**
     * Translate the route node and recursively call for all it's children
     * @param {?} routes
     * @return {?}
     */
    _translateRouteTree(routes) {
        routes.forEach((route) => {
            if (route.path && route.path !== '**') {
                this._translateProperty(route, 'path');
            }
            if (route.redirectTo) {
                this._translateProperty(route, 'redirectTo', !route.redirectTo.indexOf('/'));
            }
            if (route.children) {
                this._translateRouteTree(route.children);
            }
            if (route.loadChildren && ((/** @type {?} */ (route)))._loadedConfig) {
                this._translateRouteTree(((/** @type {?} */ (route)))._loadedConfig.routes);
            }
        });
    }
    /**
     * Translate property
     * If first time translation then add original to route data object
     * @param {?} route
     * @param {?} property
     * @param {?=} prefixLang
     * @return {?}
     */
    _translateProperty(route, property, prefixLang) {
        // set property to data if not there yet
        /** @type {?} */
        const routeData = route.data = route.data || {};
        if (!routeData.localizeRouter) {
            routeData.localizeRouter = {};
        }
        if (!routeData.localizeRouter[property]) {
            routeData.localizeRouter[property] = ((/** @type {?} */ (route)))[property];
        }
        /** @type {?} */
        const result = this.translateRoute(routeData.localizeRouter[property]);
        ((/** @type {?} */ (route)))[property] = prefixLang ? `/${this.urlPrefix}${result}` : result;
    }
    /**
     * @return {?}
     */
    get urlPrefix() {
        return this.settings.alwaysSetPrefix || this.currentLang !== this.defaultLang ? this.currentLang : '';
    }
    /**
     * Translate route and return observable
     * @param {?} path
     * @return {?}
     */
    translateRoute(path) {
        /** @type {?} */
        const queryParts = path.split('?');
        if (queryParts.length > 2) {
            throw Error('There should be only one query parameter block in the URL');
        }
        /** @type {?} */
        const pathSegments = queryParts[0].split('/');
        /** collect observables  */
        return pathSegments
            .map((part) => part.length ? this.translateText(part) : part)
            .join('/') +
            (queryParts.length > 1 ? `?${queryParts[1]}` : '');
    }
    /**
     * Get language from url
     * @param {?=} url
     * @return {?}
     */
    getLocationLang(url) {
        /** @type {?} */
        const queryParamSplit = (url || this.location.path()).split('?');
        /** @type {?} */
        let pathSlices = [];
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
    }
    /**
     * Get user's language set in the browser
     * @return {?}
     */
    _getBrowserLang() {
        return this._returnIfInLocales(this.translate.getBrowserLang());
    }
    /**
     * Get language from local storage or cookie
     * @return {?}
     */
    get _cachedLang() {
        if (!this.settings.useCachedLang) {
            return;
        }
        if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
            return this._cacheWithLocalStorage();
        }
        if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
            return this._cacheWithCookies();
        }
    }
    /**
     * Save language to local storage or cookie
     * @param {?} value
     * @return {?}
     */
    set _cachedLang(value) {
        if (!this.settings.useCachedLang) {
            return;
        }
        if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
            this._cacheWithLocalStorage(value);
        }
        if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
            this._cacheWithCookies(value);
        }
    }
    /**
     * Cache value to local storage
     * @param {?=} value
     * @return {?}
     */
    _cacheWithLocalStorage(value) {
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
    }
    /**
     * Cache value via cookies
     * @param {?=} value
     * @return {?}
     */
    _cacheWithCookies(value) {
        if (typeof document === 'undefined' || typeof document.cookie === 'undefined') {
            return;
        }
        try {
            /** @type {?} */
            const name = encodeURIComponent(this.settings.cacheName);
            if (value) {
                /** @type {?} */
                const d = new Date();
                d.setTime(d.getTime() + COOKIE_EXPIRY * 86400000); // * days
                document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()}`;
                return;
            }
            /** @type {?} */
            const regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
            /** @type {?} */
            const result = regexp.exec(document.cookie);
            return decodeURIComponent(result[1]);
        }
        catch (e) {
            return; // should not happen but better safe than sorry
        }
    }
    /**
     * Check if value exists in locales list
     * @param {?} value
     * @return {?}
     */
    _returnIfInLocales(value) {
        if (value && this.locales.indexOf(value) !== -1) {
            return value;
        }
        return null;
    }
    /**
     * Get translated value
     * @param {?} key
     * @return {?}
     */
    translateText(key) {
        if (!this._translationObject) {
            return key;
        }
        /** @type {?} */
        const fullKey = this.prefix + key;
        /** @type {?} */
        const res = this.translate.getParsedResult(this._translationObject, fullKey);
        return res !== fullKey ? res : key;
    }
}
LocalizeParser.ctorParameters = () => [
    { type: TranslateService, decorators: [{ type: Inject, args: [TranslateService,] }] },
    { type: Location, decorators: [{ type: Inject, args: [Location,] }] },
    { type: LocalizeRouterSettings, decorators: [{ type: Inject, args: [LocalizeRouterSettings,] }] }
];
if (false) {
    /** @type {?} */
    LocalizeParser.prototype.locales;
    /** @type {?} */
    LocalizeParser.prototype.currentLang;
    /** @type {?} */
    LocalizeParser.prototype.routes;
    /** @type {?} */
    LocalizeParser.prototype.defaultLang;
    /** @type {?} */
    LocalizeParser.prototype.prefix;
    /** @type {?} */
    LocalizeParser.prototype._translationObject;
    /** @type {?} */
    LocalizeParser.prototype._wildcardRoute;
    /** @type {?} */
    LocalizeParser.prototype._languageRoute;
    /** @type {?} */
    LocalizeParser.prototype.translate;
    /** @type {?} */
    LocalizeParser.prototype.location;
    /** @type {?} */
    LocalizeParser.prototype.settings;
    /**
     * Load routes and fetch necessary data
     * @abstract
     * @param {?} routes
     * @return {?}
     */
    LocalizeParser.prototype.load = function (routes) { };
}
/**
 * Manually set configuration
 */
export class ManualParserLoader extends LocalizeParser {
    /**
     * CTOR
     * @param {?} translate
     * @param {?} location
     * @param {?} settings
     * @param {?=} locales
     * @param {?=} prefix
     */
    constructor(translate, location, settings, locales = ['en'], prefix = 'ROUTES.') {
        super(translate, location, settings);
        this.locales = locales;
        this.prefix = prefix || '';
    }
    /**
     * Initialize or append routes
     * @param {?} routes
     * @return {?}
     */
    load(routes) {
        return new Promise((resolve) => {
            this.init(routes).then(resolve);
        });
    }
}
export class DummyLocalizeParser extends LocalizeParser {
    /**
     * @param {?} routes
     * @return {?}
     */
    load(routes) {
        return new Promise((resolve) => {
            this.init(routes).then(resolve);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyLyIsInNvdXJjZXMiOlsibGliL2xvY2FsaXplLXJvdXRlci5wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxVQUFVLEVBQVksTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOztNQUVqQyxhQUFhLEdBQUcsRUFBRTs7Ozs7O0FBS3hCLE1BQU07Ozs7Ozs7SUFlSixZQUE4QyxTQUEyQixFQUM3QyxRQUFrQixFQUNKLFFBQWdDO1FBRjVCLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzdDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDSixhQUFRLEdBQVIsUUFBUSxDQUF3QjtJQUMxRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNEJTLElBQUksQ0FBQyxNQUFjOztZQUN2QixnQkFBd0I7UUFFNUIsMkJBQTJCO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNCLENBQUM7Ozs7O2NBRUssWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUU7O2NBQ3JDLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFO1FBRTFDLEVB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QUksQ0FBQyxFQUFFLFNBQWlCLFNBQVM7UUFDdEQsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDO0lBQzdCLENBQUM7Ozs7OztJQUtELElBQUksQ0FBQyxNQUFjO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQVksRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSwwQkFBMkIsU0FBUSxjQUFjOzs7OztJQUNyRCxJQUFJLENBQUMsTUFBYztRQUNqQixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlcywgUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENhY2hlTWVjaGFuaXNtLCBMb2NhbGl6ZVJvdXRlclNldHRpbmdzIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuY29uZmlnJztcbmltcG9ydCB7IEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5jb25zdCBDT09LSUVfRVhQSVJZID0gMzA7IC8vIDEgbW9udGhcblxuLyoqXG4gKiBBYnN0cmFjdCBjbGFzcyBmb3IgcGFyc2luZyBsb2NhbGl6YXRpb25cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIExvY2FsaXplUGFyc2VyIHtcbiAgbG9jYWxlczogQXJyYXk8c3RyaW5nPjtcbiAgY3VycmVudExhbmc6IHN0cmluZztcbiAgcm91dGVzOiBSb3V0ZXM7XG4gIGRlZmF1bHRMYW5nOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIHByZWZpeDogc3RyaW5nO1xuXG4gIHByaXZhdGUgX3RyYW5zbGF0aW9uT2JqZWN0OiBhbnk7XG4gIHByaXZhdGUgX3dpbGRjYXJkUm91dGU6IFJvdXRlO1xuICBwcml2YXRlIF9sYW5ndWFnZVJvdXRlOiBSb3V0ZTtcblxuICAvKipcbiAgICogTG9hZGVyIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KFRyYW5zbGF0ZVNlcnZpY2UpIHByaXZhdGUgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxuICAgIEBJbmplY3QoTG9jYXRpb24pIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLFxuICAgIEBJbmplY3QoTG9jYWxpemVSb3V0ZXJTZXR0aW5ncykgcHJpdmF0ZSBzZXR0aW5nczogTG9jYWxpemVSb3V0ZXJTZXR0aW5ncykge1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgcm91dGVzIGFuZCBmZXRjaCBuZWNlc3NhcnkgZGF0YVxuICAgKi9cbiAgYWJzdHJhY3QgbG9hZChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PjtcblxuICAvKipcbiAqIFByZXBhcmUgcm91dGVzIHRvIGJlIGZ1bGx5IHVzYWJsZSBieSBuZ3gtdHJhbnNsYXRlLXJvdXRlclxuICogQHBhcmFtIHJvdXRlc1xuICovXG4gIC8qIHByaXZhdGUgaW5pdFJvdXRlcyhyb3V0ZXM6IFJvdXRlcywgcHJlZml4ID0gJycpIHtcbiAgICByb3V0ZXMuZm9yRWFjaChyb3V0ZSA9PiB7XG4gICAgICBpZiAocm91dGUucGF0aCAhPT0gJyoqJykge1xuICAgICAgICBjb25zdCByb3V0ZURhdGE6IGFueSA9IHJvdXRlLmRhdGEgPSByb3V0ZS5kYXRhIHx8IHt9O1xuICAgICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIgPSB7fTtcbiAgICAgICAgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyLmZ1bGxQYXRoID0gYCR7cHJlZml4fS8ke3JvdXRlLnBhdGh9YDtcbiAgICAgICAgaWYgKHJvdXRlLmNoaWxkcmVuICYmIHJvdXRlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmluaXRSb3V0ZXMocm91dGUuY2hpbGRyZW4sIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlci5mdWxsUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSAqL1xuXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbGFuZ3VhZ2UgYW5kIHJvdXRlc1xuICAgKi9cbiAgcHJvdGVjdGVkIGluaXQocm91dGVzOiBSb3V0ZXMpOiBQcm9taXNlPGFueT4ge1xuICAgIGxldCBzZWxlY3RlZExhbmd1YWdlOiBzdHJpbmc7XG5cbiAgICAvLyB0aGlzLmluaXRSb3V0ZXMocm91dGVzKTtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcztcblxuICAgIGlmICghdGhpcy5sb2NhbGVzIHx8ICF0aGlzLmxvY2FsZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIC8qKiBkZXRlY3QgY3VycmVudCBsYW5ndWFnZSAqL1xuICAgIGNvbnN0IGxvY2F0aW9uTGFuZyA9IHRoaXMuZ2V0TG9jYXRpb25MYW5nKCk7XG4gICAgY29uc3QgYnJvd3NlckxhbmcgPSB0aGlzLl9nZXRCcm93c2VyTGFuZygpO1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVmYXVsdExhbmdGdW5jdGlvbikge1xuICAgICAgdGhpcy5kZWZhdWx0TGFuZyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdExhbmdGdW5jdGlvbih0aGlzLmxvY2FsZXMsIHRoaXMuX2NhY2hlZExhbmcsIGJyb3dzZXJMYW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWZhdWx0TGFuZyA9IHRoaXMuX2NhY2hlZExhbmcgfHwgYnJvd3NlckxhbmcgfHwgdGhpcy5sb2NhbGVzWzBdO1xuICAgIH1cbiAgICBzZWxlY3RlZExhbmd1YWdlID0gbG9jYXRpb25MYW5nIHx8IHRoaXMuZGVmYXVsdExhbmc7XG4gICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcodGhpcy5kZWZhdWx0TGFuZyk7XG5cbiAgICBsZXQgY2hpbGRyZW46IFJvdXRlcyA9IFtdO1xuICAgIC8qKiBpZiBzZXQgcHJlZml4IGlzIGVuZm9yY2VkICovXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICBjb25zdCBiYXNlUm91dGUgPSB7IHBhdGg6ICcnLCByZWRpcmVjdFRvOiB0aGlzLmRlZmF1bHRMYW5nLCBwYXRoTWF0Y2g6ICdmdWxsJyB9O1xuXG4gICAgICAvKiogZXh0cmFjdCBwb3RlbnRpYWwgd2lsZGNhcmQgcm91dGUgKi9cbiAgICAgIGNvbnN0IHdpbGRjYXJkSW5kZXggPSByb3V0ZXMuZmluZEluZGV4KChyb3V0ZTogUm91dGUpID0+IHJvdXRlLnBhdGggPT09ICcqKicpO1xuICAgICAgaWYgKHdpbGRjYXJkSW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMuX3dpbGRjYXJkUm91dGUgPSByb3V0ZXMuc3BsaWNlKHdpbGRjYXJkSW5kZXgsIDEpWzBdO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4gPSB0aGlzLnJvdXRlcy5zcGxpY2UoMCwgdGhpcy5yb3V0ZXMubGVuZ3RoLCBiYXNlUm91dGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZHJlbiA9IFsuLi50aGlzLnJvdXRlc107IC8vIHNoYWxsb3cgY29weSBvZiByb3V0ZXNcbiAgICB9XG5cbiAgICAvKiogZXhjbHVkZSBjZXJ0YWluIHJvdXRlcyAqL1xuICAgIGZvciAobGV0IGkgPSBjaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKGNoaWxkcmVuW2ldLmRhdGEgJiYgY2hpbGRyZW5baV0uZGF0YVsnc2tpcFJvdXRlTG9jYWxpemF0aW9uJ10pIHtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICAgICAgLy8gYWRkIGRpcmVjdGx5IHRvIHJvdXRlc1xuICAgICAgICAgIHRoaXMucm91dGVzLnB1c2goY2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogYXBwZW5kIGNoaWxkcmVuIHJvdXRlcyAqL1xuICAgIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmxvY2FsZXMubGVuZ3RoID4gMSB8fCB0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgICB0aGlzLl9sYW5ndWFnZVJvdXRlID0geyBjaGlsZHJlbjogY2hpbGRyZW4gfTtcbiAgICAgICAgdGhpcy5yb3V0ZXMudW5zaGlmdCh0aGlzLl9sYW5ndWFnZVJvdXRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogLi4uYW5kIHBvdGVudGlhbCB3aWxkY2FyZCByb3V0ZSAqL1xuICAgIGlmICh0aGlzLl93aWxkY2FyZFJvdXRlICYmIHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICB0aGlzLnJvdXRlcy5wdXNoKHRoaXMuX3dpbGRjYXJkUm91dGUpO1xuICAgIH1cblxuICAgIC8qKiB0cmFuc2xhdGUgcm91dGVzICovXG4gICAgY29uc3QgcmVzID0gdGhpcy50cmFuc2xhdGVSb3V0ZXMoc2VsZWN0ZWRMYW5ndWFnZSk7XG4gICAgcmV0dXJuIHJlcy50b1Byb21pc2UoKTtcbiAgfVxuXG4gIGluaXRDaGlsZFJvdXRlcyhyb3V0ZXM6IFJvdXRlcykge1xuICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZShyb3V0ZXMpO1xuICAgIHJldHVybiByb3V0ZXM7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHJvdXRlcyB0byBzZWxlY3RlZCBsYW5ndWFnZVxuICAgKi9cbiAgdHJhbnNsYXRlUm91dGVzKGxhbmd1YWdlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxhbnk+KChvYnNlcnZlcjogT2JzZXJ2ZXI8YW55PikgPT4ge1xuICAgICAgdGhpcy5fY2FjaGVkTGFuZyA9IGxhbmd1YWdlO1xuICAgICAgaWYgKHRoaXMuX2xhbmd1YWdlUm91dGUpIHtcbiAgICAgICAgdGhpcy5fbGFuZ3VhZ2VSb3V0ZS5wYXRoID0gbGFuZ3VhZ2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJhbnNsYXRlLnVzZShsYW5ndWFnZSkuc3Vic2NyaWJlKCh0cmFuc2xhdGlvbnM6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk9iamVjdCA9IHRyYW5zbGF0aW9ucztcbiAgICAgICAgdGhpcy5jdXJyZW50TGFuZyA9IGxhbmd1YWdlO1xuXG4gICAgICAgIGlmICh0aGlzLl9sYW5ndWFnZVJvdXRlKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2xhbmd1YWdlUm91dGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZSh0aGlzLl9sYW5ndWFnZVJvdXRlLmNoaWxkcmVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gaWYgdGhlcmUgaXMgd2lsZGNhcmQgcm91dGVcbiAgICAgICAgICBpZiAodGhpcy5fd2lsZGNhcmRSb3V0ZSAmJiB0aGlzLl93aWxkY2FyZFJvdXRlLnJlZGlyZWN0VG8pIHtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zbGF0ZVByb3BlcnR5KHRoaXMuX3dpbGRjYXJkUm91dGUsICdyZWRpcmVjdFRvJywgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZSh0aGlzLnJvdXRlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBvYnNlcnZlci5uZXh0KHZvaWQgMCk7XG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgdGhlIHJvdXRlIG5vZGUgYW5kIHJlY3Vyc2l2ZWx5IGNhbGwgZm9yIGFsbCBpdCdzIGNoaWxkcmVuXG4gICAqL1xuICBwcml2YXRlIF90cmFuc2xhdGVSb3V0ZVRyZWUocm91dGVzOiBSb3V0ZXMpOiB2b2lkIHtcbiAgICByb3V0ZXMuZm9yRWFjaCgocm91dGU6IFJvdXRlKSA9PiB7XG4gICAgICBpZiAocm91dGUucGF0aCAmJiByb3V0ZS5wYXRoICE9PSAnKionKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVByb3BlcnR5KHJvdXRlLCAncGF0aCcpO1xuICAgICAgfVxuICAgICAgaWYgKHJvdXRlLnJlZGlyZWN0VG8pIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRlUHJvcGVydHkocm91dGUsICdyZWRpcmVjdFRvJywgIXJvdXRlLnJlZGlyZWN0VG8uaW5kZXhPZignLycpKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3V0ZS5jaGlsZHJlbikge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUocm91dGUuY2hpbGRyZW4pO1xuICAgICAgfVxuICAgICAgaWYgKHJvdXRlLmxvYWRDaGlsZHJlbiAmJiAoPGFueT5yb3V0ZSkuX2xvYWRlZENvbmZpZykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUoKDxhbnk+cm91dGUpLl9sb2FkZWRDb25maWcucm91dGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcHJvcGVydHlcbiAgICogSWYgZmlyc3QgdGltZSB0cmFuc2xhdGlvbiB0aGVuIGFkZCBvcmlnaW5hbCB0byByb3V0ZSBkYXRhIG9iamVjdFxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhbnNsYXRlUHJvcGVydHkocm91dGU6IFJvdXRlLCBwcm9wZXJ0eTogc3RyaW5nLCBwcmVmaXhMYW5nPzogYm9vbGVhbik6IHZvaWQge1xuICAgIC8vIHNldCBwcm9wZXJ0eSB0byBkYXRhIGlmIG5vdCB0aGVyZSB5ZXRcbiAgICBjb25zdCByb3V0ZURhdGE6IGFueSA9IHJvdXRlLmRhdGEgPSByb3V0ZS5kYXRhIHx8IHt9O1xuICAgIGlmICghcm91dGVEYXRhLmxvY2FsaXplUm91dGVyKSB7XG4gICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFyb3V0ZURhdGEubG9jYWxpemVSb3V0ZXJbcHJvcGVydHldKSB7XG4gICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXJbcHJvcGVydHldID0gKDxhbnk+cm91dGUpW3Byb3BlcnR5XTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRyYW5zbGF0ZVJvdXRlKHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcltwcm9wZXJ0eV0pO1xuICAgICg8YW55PnJvdXRlKVtwcm9wZXJ0eV0gPSBwcmVmaXhMYW5nID8gYC8ke3RoaXMudXJsUHJlZml4fSR7cmVzdWx0fWAgOiByZXN1bHQ7XG4gIH1cblxuICBnZXQgdXJsUHJlZml4KCkge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCB8fCB0aGlzLmN1cnJlbnRMYW5nICE9PSB0aGlzLmRlZmF1bHRMYW5nID8gdGhpcy5jdXJyZW50TGFuZyA6ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSByb3V0ZSBhbmQgcmV0dXJuIG9ic2VydmFibGVcbiAgICovXG4gIHRyYW5zbGF0ZVJvdXRlKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlQYXJ0cyA9IHBhdGguc3BsaXQoJz8nKTtcbiAgICBpZiAocXVlcnlQYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhlcmUgc2hvdWxkIGJlIG9ubHkgb25lIHF1ZXJ5IHBhcmFtZXRlciBibG9jayBpbiB0aGUgVVJMJyk7XG4gICAgfVxuICAgIGNvbnN0IHBhdGhTZWdtZW50cyA9IHF1ZXJ5UGFydHNbMF0uc3BsaXQoJy8nKTtcblxuICAgIC8qKiBjb2xsZWN0IG9ic2VydmFibGVzICAqL1xuICAgIHJldHVybiBwYXRoU2VnbWVudHNcbiAgICAgIC5tYXAoKHBhcnQ6IHN0cmluZykgPT4gcGFydC5sZW5ndGggPyB0aGlzLnRyYW5zbGF0ZVRleHQocGFydCkgOiBwYXJ0KVxuICAgICAgLmpvaW4oJy8nKSArXG4gICAgICAocXVlcnlQYXJ0cy5sZW5ndGggPiAxID8gYD8ke3F1ZXJ5UGFydHNbMV19YCA6ICcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbGFuZ3VhZ2UgZnJvbSB1cmxcbiAgICovXG4gIGdldExvY2F0aW9uTGFuZyh1cmw/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHF1ZXJ5UGFyYW1TcGxpdCA9ICh1cmwgfHwgdGhpcy5sb2NhdGlvbi5wYXRoKCkpLnNwbGl0KCc/Jyk7XG4gICAgbGV0IHBhdGhTbGljZXM6IHN0cmluZ1tdID0gW107XG4gICAgaWYgKHF1ZXJ5UGFyYW1TcGxpdC5sZW5ndGggPiAwKSB7XG4gICAgICBwYXRoU2xpY2VzID0gcXVlcnlQYXJhbVNwbGl0WzBdLnNwbGl0KCcvJyk7XG4gICAgfVxuICAgIGlmIChwYXRoU2xpY2VzLmxlbmd0aCA+IDEgJiYgdGhpcy5sb2NhbGVzLmluZGV4T2YocGF0aFNsaWNlc1sxXSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gcGF0aFNsaWNlc1sxXTtcbiAgICB9XG4gICAgaWYgKHBhdGhTbGljZXMubGVuZ3RoICYmIHRoaXMubG9jYWxlcy5pbmRleE9mKHBhdGhTbGljZXNbMF0pICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHBhdGhTbGljZXNbMF07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB1c2VyJ3MgbGFuZ3VhZ2Ugc2V0IGluIHRoZSBicm93c2VyXG4gICAqL1xuICBwcml2YXRlIF9nZXRCcm93c2VyTGFuZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yZXR1cm5JZkluTG9jYWxlcyh0aGlzLnRyYW5zbGF0ZS5nZXRCcm93c2VyTGFuZygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbGFuZ3VhZ2UgZnJvbSBsb2NhbCBzdG9yYWdlIG9yIGNvb2tpZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgX2NhY2hlZExhbmcoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MudXNlQ2FjaGVkTGFuZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWNoZU1lY2hhbmlzbSA9PT0gQ2FjaGVNZWNoYW5pc20uTG9jYWxTdG9yYWdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVXaXRoTG9jYWxTdG9yYWdlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Db29raWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVdpdGhDb29raWVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgbGFuZ3VhZ2UgdG8gbG9jYWwgc3RvcmFnZSBvciBjb29raWVcbiAgICovXG4gIHByaXZhdGUgc2V0IF9jYWNoZWRMYW5nKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MudXNlQ2FjaGVkTGFuZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWNoZU1lY2hhbmlzbSA9PT0gQ2FjaGVNZWNoYW5pc20uTG9jYWxTdG9yYWdlKSB7XG4gICAgICB0aGlzLl9jYWNoZVdpdGhMb2NhbFN0b3JhZ2UodmFsdWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWNoZU1lY2hhbmlzbSA9PT0gQ2FjaGVNZWNoYW5pc20uQ29va2llKSB7XG4gICAgICB0aGlzLl9jYWNoZVdpdGhDb29raWVzKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FjaGUgdmFsdWUgdG8gbG9jYWwgc3RvcmFnZVxuICAgKi9cbiAgcHJpdmF0ZSBfY2FjaGVXaXRoTG9jYWxTdG9yYWdlKHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuc2V0dGluZ3MuY2FjaGVOYW1lLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9yZXR1cm5JZkluTG9jYWxlcyh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5zZXR0aW5ncy5jYWNoZU5hbWUpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyB3ZWlyZCBTYWZhcmkgaXNzdWUgaW4gcHJpdmF0ZSBtb2RlLCB3aGVyZSBMb2NhbFN0b3JhZ2UgaXMgZGVmaW5lZCBidXQgdGhyb3dzIGVycm9yIG9uIGFjY2Vzc1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZSB2YWx1ZSB2aWEgY29va2llc1xuICAgKi9cbiAgcHJpdmF0ZSBfY2FjaGVXaXRoQ29va2llcyh2YWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGRvY3VtZW50LmNvb2tpZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQodGhpcy5zZXR0aW5ncy5jYWNoZU5hbWUpO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGQ6IERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyBDT09LSUVfRVhQSVJZICogODY0MDAwMDApOyAvLyAqIGRheXNcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gYCR7bmFtZX09JHtlbmNvZGVVUklDb21wb25lbnQodmFsdWUpfTtleHBpcmVzPSR7ZC50b1VUQ1N0cmluZygpfWA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoJyg/Ol4nICsgbmFtZSArICd8O1xcXFxzKicgKyBuYW1lICsgJyk9KC4qPykoPzo7fCQpJywgJ2cnKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZ2V4cC5leGVjKGRvY3VtZW50LmNvb2tpZSk7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdFsxXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuOyAvLyBzaG91bGQgbm90IGhhcHBlbiBidXQgYmV0dGVyIHNhZmUgdGhhbiBzb3JyeVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB2YWx1ZSBleGlzdHMgaW4gbG9jYWxlcyBsaXN0XG4gICAqL1xuICBwcml2YXRlIF9yZXR1cm5JZkluTG9jYWxlcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodmFsdWUgJiYgdGhpcy5sb2NhbGVzLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdHJhbnNsYXRlZCB2YWx1ZVxuICAgKi9cbiAgcHJpdmF0ZSB0cmFuc2xhdGVUZXh0KGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuX3RyYW5zbGF0aW9uT2JqZWN0KSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgICBjb25zdCBmdWxsS2V5ID0gdGhpcy5wcmVmaXggKyBrZXk7XG4gICAgY29uc3QgcmVzID0gdGhpcy50cmFuc2xhdGUuZ2V0UGFyc2VkUmVzdWx0KHRoaXMuX3RyYW5zbGF0aW9uT2JqZWN0LCBmdWxsS2V5KTtcbiAgICByZXR1cm4gcmVzICE9PSBmdWxsS2V5ID8gcmVzIDoga2V5O1xuICB9XG59XG5cbi8qKlxuICogTWFudWFsbHkgc2V0IGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIE1hbnVhbFBhcnNlckxvYWRlciBleHRlbmRzIExvY2FsaXplUGFyc2VyIHtcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IodHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLCBsb2NhdGlvbjogTG9jYXRpb24sIHNldHRpbmdzOiBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICAgIGxvY2FsZXM6IHN0cmluZ1tdID0gWydlbiddLCBwcmVmaXg6IHN0cmluZyA9ICdST1VURVMuJykge1xuICAgIHN1cGVyKHRyYW5zbGF0ZSwgbG9jYXRpb24sIHNldHRpbmdzKTtcbiAgICB0aGlzLmxvY2FsZXMgPSBsb2NhbGVzO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4IHx8ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgb3IgYXBwZW5kIHJvdXRlc1xuICAgKi9cbiAgbG9hZChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuaW5pdChyb3V0ZXMpLnRoZW4ocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIER1bW15TG9jYWxpemVQYXJzZXIgZXh0ZW5kcyBMb2NhbGl6ZVBhcnNlciB7XG4gIGxvYWQocm91dGVzOiBSb3V0ZXMpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55KSA9PiB7XG4gICAgICB0aGlzLmluaXQocm91dGVzKS50aGVuKHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=