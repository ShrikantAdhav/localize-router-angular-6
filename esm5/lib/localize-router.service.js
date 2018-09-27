/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Inject } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { LocalizeParser } from './localize-router.parser';
import { LocalizeRouterSettings } from './localize-router.config';
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
            var _b = tslib_1.__read(_a, 2), previousEvent = _b[0], currentEvent = _b[1];
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
export { LocalizeRouterService };
if (false) {
    /** @type {?} */
    LocalizeRouterService.prototype.routerEvents;
    /** @type {?} */
    LocalizeRouterService.prototype.parser;
    /** @type {?} */
    LocalizeRouterService.prototype.settings;
    /** @type {?} */
    LocalizeRouterService.prototype.router;
    /** @type {?} */
    LocalizeRouterService.prototype.route;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci8iLCJzb3VyY2VzIjpbImxpYi9sb2NhbGl6ZS1yb3V0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQXdELGNBQWMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2hJLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7Ozs7O0FBTWxFO0lBR0U7O09BRUc7SUFDSCwrQkFDbUMsTUFBc0IsRUFDZCxRQUFnQyxFQUMvQyxNQUFjLEVBQ04sS0FBcUI7UUFIdEIsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUF3QjtRQUMvQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ04sVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFFckQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO0lBQzlDLENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCxvQ0FBSTs7OztJQUFKO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1Qyw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2FBQ2YsSUFBSSxDQUNILE1BQU0sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssWUFBWSxlQUFl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LENBQUMsSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7WUFFNUYsRUFBRSxDQUFDLENBQUMsV0FBVyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLEtBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQztvQkFDakQsS0FBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDNUMsMEJBQTBCO29CQUMxQixLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQzs7Z0JBakxNLGNBQWMsdUJBY2hCLE1BQU0sU0FBQyxjQUFjO2dCQWJuQixzQkFBc0IsdUJBY3hCLE1BQU0sU0FBQyxzQkFBc0I7Z0JBbkIzQixNQUFNLHVCQW9CUixNQUFNLFNBQUMsTUFBTTtnQkFwQm9FLGNBQWMsdUJBcUIvRixNQUFNLFNBQUMsY0FBYzs7SUFpSzVCLDRCQUFDO0NBQUEsQUEzS0QsSUEyS0M7U0EzS1kscUJBQXFCOzs7SUFDaEMsNkNBQThCOztJQU0xQix1Q0FBcUQ7O0lBQ3JELHlDQUF1RTs7SUFDdkUsdUNBQXNDOztJQUN0QyxzQ0FBcUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBOYXZpZ2F0aW9uRXh0cmFzLCBVcmxTZWdtZW50LCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIHBhaXJ3aXNlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBMb2NhbGl6ZVBhcnNlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBhcnNlcic7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclNldHRpbmdzIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuY29uZmlnJztcblxuLyoqXG4gKiBMb2NhbGl6YXRpb24gc2VydmljZVxuICogbW9kaWZ5Um91dGVzXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlclNlcnZpY2Uge1xuICByb3V0ZXJFdmVudHM6IFN1YmplY3Q8c3RyaW5nPjtcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBASW5qZWN0KExvY2FsaXplUGFyc2VyKSBwdWJsaWMgcGFyc2VyOiBMb2NhbGl6ZVBhcnNlcixcbiAgICAgIEBJbmplY3QoTG9jYWxpemVSb3V0ZXJTZXR0aW5ncykgcHVibGljIHNldHRpbmdzOiBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICAgICAgQEluamVjdChSb3V0ZXIpIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICBASW5qZWN0KEFjdGl2YXRlZFJvdXRlKSBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVxuICAgICkge1xuICAgICAgdGhpcy5yb3V0ZXJFdmVudHMgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdXAgdGhlIHNlcnZpY2VcbiAgICovXG4gIGluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5yb3V0ZXIucmVzZXRDb25maWcodGhpcy5wYXJzZXIucm91dGVzKTtcbiAgICAvLyBzdWJzY3JpYmUgdG8gcm91dGVyIGV2ZW50c1xuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcihldmVudCA9PiBldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCksXG4gICAgICAgIHBhaXJ3aXNlKClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUodGhpcy5fcm91dGVDaGFuZ2VkKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSBsYW5ndWFnZSBhbmQgbmF2aWdhdGUgdG8gdHJhbnNsYXRlZCByb3V0ZVxuICAgKi9cbiAgY2hhbmdlTGFuZ3VhZ2UobGFuZzogc3RyaW5nLCBleHRyYXM/OiBOYXZpZ2F0aW9uRXh0cmFzLCB1c2VOYXZpZ2F0ZU1ldGhvZD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb3V0ZSkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5yb3V0ZSk7XG4gICAgfVxuICAgIGlmIChsYW5nICE9PSB0aGlzLnBhcnNlci5jdXJyZW50TGFuZykge1xuICAgICAgY29uc3Qgcm9vdFNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90ID0gdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3Qucm9vdDtcblxuICAgICAgdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGVzKGxhbmcpLnN1YnNjcmliZSgoKSA9PiB7XG5cbiAgICAgICAgY29uc3QgcXVlcnlQYXJhbXMgPSByb290U25hcHNob3QucXVlcnlQYXJhbXM7XG4gICAgICAgIGxldCB1cmwgPSAnJztcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHF1ZXJ5UGFyYW1zKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICBjb25zdCBxdWVyeVN0cmluZyA9IE9iamVjdC5rZXlzKHF1ZXJ5UGFyYW1zKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGtleSArICc9JyArIHF1ZXJ5UGFyYW1zW2tleV1cbiAgICAgICAgICB9KS5qb2luKCcmJyk7XG4gICAgICAgICAgdXJsID0gdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qocm9vdFNuYXBzaG90KSArICc/JyArIHF1ZXJ5U3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybCA9IHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHJvb3RTbmFwc2hvdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICAgICAgbGV0IHVybFNlZ21lbnRzID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgICAgY29uc3QgbGFuZ3VhZ2VTZWdtZW50SW5kZXggPSB1cmxTZWdtZW50cy5pbmRleE9mKHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKTtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVmYXVsdCBsYW5ndWFnZSBoYXMgbm8gcHJlZml4IG1ha2Ugc3VyZSB0byByZW1vdmUgYW5kIGFkZCBpdCB3aGVuIG5lY2Vzc2FyeVxuICAgICAgICAgIGlmICh0aGlzLnBhcnNlci5jdXJyZW50TGFuZyA9PT0gdGhpcy5wYXJzZXIuZGVmYXVsdExhbmcpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgbGFuZ3VhZ2UgcHJlZml4IGZyb20gdXJsIHdoZW4gY3VycmVudCBsYW5ndWFnZSBpcyB0aGUgZGVmYXVsdCBsYW5ndWFnZVxuICAgICAgICAgICAgaWYgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAwIHx8IChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gMSAmJiB1cmxTZWdtZW50c1swXSA9PT0gJycpKSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgY3VycmVudCBha2EgZGVmYXVsdCBsYW5ndWFnZSBwcmVmaXggZnJvbSB0aGUgdXJsXG4gICAgICAgICAgICAgIHVybFNlZ21lbnRzID0gdXJsU2VnbWVudHMuc2xpY2UoMCwgbGFuZ3VhZ2VTZWdtZW50SW5kZXgpLmNvbmNhdCh1cmxTZWdtZW50cy5zbGljZShsYW5ndWFnZVNlZ21lbnRJbmRleCArIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2hlbiBjb21pbmcgZnJvbSBhIGRlZmF1bHQgbGFuZ3VhZ2UgaXQncyBwb3NzaWJsZSB0aGF0IHRoZSB1cmwgZG9lc24ndCBjb250YWluIHRoZSBsYW5ndWFnZSwgbWFrZSBzdXJlIGl0IGRvZXMuXG4gICAgICAgICAgICBpZiAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSB1cmwgc3RhcnRzIHdpdGggYSBzbGFzaCBtYWtlIHN1cmUgdG8ga2VlcCBpdC5cbiAgICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9uSW5kZXggPSB1cmxTZWdtZW50c1swXSA9PT0gJycgPyAxIDogMDtcbiAgICAgICAgICAgICAgdXJsU2VnbWVudHMgPSB1cmxTZWdtZW50cy5zbGljZSgwLCBpbmplY3Rpb25JbmRleCkuY29uY2F0KHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nLCB1cmxTZWdtZW50cy5zbGljZShpbmplY3Rpb25JbmRleCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cmwgPSB1cmxTZWdtZW50cy5qb2luKCcvJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgICAgICBpZiAodXNlTmF2aWdhdGVNZXRob2QpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdXJsXSwgZXh0cmFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVybCwgZXh0cmFzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlcyB0aHJvdWdoIHRoZSB0cmVlIHRvIGFzc2VtYmxlIG5ldyB0cmFuc2xhdGVkIHVybFxuICAgKi9cbiAgcHJpdmF0ZSB0cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuXG4gICAgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3Qucm91dGVDb25maWcpIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KX0vJHt0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdC5maXJzdENoaWxkKX1gO1xuICAgIH0gZWxzZSBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCk7XG4gICAgfVxuXG4gICAgLyogaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3QuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZyAmJiBzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGgpIHtcbiAgICAgIGlmIChzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGggIT09ICcqKicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpICsgJy8nICsgdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3QuZmlyc3RDaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpOyAqL1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIG5ldyBzZWdtZW50IHZhbHVlIGJhc2VkIG9uIHJvdXRlQ29uZmlnIGFuZCB1cmxcbiAgICovXG4gIHByaXZhdGUgcGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuICAgIGlmIChzbmFwc2hvdC5kYXRhLmxvY2FsaXplUm91dGVyKSB7XG4gICAgICBjb25zdCBwYXRoID0gc25hcHNob3QuZGF0YS5sb2NhbGl6ZVJvdXRlci5wYXRoO1xuICAgICAgY29uc3Qgc3ViUGF0aFNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICAgICAgcmV0dXJuIHN1YlBhdGhTZWdtZW50cy5tYXAoKHM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBzLmluZGV4T2YoJzonKSA9PT0gMCA/IHNuYXBzaG90LnVybFtpXS5wYXRoIDogcykuam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIC8qIGlmIChzbmFwc2hvdC5yb3V0ZUNvbmZpZykge1xuICAgICAgaWYgKHNuYXBzaG90LnJvdXRlQ29uZmlnLnBhdGggPT09ICcqKicpIHtcbiAgICAgICAgcmV0dXJuIHNuYXBzaG90LnVybC5maWx0ZXIoKHNlZ21lbnQ6IFVybFNlZ21lbnQpID0+IHNlZ21lbnQucGF0aCkubWFwKChzZWdtZW50OiBVcmxTZWdtZW50KSA9PiBzZWdtZW50LnBhdGgpLmpvaW4oJy8nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN1YlBhdGhTZWdtZW50cyA9IHNuYXBzaG90LnJvdXRlQ29uZmlnLnBhdGguc3BsaXQoJy8nKTtcbiAgICAgICAgcmV0dXJuIHN1YlBhdGhTZWdtZW50cy5tYXAoKHM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBzLmluZGV4T2YoJzonKSA9PT0gMCA/IHNuYXBzaG90LnVybFtpXS5wYXRoIDogcykuam9pbignLycpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJyc7ICovXG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHJvdXRlIHRvIGN1cnJlbnQgbGFuZ3VhZ2VcbiAgICogSWYgbmV3IGxhbmd1YWdlIGlzIGV4cGxpY2l0bHkgcHJvdmlkZWQgdGhlbiByZXBsYWNlIGxhbmd1YWdlIHBhcnQgaW4gdXJsIHdpdGggbmV3IGxhbmd1YWdlXG4gICAqL1xuICB0cmFuc2xhdGVSb3V0ZShwYXRoOiBzdHJpbmcgfCBhbnlbXSk6IHN0cmluZyB8IGFueVtdIHtcbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZShwYXRoKTtcbiAgICAgIHJldHVybiAhcGF0aC5pbmRleE9mKCcvJykgPyBgLyR7dGhpcy5wYXJzZXIudXJsUHJlZml4fSR7dXJsfWAgOiB1cmw7XG4gICAgfVxuICAgIC8vIGl0J3MgYW4gYXJyYXlcbiAgICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XG4gICAgKHBhdGggYXMgQXJyYXk8YW55PikuZm9yRWFjaCgoc2VnbWVudDogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHNlZ21lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlKHNlZ21lbnQpO1xuICAgICAgICBpZiAoIWluZGV4ICYmICFzZWdtZW50LmluZGV4T2YoJy8nKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGAvJHt0aGlzLnBhcnNlci51cmxQcmVmaXh9JHtyZXN9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocmVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2goc2VnbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIHRvIHJlYWN0IG9uIHJvdXRlIGNoYW5nZVxuICAgKi9cbiAgcHJpdmF0ZSBfcm91dGVDaGFuZ2VkKCk6IChldmVudFBhaXI6IFtOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25TdGFydF0pID0+IHZvaWQge1xuICAgIHJldHVybiAoW3ByZXZpb3VzRXZlbnQsIGN1cnJlbnRFdmVudF06IFtOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25TdGFydF0pID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzTGFuZyA9IHRoaXMucGFyc2VyLmdldExvY2F0aW9uTGFuZyhwcmV2aW91c0V2ZW50LnVybCkgfHwgdGhpcy5wYXJzZXIuZGVmYXVsdExhbmc7XG4gICAgICBjb25zdCBjdXJyZW50TGFuZyA9IHRoaXMucGFyc2VyLmdldExvY2F0aW9uTGFuZyhjdXJyZW50RXZlbnQudXJsKSB8fCB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZztcblxuICAgICAgaWYgKGN1cnJlbnRMYW5nICE9PSBwcmV2aW91c0xhbmcpIHtcbiAgICAgICAgdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGVzKGN1cnJlbnRMYW5nKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKHRoaXMucGFyc2VyLnJvdXRlcyk7XG4gICAgICAgICAgLy8gRmlyZSByb3V0ZSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgICB0aGlzLnJvdXRlckV2ZW50cy5uZXh0KGN1cnJlbnRMYW5nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIl19