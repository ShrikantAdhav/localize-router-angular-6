/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ROUTES } from '@angular/router';
import { SystemJsNgModuleLoader, SystemJsNgModuleLoaderConfig, Optional, Compiler, Injectable, Inject, forwardRef } from '@angular/core';
import { LocalizeParser } from './localize-router.parser';
/**
 * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
 */
export class LocalizeRouterConfigLoader extends SystemJsNgModuleLoader {
    /**
     * @param {?} localize
     * @param {?} _compiler
     * @param {?=} config
     */
    constructor(localize, _compiler, config) {
        super(_compiler, config);
        this.localize = localize;
    }
    /**
     * Extend load with custom functionality
     * @param {?} path
     * @return {?}
     */
    load(path) {
        return super.load(path).then((factory) => {
            return {
                moduleType: factory.moduleType,
                create: (parentInjector) => {
                    /** @type {?} */
                    const module = factory.create(parentInjector);
                    /** @type {?} */
                    const getMethod = module.injector.get.bind(module.injector);
                    module.injector['get'] = (token, notFoundValue) => {
                        /** @type {?} */
                        const getResult = getMethod(token, notFoundValue);
                        if (token === ROUTES) {
                            // translate lazy routes
                            return this.localize.initChildRoutes([].concat(...getResult));
                        }
                        else {
                            return getResult;
                        }
                    };
                    return module;
                }
            };
        });
    }
}
LocalizeRouterConfigLoader.decorators = [
    { type: Injectable },
];
LocalizeRouterConfigLoader.ctorParameters = () => [
    { type: LocalizeParser, decorators: [{ type: Inject, args: [forwardRef(() => LocalizeParser),] }] },
    { type: Compiler },
    { type: SystemJsNgModuleLoaderConfig, decorators: [{ type: Optional }] }
];
if (false) {
    /** @type {?} */
    LocalizeRouterConfigLoader.prototype.localize;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLWNvbmZpZy1sb2FkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci8iLCJzb3VyY2VzIjpbImxpYi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsNEJBQTRCLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFDakYsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7O0FBTTFELE1BQU0saUNBQWtDLFNBQVEsc0JBQXNCOzs7Ozs7SUFFcEUsWUFBOEQsUUFBd0IsRUFDcEYsU0FBbUIsRUFBYyxNQUFxQztRQUNwRSxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRmlDLGFBQVEsR0FBUixRQUFRLENBQWdCO0lBR3RGLENBQUM7Ozs7OztJQUtELElBQUksQ0FBQyxJQUFZO1FBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBNkIsRUFBRSxFQUFFO1lBQzdELE1BQU0sQ0FBQztnQkFDTCxVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7Z0JBQzlCLE1BQU0sRUFBRSxDQUFDLGNBQXdCLEVBQUUsRUFBRTs7MEJBQzdCLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQzs7MEJBQ3ZDLFNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFFM0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQVUsRUFBRSxhQUFrQixFQUFFLEVBQUU7OzhCQUNwRCxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUM7d0JBRWpELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUNyQix3QkFBd0I7NEJBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDaEUsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDTixNQUFNLENBQUMsU0FBUyxDQUFDO3dCQUNuQixDQUFDO29CQUNILENBQUMsQ0FBQztvQkFDRixNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNoQixDQUFDO2FBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBakNGLFVBQVU7OztZQUxGLGNBQWMsdUJBUVIsTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFWWixRQUFRO1lBQWhELDRCQUE0Qix1QkFXSixRQUFROzs7O0lBRHBCLDhDQUEwRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJPVVRFUyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1xuICBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyLCBOZ01vZHVsZUZhY3RvcnksIEluamVjdG9yLFxuICBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyQ29uZmlnLCBPcHRpb25hbCwgQ29tcGlsZXIsIEluamVjdGFibGUsIEluamVjdCwgZm9yd2FyZFJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcblxuLyoqXG4gKiBFeHRlbnNpb24gb2YgU3lzdGVtSnNOZ01vZHVsZUxvYWRlciB0byBlbmFibGUgbG9jYWxpemF0aW9uIG9mIHJvdXRlIG9uIGxhenkgbG9hZFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJDb25maWdMb2FkZXIgZXh0ZW5kcyBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyIHtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTG9jYWxpemVQYXJzZXIpKSBwcml2YXRlIGxvY2FsaXplOiBMb2NhbGl6ZVBhcnNlcixcbiAgICBfY29tcGlsZXI6IENvbXBpbGVyLCBAT3B0aW9uYWwoKSBjb25maWc/OiBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyQ29uZmlnKSB7XG4gICAgICBzdXBlcihfY29tcGlsZXIsIGNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogRXh0ZW5kIGxvYWQgd2l0aCBjdXN0b20gZnVuY3Rpb25hbGl0eVxuICAgKi9cbiAgbG9hZChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPE5nTW9kdWxlRmFjdG9yeTxhbnk+PiB7XG4gICAgcmV0dXJuIHN1cGVyLmxvYWQocGF0aCkudGhlbigoZmFjdG9yeTogTmdNb2R1bGVGYWN0b3J5PGFueT4pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1vZHVsZVR5cGU6IGZhY3RvcnkubW9kdWxlVHlwZSxcbiAgICAgICAgY3JlYXRlOiAocGFyZW50SW5qZWN0b3I6IEluamVjdG9yKSA9PiB7XG4gICAgICAgICAgY29uc3QgbW9kdWxlID0gZmFjdG9yeS5jcmVhdGUocGFyZW50SW5qZWN0b3IpO1xuICAgICAgICAgIGNvbnN0IGdldE1ldGhvZCA9IG1vZHVsZS5pbmplY3Rvci5nZXQuYmluZChtb2R1bGUuaW5qZWN0b3IpO1xuXG4gICAgICAgICAgbW9kdWxlLmluamVjdG9yWydnZXQnXSA9ICh0b2tlbjogYW55LCBub3RGb3VuZFZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGdldFJlc3VsdCA9IGdldE1ldGhvZCh0b2tlbiwgbm90Rm91bmRWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gUk9VVEVTKSB7XG4gICAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSBsYXp5IHJvdXRlc1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGl6ZS5pbml0Q2hpbGRSb3V0ZXMoW10uY29uY2F0KC4uLmdldFJlc3VsdCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGdldFJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==