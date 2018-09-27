/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
export class LocalizeRouterService {
    /**
     * CTOR
     * @param {?} parser
     * @param {?} settings
     * @param {?} router
     * @param {?} route
     */
    constructor(parser, settings, router, route) {
        this.parser = parser;
        this.settings = settings;
        this.router = router;
        this.route = route;
        this.routerEvents = new Subject();
    }
    /**
     * Start up the service
     * @return {?}
     */
    init() {
        this.router.resetConfig(this.parser.routes);
        // subscribe to router events
        this.router.events
            .pipe(filter(event => event instanceof NavigationStart), pairwise())
            .subscribe(this._routeChanged());
    }
    /**
     * Change language and navigate to translated route
     * @param {?} lang
     * @param {?=} extras
     * @param {?=} useNavigateMethod
     * @return {?}
     */
    changeLanguage(lang, extras, useNavigateMethod) {
        if (this.route) {
            console.log(this.route);
        }
        if (lang !== this.parser.currentLang) {
            /** @type {?} */
            const rootSnapshot = this.router.routerState.snapshot.root;
            this.parser.translateRoutes(lang).subscribe(() => {
                /** @type {?} */
                const queryParams = rootSnapshot.queryParams;
                /** @type {?} */
                let url = '';
                if (Object.keys(queryParams).length !== 0) {
                    /** @type {?} */
                    const queryString = Object.keys(queryParams).map(function (key) {
                        return key + '=' + queryParams[key];
                    }).join('&');
                    url = this.traverseRouteSnapshot(rootSnapshot) + '?' + queryString;
                }
                else {
                    url = this.traverseRouteSnapshot(rootSnapshot);
                }
                if (!this.settings.alwaysSetPrefix) {
                    /** @type {?} */
                    let urlSegments = url.split('/');
                    /** @type {?} */
                    const languageSegmentIndex = urlSegments.indexOf(this.parser.currentLang);
                    // If the default language has no prefix make sure to remove and add it when necessary
                    if (this.parser.currentLang === this.parser.defaultLang) {
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
                            const injectionIndex = urlSegments[0] === '' ? 1 : 0;
                            urlSegments = urlSegments.slice(0, injectionIndex).concat(this.parser.currentLang, urlSegments.slice(injectionIndex));
                        }
                    }
                    url = urlSegments.join('/');
                }
                this.router.resetConfig(this.parser.routes);
                if (useNavigateMethod) {
                    this.router.navigate([url], extras);
                }
                else {
                    this.router.navigateByUrl(url, extras);
                }
            });
        }
    }
    /**
     * Traverses through the tree to assemble new translated url
     * @param {?} snapshot
     * @return {?}
     */
    traverseRouteSnapshot(snapshot) {
        if (snapshot.firstChild && snapshot.routeConfig) {
            return `${this.parseSegmentValue(snapshot)}/${this.traverseRouteSnapshot(snapshot.firstChild)}`;
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
    }
    /**
     * Extracts new segment value based on routeConfig and url
     * @param {?} snapshot
     * @return {?}
     */
    parseSegmentValue(snapshot) {
        if (snapshot.data.localizeRouter) {
            /** @type {?} */
            const path = snapshot.data.localizeRouter.path;
            /** @type {?} */
            const subPathSegments = path.split('/');
            return subPathSegments.map((s, i) => s.indexOf(':') === 0 ? snapshot.url[i].path : s).join('/');
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
    }
    /**
     * Translate route to current language
     * If new language is explicitly provided then replace language part in url with new language
     * @param {?} path
     * @return {?}
     */
    translateRoute(path) {
        if (typeof path === 'string') {
            /** @type {?} */
            const url = this.parser.translateRoute(path);
            return !path.indexOf('/') ? `/${this.parser.urlPrefix}${url}` : url;
        }
        // it's an array
        /** @type {?} */
        const result = [];
        ((/** @type {?} */ (path))).forEach((segment, index) => {
            if (typeof segment === 'string') {
                /** @type {?} */
                const res = this.parser.translateRoute(segment);
                if (!index && !segment.indexOf('/')) {
                    result.push(`/${this.parser.urlPrefix}${res}`);
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
    }
    /**
     * Event handler to react on route change
     * @return {?}
     */
    _routeChanged() {
        return ([previousEvent, currentEvent]) => {
            /** @type {?} */
            const previousLang = this.parser.getLocationLang(previousEvent.url) || this.parser.defaultLang;
            /** @type {?} */
            const currentLang = this.parser.getLocationLang(currentEvent.url) || this.parser.defaultLang;
            if (currentLang !== previousLang) {
                this.parser.translateRoutes(currentLang).subscribe(() => {
                    this.router.resetConfig(this.parser.routes);
                    // Fire route change event
                    this.routerEvents.next(currentLang);
                });
            }
        };
    }
}
LocalizeRouterService.ctorParameters = () => [
    { type: LocalizeParser, decorators: [{ type: Inject, args: [LocalizeParser,] }] },
    { type: LocalizeRouterSettings, decorators: [{ type: Inject, args: [LocalizeRouterSettings,] }] },
    { type: Router, decorators: [{ type: Inject, args: [Router,] }] },
    { type: ActivatedRoute, decorators: [{ type: Inject, args: [ActivatedRoute,] }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci8iLCJzb3VyY2VzIjpbImxpYi9sb2NhbGl6ZS1yb3V0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBd0QsY0FBYyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEksT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7QUFNbEUsTUFBTTs7Ozs7Ozs7SUFNSixZQUNtQyxNQUFzQixFQUNkLFFBQWdDLEVBQy9DLE1BQWMsRUFDTixLQUFxQjtRQUh0QixXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUNkLGFBQVEsR0FBUixRQUFRLENBQXdCO1FBQy9DLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDTixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUVyRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7SUFDOUMsQ0FBQzs7Ozs7SUFLRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1Qyw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2FBQ2YsSUFBSSxDQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssWUFBWSxlQUFlLENBQUMsRUFDakQsUUFBUSxFQUFF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RUFBRTtvQkFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDNUMsMEJBQTBCO29CQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQzs7O1lBakxNLGNBQWMsdUJBY2hCLE1BQU0sU0FBQyxjQUFjO1lBYm5CLHNCQUFzQix1QkFjeEIsTUFBTSxTQUFDLHNCQUFzQjtZQW5CM0IsTUFBTSx1QkFvQlIsTUFBTSxTQUFDLE1BQU07WUFwQm9FLGNBQWMsdUJBcUIvRixNQUFNLFNBQUMsY0FBYzs7OztJQVQxQiw2Q0FBOEI7O0lBTTFCLHVDQUFxRDs7SUFDckQseUNBQXVFOztJQUN2RSx1Q0FBc0M7O0lBQ3RDLHNDQUFxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uU3RhcnQsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIE5hdmlnYXRpb25FeHRyYXMsIFVybFNlZ21lbnQsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgcGFpcndpc2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2V0dGluZ3MgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuXG4vKipcbiAqIExvY2FsaXphdGlvbiBzZXJ2aWNlXG4gKiBtb2RpZnlSb3V0ZXNcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyU2VydmljZSB7XG4gIHJvdXRlckV2ZW50czogU3ViamVjdDxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoTG9jYWxpemVQYXJzZXIpIHB1YmxpYyBwYXJzZXI6IExvY2FsaXplUGFyc2VyLFxuICAgICAgQEluamVjdChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSBwdWJsaWMgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgICBASW5qZWN0KFJvdXRlcikgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgIEBJbmplY3QoQWN0aXZhdGVkUm91dGUpIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlXG4gICAgKSB7XG4gICAgICB0aGlzLnJvdXRlckV2ZW50cyA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cCB0aGUgc2VydmljZVxuICAgKi9cbiAgaW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgIC8vIHN1YnNjcmliZSB0byByb3V0ZXIgZXZlbnRzXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSxcbiAgICAgICAgcGFpcndpc2UoKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSh0aGlzLl9yb3V0ZUNoYW5nZWQoKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIGxhbmd1YWdlIGFuZCBuYXZpZ2F0ZSB0byB0cmFuc2xhdGVkIHJvdXRlXG4gICAqL1xuICBjaGFuZ2VMYW5ndWFnZShsYW5nOiBzdHJpbmcsIGV4dHJhcz86IE5hdmlnYXRpb25FeHRyYXMsIHVzZU5hdmlnYXRlTWV0aG9kPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnJvdXRlKTtcbiAgICB9XG4gICAgaWYgKGxhbmcgIT09IHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKSB7XG4gICAgICBjb25zdCByb290U25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QgPSB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdC5yb290O1xuXG4gICAgICB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZXMobGFuZykuc3Vic2NyaWJlKCgpID0+IHtcblxuICAgICAgICBjb25zdCBxdWVyeVBhcmFtcyA9IHJvb3RTbmFwc2hvdC5xdWVyeVBhcmFtcztcbiAgICAgICAgbGV0IHVybCA9ICcnO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMocXVlcnlQYXJhbXMpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gT2JqZWN0LmtleXMocXVlcnlQYXJhbXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5ICsgJz0nICsgcXVlcnlQYXJhbXNba2V5XVxuICAgICAgICAgIH0pLmpvaW4oJyYnKTtcbiAgICAgICAgICB1cmwgPSB0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChyb290U25hcHNob3QpICsgJz8nICsgcXVlcnlTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsID0gdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qocm9vdFNuYXBzaG90KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgICAgICBsZXQgdXJsU2VnbWVudHMgPSB1cmwuc3BsaXQoJy8nKTtcbiAgICAgICAgICBjb25zdCBsYW5ndWFnZVNlZ21lbnRJbmRleCA9IHVybFNlZ21lbnRzLmluZGV4T2YodGhpcy5wYXJzZXIuY3VycmVudExhbmcpO1xuICAgICAgICAgIC8vIElmIHRoZSBkZWZhdWx0IGxhbmd1YWdlIGhhcyBubyBwcmVmaXggbWFrZSBzdXJlIHRvIHJlbW92ZSBhbmQgYWRkIGl0IHdoZW4gbmVjZXNzYXJ5XG4gICAgICAgICAgaWYgKHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nID09PSB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBsYW5ndWFnZSBwcmVmaXggZnJvbSB1cmwgd2hlbiBjdXJyZW50IGxhbmd1YWdlIGlzIHRoZSBkZWZhdWx0IGxhbmd1YWdlXG4gICAgICAgICAgICBpZiAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IDAgfHwgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAxICYmIHVybFNlZ21lbnRzWzBdID09PSAnJykpIHtcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBjdXJyZW50IGFrYSBkZWZhdWx0IGxhbmd1YWdlIHByZWZpeCBmcm9tIHRoZSB1cmxcbiAgICAgICAgICAgICAgdXJsU2VnbWVudHMgPSB1cmxTZWdtZW50cy5zbGljZSgwLCBsYW5ndWFnZVNlZ21lbnRJbmRleCkuY29uY2F0KHVybFNlZ21lbnRzLnNsaWNlKGxhbmd1YWdlU2VnbWVudEluZGV4ICsgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBXaGVuIGNvbWluZyBmcm9tIGEgZGVmYXVsdCBsYW5ndWFnZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlIHVybCBkb2Vzbid0IGNvbnRhaW4gdGhlIGxhbmd1YWdlLCBtYWtlIHN1cmUgaXQgZG9lcy5cbiAgICAgICAgICAgIGlmIChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgLy8gSWYgdGhlIHVybCBzdGFydHMgd2l0aCBhIHNsYXNoIG1ha2Ugc3VyZSB0byBrZWVwIGl0LlxuICAgICAgICAgICAgICBjb25zdCBpbmplY3Rpb25JbmRleCA9IHVybFNlZ21lbnRzWzBdID09PSAnJyA/IDEgOiAwO1xuICAgICAgICAgICAgICB1cmxTZWdtZW50cyA9IHVybFNlZ21lbnRzLnNsaWNlKDAsIGluamVjdGlvbkluZGV4KS5jb25jYXQodGhpcy5wYXJzZXIuY3VycmVudExhbmcsIHVybFNlZ21lbnRzLnNsaWNlKGluamVjdGlvbkluZGV4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHVybCA9IHVybFNlZ21lbnRzLmpvaW4oJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKHRoaXMucGFyc2VyLnJvdXRlcyk7XG4gICAgICAgIGlmICh1c2VOYXZpZ2F0ZU1ldGhvZCkge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt1cmxdLCBleHRyYXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsLCBleHRyYXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJhdmVyc2VzIHRocm91Z2ggdGhlIHRyZWUgdG8gYXNzZW1ibGUgbmV3IHRyYW5zbGF0ZWQgdXJsXG4gICAqL1xuICBwcml2YXRlIHRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IHN0cmluZyB7XG5cbiAgICBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCAmJiBzbmFwc2hvdC5yb3V0ZUNvbmZpZykge1xuICAgICAgcmV0dXJuIGAke3RoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpfS8ke3RoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpfWA7XG4gICAgfSBlbHNlIGlmIChzbmFwc2hvdC5maXJzdENoaWxkKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3QuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KTtcbiAgICB9XG5cbiAgICAvKiBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCAmJiBzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnICYmIHNuYXBzaG90LmZpcnN0Q2hpbGQucm91dGVDb25maWcucGF0aCkge1xuICAgICAgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQucm91dGVDb25maWcucGF0aCAhPT0gJyoqJykge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCkgKyAnLycgKyB0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdC5maXJzdENoaWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCk7ICovXG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdHMgbmV3IHNlZ21lbnQgdmFsdWUgYmFzZWQgb24gcm91dGVDb25maWcgYW5kIHVybFxuICAgKi9cbiAgcHJpdmF0ZSBwYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IHN0cmluZyB7XG4gICAgaWYgKHNuYXBzaG90LmRhdGEubG9jYWxpemVSb3V0ZXIpIHtcbiAgICAgIGNvbnN0IHBhdGggPSBzbmFwc2hvdC5kYXRhLmxvY2FsaXplUm91dGVyLnBhdGg7XG4gICAgICBjb25zdCBzdWJQYXRoU2VnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gICAgICByZXR1cm4gc3ViUGF0aFNlZ21lbnRzLm1hcCgoczogc3RyaW5nLCBpOiBudW1iZXIpID0+IHMuaW5kZXhPZignOicpID09PSAwID8gc25hcHNob3QudXJsW2ldLnBhdGggOiBzKS5qb2luKCcvJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgLyogaWYgKHNuYXBzaG90LnJvdXRlQ29uZmlnKSB7XG4gICAgICBpZiAoc25hcHNob3Qucm91dGVDb25maWcucGF0aCA9PT0gJyoqJykge1xuICAgICAgICByZXR1cm4gc25hcHNob3QudXJsLmZpbHRlcigoc2VnbWVudDogVXJsU2VnbWVudCkgPT4gc2VnbWVudC5wYXRoKS5tYXAoKHNlZ21lbnQ6IFVybFNlZ21lbnQpID0+IHNlZ21lbnQucGF0aCkuam9pbignLycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3ViUGF0aFNlZ21lbnRzID0gc25hcHNob3Qucm91dGVDb25maWcucGF0aC5zcGxpdCgnLycpO1xuICAgICAgICByZXR1cm4gc3ViUGF0aFNlZ21lbnRzLm1hcCgoczogc3RyaW5nLCBpOiBudW1iZXIpID0+IHMuaW5kZXhPZignOicpID09PSAwID8gc25hcHNob3QudXJsW2ldLnBhdGggOiBzKS5qb2luKCcvJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJzsgKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcm91dGUgdG8gY3VycmVudCBsYW5ndWFnZVxuICAgKiBJZiBuZXcgbGFuZ3VhZ2UgaXMgZXhwbGljaXRseSBwcm92aWRlZCB0aGVuIHJlcGxhY2UgbGFuZ3VhZ2UgcGFydCBpbiB1cmwgd2l0aCBuZXcgbGFuZ3VhZ2VcbiAgICovXG4gIHRyYW5zbGF0ZVJvdXRlKHBhdGg6IHN0cmluZyB8IGFueVtdKTogc3RyaW5nIHwgYW55W10ge1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlKHBhdGgpO1xuICAgICAgcmV0dXJuICFwYXRoLmluZGV4T2YoJy8nKSA/IGAvJHt0aGlzLnBhcnNlci51cmxQcmVmaXh9JHt1cmx9YCA6IHVybDtcbiAgICB9XG4gICAgLy8gaXQncyBhbiBhcnJheVxuICAgIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXTtcbiAgICAocGF0aCBhcyBBcnJheTxhbnk+KS5mb3JFYWNoKChzZWdtZW50OiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygc2VnbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGUoc2VnbWVudCk7XG4gICAgICAgIGlmICghaW5kZXggJiYgIXNlZ21lbnQuaW5kZXhPZignLycpKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goYC8ke3RoaXMucGFyc2VyLnVybFByZWZpeH0ke3Jlc31gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQucHVzaChyZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGhhbmRsZXIgdG8gcmVhY3Qgb24gcm91dGUgY2hhbmdlXG4gICAqL1xuICBwcml2YXRlIF9yb3V0ZUNoYW5nZWQoKTogKGV2ZW50UGFpcjogW05hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvblN0YXJ0XSkgPT4gdm9pZCB7XG4gICAgcmV0dXJuIChbcHJldmlvdXNFdmVudCwgY3VycmVudEV2ZW50XTogW05hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvblN0YXJ0XSkgPT4ge1xuICAgICAgY29uc3QgcHJldmlvdXNMYW5nID0gdGhpcy5wYXJzZXIuZ2V0TG9jYXRpb25MYW5nKHByZXZpb3VzRXZlbnQudXJsKSB8fCB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZztcbiAgICAgIGNvbnN0IGN1cnJlbnRMYW5nID0gdGhpcy5wYXJzZXIuZ2V0TG9jYXRpb25MYW5nKGN1cnJlbnRFdmVudC51cmwpIHx8IHRoaXMucGFyc2VyLmRlZmF1bHRMYW5nO1xuXG4gICAgICBpZiAoY3VycmVudExhbmcgIT09IHByZXZpb3VzTGFuZykge1xuICAgICAgICB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZXMoY3VycmVudExhbmcpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIucmVzZXRDb25maWcodGhpcy5wYXJzZXIucm91dGVzKTtcbiAgICAgICAgICAvLyBGaXJlIHJvdXRlIGNoYW5nZSBldmVudFxuICAgICAgICAgIHRoaXMucm91dGVyRXZlbnRzLm5leHQoY3VycmVudExhbmcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iXX0=