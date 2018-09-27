/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Inject, InjectionToken } from '@angular/core';
/**
 * Guard to make sure we have single initialization of forRoot
 * @type {?}
 */
export var LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken('LOCALIZE_ROUTER_FORROOT_GUARD');
/**
 * Static provider for keeping track of routes
 * @type {?}
 */
export var RAW_ROUTES = new InjectionToken('RAW_ROUTES');
/**
 * Namespace for fail proof access of CacheMechanism
 */
/**
 * Namespace for fail proof access of CacheMechanism
 */
export var CacheMechanism;
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
export var USE_CACHED_LANG = new InjectionToken('USE_CACHED_LANG');
/**
 * Cache mechanism type
 * @type {?}
 */
export var CACHE_MECHANISM = new InjectionToken('CACHE_MECHANISM');
/**
 * Cache name
 * @type {?}
 */
export var CACHE_NAME = new InjectionToken('CACHE_NAME');
/**
 * Function for calculating default language
 * @type {?}
 */
export var DEFAULT_LANG_FUNCTION = new InjectionToken('DEFAULT_LANG_FUNCTION');
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 * @type {?}
 */
export var ALWAYS_SET_PREFIX = new InjectionToken('ALWAYS_SET_PREFIX');
/**
 * Config interface for LocalizeRouter
 * @record
 */
export function LocalizeRouterConfig() { }
if (false) {
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.parser;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.useCachedLang;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.cacheMechanism;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.cacheName;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.defaultLangFunction;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.alwaysSetPrefix;
}
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
export { LocalizeRouterSettings };
if (false) {
    /** @type {?} */
    LocalizeRouterSettings.prototype.useCachedLang;
    /** @type {?} */
    LocalizeRouterSettings.prototype.alwaysSetPrefix;
    /** @type {?} */
    LocalizeRouterSettings.prototype.cacheMechanism;
    /** @type {?} */
    LocalizeRouterSettings.prototype.cacheName;
    /** @type {?} */
    LocalizeRouterSettings.prototype.defaultLangFunction;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyLyIsInNvdXJjZXMiOlsibGliL2xvY2FsaXplLXJvdXRlci5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFZLE1BQU0sZUFBZSxDQUFDOzs7OztBQU9qRSxNQUFNLEtBQU8sNkJBQTZCLEdBQUcsSUFBSSxjQUFjLENBQXVCLCtCQUErQixDQUFDOzs7OztBQUt0SCxNQUFNLEtBQU8sVUFBVSxHQUE2QixJQUFJLGNBQWMsQ0FBVyxZQUFZLENBQUM7QUFPOUY7O0dBRUc7Ozs7QUFDSCxNQUFNLEtBQVcsY0FBYyxDQUc5Qjs7OztBQUhELFdBQWlCLGNBQWM7SUFDaEIsMkJBQVksR0FBbUIsY0FBYztJQUM3QyxxQkFBTSxHQUFtQixRQUFRO0FBQ2hELENBQUMsRUFIZ0IsY0FBYyxLQUFkLGNBQWMsUUFHOUI7Ozs7O0FBS0QsTUFBTSxLQUFPLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBVSxpQkFBaUIsQ0FBQzs7Ozs7QUFJN0UsTUFBTSxLQUFPLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBaUIsaUJBQWlCLENBQUM7Ozs7O0FBSXBGLE1BQU0sS0FBTyxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQVMsWUFBWSxDQUFDOzs7OztBQVdsRSxNQUFNLEtBQU8scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQTBCLHVCQUF1QixDQUFDOzs7OztBQUt6RyxNQUFNLEtBQU8saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQVUsbUJBQW1CLENBQUM7Ozs7O0FBS2pGLDBDQU9DOzs7SUFOQyxzQ0FBa0I7O0lBQ2xCLDZDQUF3Qjs7SUFDeEIsOENBQWdDOztJQUNoQyx5Q0FBbUI7O0lBQ25CLG1EQUE4Qzs7SUFDOUMsK0NBQTBCOzs7SUFHdEIsbUJBQW1CLEdBQUcsMkJBQTJCO0FBRXZEO0lBQ0U7O09BRUc7SUFDSCxnQ0FDa0MsYUFBNkIsRUFDM0IsZUFBK0IsRUFDakMsY0FBNEQsRUFDakUsU0FBdUMsRUFDNUIsbUJBQXFEO1FBSjNELDhCQUFBLEVBQUEsb0JBQTZCO1FBQzNCLGdDQUFBLEVBQUEsc0JBQStCO1FBQ2pDLCtCQUFBLEVBQUEsaUJBQWlDLGNBQWMsQ0FBQyxZQUFZO1FBQ2pFLDBCQUFBLEVBQUEsK0JBQXVDO1FBQzVCLG9DQUFBLEVBQUEsMkJBQW9ELENBQUM7UUFKM0Qsa0JBQWEsR0FBYixhQUFhLENBQWdCO1FBQzNCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUNqQyxtQkFBYyxHQUFkLGNBQWMsQ0FBOEM7UUFDakUsY0FBUyxHQUFULFNBQVMsQ0FBOEI7UUFDNUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFrQztJQUU3RixDQUFDOzs4Q0FORSxNQUFNLFNBQUMsZUFBZTs4Q0FDdEIsTUFBTSxTQUFDLGlCQUFpQjtnQkFDdUIsY0FBYyx1QkFBN0QsTUFBTSxTQUFDLGVBQWU7NkNBQ3RCLE1BQU0sU0FBQyxVQUFVO2dEQUNqQixNQUFNLFNBQUMscUJBQXFCOztJQUdqQyw2QkFBQztDQUFBLEFBWkQsSUFZQztTQVpZLHNCQUFzQjs7O0lBSy9CLCtDQUE2RDs7SUFDN0QsaURBQWlFOztJQUNqRSxnREFBNEY7O0lBQzVGLDJDQUFrRTs7SUFDbEUscURBQTJGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgUHJvdmlkZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlck1vZHVsZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLm1vZHVsZSc7XG5cbi8qKlxuICogR3VhcmQgdG8gbWFrZSBzdXJlIHdlIGhhdmUgc2luZ2xlIGluaXRpYWxpemF0aW9uIG9mIGZvclJvb3RcbiAqL1xuZXhwb3J0IGNvbnN0IExPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJEID0gbmV3IEluamVjdGlvblRva2VuPExvY2FsaXplUm91dGVyTW9kdWxlPignTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQnKTtcblxuLyoqXG4gKiBTdGF0aWMgcHJvdmlkZXIgZm9yIGtlZXBpbmcgdHJhY2sgb2Ygcm91dGVzXG4gKi9cbmV4cG9ydCBjb25zdCBSQVdfUk9VVEVTOiBJbmplY3Rpb25Ub2tlbjxSb3V0ZXNbXT4gPSBuZXcgSW5qZWN0aW9uVG9rZW48Um91dGVzW10+KCdSQVdfUk9VVEVTJyk7XG5cbi8qKlxuICogVHlwZSBmb3IgQ2FjaGluZyBvZiBkZWZhdWx0IGxhbmd1YWdlXG4gKi9cbmV4cG9ydCB0eXBlIENhY2hlTWVjaGFuaXNtID0gJ0xvY2FsU3RvcmFnZScgfCAnQ29va2llJztcblxuLyoqXG4gKiBOYW1lc3BhY2UgZm9yIGZhaWwgcHJvb2YgYWNjZXNzIG9mIENhY2hlTWVjaGFuaXNtXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgQ2FjaGVNZWNoYW5pc20ge1xuICBleHBvcnQgY29uc3QgTG9jYWxTdG9yYWdlOiBDYWNoZU1lY2hhbmlzbSA9ICdMb2NhbFN0b3JhZ2UnO1xuICBleHBvcnQgY29uc3QgQ29va2llOiBDYWNoZU1lY2hhbmlzbSA9ICdDb29raWUnO1xufVxuXG4vKipcbiAqIEJvb2xlYW4gdG8gaW5kaWNhdGUgd2hldGhlciB0byB1c2UgY2FjaGVkIGxhbmd1YWdlIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBVU0VfQ0FDSEVEX0xBTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ1VTRV9DQUNIRURfTEFORycpO1xuLyoqXG4gKiBDYWNoZSBtZWNoYW5pc20gdHlwZVxuICovXG5leHBvcnQgY29uc3QgQ0FDSEVfTUVDSEFOSVNNID0gbmV3IEluamVjdGlvblRva2VuPENhY2hlTWVjaGFuaXNtPignQ0FDSEVfTUVDSEFOSVNNJyk7XG4vKipcbiAqIENhY2hlIG5hbWVcbiAqL1xuZXhwb3J0IGNvbnN0IENBQ0hFX05BTUUgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignQ0FDSEVfTkFNRScpO1xuXG4vKipcbiAqIFR5cGUgZm9yIGRlZmF1bHQgbGFuZ3VhZ2UgZnVuY3Rpb25cbiAqIFVzZWQgdG8gb3ZlcnJpZGUgYmFzaWMgYmVoYXZpb3VyXG4gKi9cbmV4cG9ydCB0eXBlIERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uID0gKGxhbmd1YWdlczogc3RyaW5nW10sIGNhY2hlZExhbmc/OiBzdHJpbmcsIGJyb3dzZXJMYW5nPzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cbi8qKlxuICogRnVuY3Rpb24gZm9yIGNhbGN1bGF0aW5nIGRlZmF1bHQgbGFuZ3VhZ2VcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTEFOR19GVU5DVElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbj4oJ0RFRkFVTFRfTEFOR19GVU5DVElPTicpO1xuXG4vKipcbiAqIEJvb2xlYW4gdG8gaW5kaWNhdGUgd2hldGhlciBwcmVmaXggc2hvdWxkIGJlIHNldCBmb3Igc2luZ2xlIGxhbmd1YWdlIHNjZW5hcmlvc1xuICovXG5leHBvcnQgY29uc3QgQUxXQVlTX1NFVF9QUkVGSVggPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ0FMV0FZU19TRVRfUFJFRklYJyk7XG5cbi8qKlxuICogQ29uZmlnIGludGVyZmFjZSBmb3IgTG9jYWxpemVSb3V0ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhbGl6ZVJvdXRlckNvbmZpZyB7XG4gIHBhcnNlcj86IFByb3ZpZGVyO1xuICB1c2VDYWNoZWRMYW5nPzogYm9vbGVhbjtcbiAgY2FjaGVNZWNoYW5pc20/OiBDYWNoZU1lY2hhbmlzbTtcbiAgY2FjaGVOYW1lPzogc3RyaW5nO1xuICBkZWZhdWx0TGFuZ0Z1bmN0aW9uPzogRGVmYXVsdExhbmd1YWdlRnVuY3Rpb247XG4gIGFsd2F5c1NldFByZWZpeD86IGJvb2xlYW47XG59XG5cbmNvbnN0IExPQ0FMSVpFX0NBQ0hFX05BTUUgPSAnTE9DQUxJWkVfREVGQVVMVF9MQU5HVUFHRSc7XG5cbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlclNldHRpbmdzIGltcGxlbWVudHMgTG9jYWxpemVSb3V0ZXJDb25maWcge1xuICAvKipcbiAgICogU2V0dGluZ3MgZm9yIGxvY2FsaXplIHJvdXRlclxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChVU0VfQ0FDSEVEX0xBTkcpIHB1YmxpYyB1c2VDYWNoZWRMYW5nOiBib29sZWFuID0gdHJ1ZSxcbiAgICBASW5qZWN0KEFMV0FZU19TRVRfUFJFRklYKSBwdWJsaWMgYWx3YXlzU2V0UHJlZml4OiBib29sZWFuID0gdHJ1ZSxcbiAgICBASW5qZWN0KENBQ0hFX01FQ0hBTklTTSkgcHVibGljIGNhY2hlTWVjaGFuaXNtOiBDYWNoZU1lY2hhbmlzbSA9IENhY2hlTWVjaGFuaXNtLkxvY2FsU3RvcmFnZSxcbiAgICBASW5qZWN0KENBQ0hFX05BTUUpIHB1YmxpYyBjYWNoZU5hbWU6IHN0cmluZyA9IExPQ0FMSVpFX0NBQ0hFX05BTUUsXG4gICAgQEluamVjdChERUZBVUxUX0xBTkdfRlVOQ1RJT04pIHB1YmxpYyBkZWZhdWx0TGFuZ0Z1bmN0aW9uOiBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbiA9IHZvaWQgMFxuICApIHtcbiAgfVxufVxuIl19