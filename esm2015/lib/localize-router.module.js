/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule, APP_INITIALIZER, Optional, SkipSelf, Injectable, Injector, NgModuleFactoryLoader } from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { DummyLocalizeParser, LocalizeParser } from './localize-router.parser';
import { RouterModule } from '@angular/router';
import { LocalizeRouterPipe } from './localize-router.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ALWAYS_SET_PREFIX, CACHE_MECHANISM, CACHE_NAME, DEFAULT_LANG_FUNCTION, LOCALIZE_ROUTER_FORROOT_GUARD, LocalizeRouterSettings, RAW_ROUTES, USE_CACHED_LANG } from './localize-router.config';
import { LocalizeRouterConfigLoader } from './localize-router-config-loader';
export class ParserInitializer {
    /**
     * CTOR
     * @param {?} injector
     */
    constructor(injector) {
        this.injector = injector;
    }
    /**
     * @return {?}
     */
    appInitializer() {
        /** @type {?} */
        const res = this.parser.load(this.routes);
        res.then(() => {
            /** @type {?} */
            const localize = this.injector.get(LocalizeRouterService);
            localize.init();
        });
        return res;
    }
    /**
     * @param {?} parser
     * @param {?} routes
     * @return {?}
     */
    generateInitializer(parser, routes) {
        this.parser = parser;
        this.routes = routes.reduce((a, b) => a.concat(b));
        return this.appInitializer;
    }
}
ParserInitializer.decorators = [
    { type: Injectable },
];
ParserInitializer.ctorParameters = () => [
    { type: Injector }
];
if (false) {
    /** @type {?} */
    ParserInitializer.prototype.parser;
    /** @type {?} */
    ParserInitializer.prototype.routes;
    /** @type {?} */
    ParserInitializer.prototype.injector;
}
/**
 * @param {?} p
 * @param {?} parser
 * @param {?} routes
 * @return {?}
 */
export function getAppInitializer(p, parser, routes) {
    return p.generateInitializer(parser, routes).bind(p);
}
export class LocalizeRouterModule {
    /**
     * @param {?} routes
     * @param {?=} config
     * @return {?}
     */
    static forRoot(routes, config = {}) {
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
    }
    /**
     * @param {?} routes
     * @return {?}
     */
    static forChild(routes) {
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
    }
}
LocalizeRouterModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, RouterModule, TranslateModule],
                declarations: [LocalizeRouterPipe],
                exports: [LocalizeRouterPipe]
            },] },
];
/**
 * @param {?} localizeRouterModule
 * @return {?}
 */
export function provideForRootGuard(localizeRouterModule) {
    if (localizeRouterModule) {
        throw new Error(`LocalizeRouterModule.forRoot() called twice. Lazy loaded modules should use LocalizeRouterModule.forChild() instead.`);
    }
    return 'guarded';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyLyIsInNvdXJjZXMiOlsibGliL2xvY2FsaXplLXJvdXRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxRQUFRLEVBQXVCLGVBQWUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUNsRSxVQUFVLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixFQUM1QyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0UsT0FBTyxFQUFFLFlBQVksRUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixlQUFlLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixFQUFFLDZCQUE2QixFQUF3QixzQkFBc0IsRUFDL0gsVUFBVSxFQUNWLGVBQWUsRUFDaEIsTUFBTSwwQkFBMEIsQ0FBQztBQUNsQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUc3RSxNQUFNOzs7OztJQU9KLFlBQW9CLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7SUFDdEMsQ0FBQzs7OztJQUVELGNBQWM7O2NBQ04sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDekMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7O2tCQUNOLFFBQVEsR0FBMEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUM7WUFDaEYsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7Ozs7OztJQUVELG1CQUFtQixDQUFDLE1BQXNCLEVBQUUsTUFBZ0I7UUFDMUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7OztZQXpCRixVQUFVOzs7WUFoQkcsUUFBUTs7OztJQWtCcEIsbUNBQXVCOztJQUN2QixtQ0FBZTs7SUFLSCxxQ0FBMEI7Ozs7Ozs7O0FBb0J4QyxNQUFNLDRCQUE0QixDQUFvQixFQUFFLE1BQXNCLEVBQUUsTUFBZ0I7SUFDOUYsTUFBTSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFPRCxNQUFNOzs7Ozs7SUFFSixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWMsRUFBRSxTQUErQixFQUFFO1FBQzlELE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSw2QkFBNkI7b0JBQ3RDLFVBQVUsRUFBRSxtQkFBbUI7b0JBQy9CLElBQUksRUFBRSxDQUFDLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUM7aUJBQy9EO2dCQUNELEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLGFBQWEsRUFBRTtnQkFDNUQsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxlQUFlLEVBQUU7Z0JBQ2hFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFDbkQsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsY0FBYyxFQUFFO2dCQUM3RCxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLG1CQUFtQixFQUFFO2dCQUN4RSxzQkFBc0I7Z0JBQ3RCLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRTtnQkFDM0U7b0JBQ0UsT0FBTyxFQUFFLFVBQVU7b0JBQ25CLEtBQUssRUFBRSxJQUFJO29CQUNYLFFBQVEsRUFBRSxNQUFNO2lCQUNqQjtnQkFDRCxxQkFBcUI7Z0JBQ3JCLGlCQUFpQjtnQkFDakIsRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLDBCQUEwQixFQUFFO2dCQUN4RTtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsS0FBSyxFQUFFLElBQUk7b0JBQ1gsVUFBVSxFQUFFLGlCQUFpQjtvQkFDN0IsSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQztpQkFDdEQ7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBYztRQUM1QixNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsS0FBSyxFQUFFLElBQUk7b0JBQ1gsUUFBUSxFQUFFLE1BQU07aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7O1lBcERGLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQztnQkFDdEQsWUFBWSxFQUFFLENBQUMsa0JBQWtCLENBQUM7Z0JBQ2xDLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO2FBQzlCOzs7Ozs7QUFtREQsTUFBTSw4QkFBOEIsb0JBQTBDO0lBQzVFLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLElBQUksS0FBSyxDQUNiLHNIQUFzSCxDQUFDLENBQUM7SUFDNUgsQ0FBQztJQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBBUFBfSU5JVElBTElaRVIsIE9wdGlvbmFsLCBTa2lwU2VsZixcbiAgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIE5nTW9kdWxlRmFjdG9yeUxvYWRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2VydmljZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRHVtbXlMb2NhbGl6ZVBhcnNlciwgTG9jYWxpemVQYXJzZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5wYXJzZXInO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlLCBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJQaXBlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGlwZSc7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBTFdBWVNfU0VUX1BSRUZJWCxcbiAgQ0FDSEVfTUVDSEFOSVNNLCBDQUNIRV9OQU1FLCBERUZBVUxUX0xBTkdfRlVOQ1RJT04sIExPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJELCBMb2NhbGl6ZVJvdXRlckNvbmZpZywgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcbiAgUkFXX1JPVVRFUyxcbiAgVVNFX0NBQ0hFRF9MQU5HXG59IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLmNvbmZpZyc7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlckNvbmZpZ0xvYWRlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLWNvbmZpZy1sb2FkZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGFyc2VySW5pdGlhbGl6ZXIge1xuICBwYXJzZXI6IExvY2FsaXplUGFyc2VyO1xuICByb3V0ZXM6IFJvdXRlcztcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgfVxuXG4gIGFwcEluaXRpYWxpemVyKCk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcmVzID0gdGhpcy5wYXJzZXIubG9hZCh0aGlzLnJvdXRlcyk7XG4gICAgcmVzLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgbG9jYWxpemU6IExvY2FsaXplUm91dGVyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KExvY2FsaXplUm91dGVyU2VydmljZSk7XG4gICAgICBsb2NhbGl6ZS5pbml0KCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgZ2VuZXJhdGVJbml0aWFsaXplcihwYXJzZXI6IExvY2FsaXplUGFyc2VyLCByb3V0ZXM6IFJvdXRlc1tdKTogKCkgPT4gUHJvbWlzZTxhbnk+IHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlcjtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcy5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpKTtcbiAgICByZXR1cm4gdGhpcy5hcHBJbml0aWFsaXplcjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwSW5pdGlhbGl6ZXIocDogUGFyc2VySW5pdGlhbGl6ZXIsIHBhcnNlcjogTG9jYWxpemVQYXJzZXIsIHJvdXRlczogUm91dGVzW10pOiBhbnkge1xuICByZXR1cm4gcC5nZW5lcmF0ZUluaXRpYWxpemVyKHBhcnNlciwgcm91dGVzKS5iaW5kKHApO1xufVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFRyYW5zbGF0ZU1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0xvY2FsaXplUm91dGVyUGlwZV0sXG4gIGV4cG9ydHM6IFtMb2NhbGl6ZVJvdXRlclBpcGVdXG59KVxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyTW9kdWxlIHtcblxuICBzdGF0aWMgZm9yUm9vdChyb3V0ZXM6IFJvdXRlcywgY29uZmlnOiBMb2NhbGl6ZVJvdXRlckNvbmZpZyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQsXG4gICAgICAgICAgdXNlRmFjdG9yeTogcHJvdmlkZUZvclJvb3RHdWFyZCxcbiAgICAgICAgICBkZXBzOiBbW0xvY2FsaXplUm91dGVyTW9kdWxlLCBuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCldXVxuICAgICAgICB9LFxuICAgICAgICB7IHByb3ZpZGU6IFVTRV9DQUNIRURfTEFORywgdXNlVmFsdWU6IGNvbmZpZy51c2VDYWNoZWRMYW5nIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQUxXQVlTX1NFVF9QUkVGSVgsIHVzZVZhbHVlOiBjb25maWcuYWx3YXlzU2V0UHJlZml4IH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ0FDSEVfTkFNRSwgdXNlVmFsdWU6IGNvbmZpZy5jYWNoZU5hbWUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDQUNIRV9NRUNIQU5JU00sIHVzZVZhbHVlOiBjb25maWcuY2FjaGVNZWNoYW5pc20gfSxcbiAgICAgICAgeyBwcm92aWRlOiBERUZBVUxUX0xBTkdfRlVOQ1RJT04sIHVzZVZhbHVlOiBjb25maWcuZGVmYXVsdExhbmdGdW5jdGlvbiB9LFxuICAgICAgICBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICAgICAgICBjb25maWcucGFyc2VyIHx8IHsgcHJvdmlkZTogTG9jYWxpemVQYXJzZXIsIHVzZUNsYXNzOiBEdW1teUxvY2FsaXplUGFyc2VyIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSQVdfUk9VVEVTLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiByb3V0ZXNcbiAgICAgICAgfSxcbiAgICAgICAgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlLFxuICAgICAgICBQYXJzZXJJbml0aWFsaXplcixcbiAgICAgICAgeyBwcm92aWRlOiBOZ01vZHVsZUZhY3RvcnlMb2FkZXIsIHVzZUNsYXNzOiBMb2NhbGl6ZVJvdXRlckNvbmZpZ0xvYWRlciB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGdldEFwcEluaXRpYWxpemVyLFxuICAgICAgICAgIGRlcHM6IFtQYXJzZXJJbml0aWFsaXplciwgTG9jYWxpemVQYXJzZXIsIFJBV19ST1VURVNdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZvckNoaWxkKHJvdXRlczogUm91dGVzKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUkFXX1JPVVRFUyxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogcm91dGVzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlRm9yUm9vdEd1YXJkKGxvY2FsaXplUm91dGVyTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSk6IHN0cmluZyB7XG4gIGlmIChsb2NhbGl6ZVJvdXRlck1vZHVsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBMb2NhbGl6ZVJvdXRlck1vZHVsZS5mb3JSb290KCkgY2FsbGVkIHR3aWNlLiBMYXp5IGxvYWRlZCBtb2R1bGVzIHNob3VsZCB1c2UgTG9jYWxpemVSb3V0ZXJNb2R1bGUuZm9yQ2hpbGQoKSBpbnN0ZWFkLmApO1xuICB9XG4gIHJldHVybiAnZ3VhcmRlZCc7XG59XG4iXX0=