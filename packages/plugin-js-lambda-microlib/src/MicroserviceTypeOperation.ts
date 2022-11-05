import Handler from './Handler';
import MicroserviceType from './MicroserviceType';
import MicroserviceTypeOperationConfigEnhancer from "./configEnhancers/MicroserviceTypeOperationConfigEnhancer";

export type MicroserviceTypeOperationConfig = {
    microserviceType: MicroserviceType,
    name: string,
    type: string|undefined,
    as: string|undefined,
    middlewares: string[],
    errorMiddlewares: string[],
    backend: string|{name: string, method?: string, args?: string[], [key: string]: any},
    vars: {[key: string]: any},
    prefetch: string[],
    hooks: {[key: string]: any[]},
    enhancers: {pre?: any[], post?: any[]},
    handler: boolean,
    wrap?: any,
    config?: {[key: string]: any},
};

export default class MicroserviceTypeOperation {
    public readonly name: string;
    public readonly handler?: Handler;
    public readonly microserviceType: MicroserviceType;
    constructor(microserviceType, cfg: MicroserviceTypeOperationConfig) {
        this.microserviceType = microserviceType;
        const configEnhancer = new MicroserviceTypeOperationConfigEnhancer(this.microserviceType.microservice.package.getAsset.bind(this.microserviceType.microservice.package));
        const {name, as = undefined, handler = true, config: extraOperationConfig = {}, middlewares = [], errorMiddlewares = [], backend, vars = {}, hooks = {}, enhancers = {}} = cfg.type ? configEnhancer.enhance(cfg, cfg.type) : cfg;
        this.name = name;
        this.handler = handler ? new Handler({name: `${microserviceType.name}_${this.name}`, type: 'service', middlewares, errorMiddlewares, directory: 'handlers', params: {
                on: this.name,
                m: microserviceType.name,
                b: backend,
                ...extraOperationConfig,
            }, vars: {
                ...vars,
                service: `crud/${microserviceType.name}`,
                method: name,
                paramsKey: true,
                configureService: false,
            }}) : undefined;
        const model = microserviceType.model;
        const opType = as || name;
        switch (opType) {
            case 'create':
                this.hasHooks('authorize', opType, microserviceType, name) && microserviceType.registerHook(name, 'authorize', {type: '@authorize', config: {}});
                this.hasHooks('pretransform', opType, microserviceType, name) && microserviceType.registerHook(name, 'pretransform', {type: '@pretransform', config: {}});
                this.hasHooks('validate', opType, microserviceType, name) && microserviceType.registerHook(name, 'validate', {type: '@validate', config: {}});
                this.hasHooks('transform', opType, microserviceType, name) && microserviceType.registerHook(name, 'transform', {type: '@transform', config: {}});
                this.hasHooks('prepopulate', opType, microserviceType, name) && microserviceType.registerHook(name, 'prepopulate', {type: '@prepopulate', config: {}});
                this.hasHooks('populate', opType, microserviceType, name) && microserviceType.registerHook(name, 'populate', {type: '@populate', config: {}});
                this.hasHooks('prepare', opType, microserviceType, name) && microserviceType.registerHook(name, 'prepare', {type: '@prepare', config: {}});
                this.hasHooks('after', opType, microserviceType, name) && microserviceType.registerHook(name, 'after', {type: '@after', config: {}});
                this.hasHooks('convert', opType, microserviceType, name) && microserviceType.registerHook(name, 'convert', {type: '@convert', config: {}});
                this.hasHooks('autoTransitionTo', opType, microserviceType, name) && microserviceType.registerHook(name, 'end', {type: '@auto-transitions', config: {}});
                this.hasHooks('dynamics', opType, microserviceType, name) && microserviceType.registerHook(name, 'postpopulate', {type: '@dynamics', config: {}});
                this.hasHooks('triggers', opType, microserviceType, name) && microserviceType.registerHook(name, 'notify', {type: '@triggers', config: {}});
                this.hasHooks('watch', opType, microserviceType, name) && microserviceType.registerHook(name, 'populate', {type: '@refresh', config: {}});
                Object.entries(model.ownedReferenceListFields || {}).forEach(([k, v]: [string, any]) =>
                    microserviceType.registerHook(name, 'after', {type: '@create-owned-items', config: {...v, field: k, mode: 'post'}})
                );
                break;
            case 'update':
                this.hasHooks('authorize', opType, microserviceType, name) && microserviceType.registerHook(name, 'authorize', {type: '@authorize', config: {}});
                this.hasHooks('prefetch', opType, microserviceType, name) && microserviceType.registerHook(name, 'init', {type: '@prefetch'});
                this.hasHooks('pretransform', opType, microserviceType, name) && microserviceType.registerHook(name, 'pretransform', {type: '@pretransform', config: {}});
                this.hasHooks('validate', opType, microserviceType, name) && microserviceType.registerHook(name, 'validate', {type: '@validate', config: {required: false}});
                this.hasHooks('transform', opType, microserviceType, name) && microserviceType.registerHook(name, 'transform', {type: '@transform', config: {}});
                this.hasHooks('prepopulate', opType, microserviceType, name) && microserviceType.registerHook(name, 'prepopulate', {type: '@prepopulate', config: {prefix: 'update'}});
                this.hasHooks('populate', opType, microserviceType, name) && microserviceType.registerHook(name, 'populate', {type: '@populate', config: {prefix: 'update'}});
                this.hasHooks('prepare', opType, microserviceType, name) && microserviceType.registerHook(name, 'prepare', {type: '@prepare', config: {}});
                this.hasHooks('after', opType, microserviceType, name) && microserviceType.registerHook(name, 'after', {type: '@after', config: {}});
                this.hasHooks('convert', opType, microserviceType, name) && microserviceType.registerHook(name, 'convert', {type: '@convert', config: {}});
                this.hasHooks('watch', opType, microserviceType, name) && microserviceType.registerHook(name, 'populate', {type: '@refresh', config: {}});
                Object.entries(model.ownedReferenceListFields || {}).forEach(([k, v]: [string, any]) =>
                    microserviceType.registerHook(name, 'after', {type: '@update-owned-items', config: {...v, field: k, mode: 'post'}})
                );
                break;
            case 'get':
                this.hasHooks('convert', opType, microserviceType, name) && microserviceType.registerHook(name, 'convert', {type: '@convert', config: {}});
                this.hasHooks('prefetch-read', opType, microserviceType, name) && microserviceType.registerHook(name, 'init', {type: '@prefetch', config: {mode: 'requires-only'}});
                this.hasHooks('dynamics', opType, microserviceType, name) && microserviceType.registerHook(name, 'postpopulate', {type: '@dynamics', config: {}});
                this.hasHooks('requires', opType, microserviceType, name) && microserviceType.registerHook(name, 'init', {type: '@requires', config: {}});
                break;
            case 'find':
                this.hasHooks('convert', opType, microserviceType, name) && microserviceType.registerHook(name, 'convert', {type: '@convert', config: {mode: 'page'}});
                //this.hasHooks('prefetch-read', opType, microserviceType, name) && microserviceType.registerHook(name, 'init', {type: '@prefetch', config: {mode: 'requires-only'}});
                this.hasHooks('dynamics', opType, microserviceType, name) && microserviceType.registerHook(name, 'postpopulate', {type: '@dynamics', config: {mode: 'page'}});
                this.hasHooks('requires', opType, microserviceType, name) && microserviceType.registerHook(name, 'init', {type: '@requires', config: {mode: 'page'}});
                break;
            case 'delete':
                this.hasHooks('authorize', opType, microserviceType, name) && microserviceType.registerHook(name, 'authorize', {type: '@authorize', config: {}});
                this.hasHooks('prefetch', opType, microserviceType, name) && microserviceType.registerHook(name, 'init', {type: '@prefetch'});
                this.hasHooks('convert', opType, microserviceType, name) && microserviceType.registerHook(name, 'convert', {type: '@convert', config: {}});
                Object.entries(model.ownedReferenceListFields || {}).forEach(([k, v]: [string, any]) =>
                    microserviceType.registerHook(name, 'after', {type: '@delete-owned-items', config: {...v, field: k, mode: 'post'}})
                );
                break;
            default:
                break;
        }
        const {pre: preEnhancers = {}, post: postEnhancers = {}} = enhancers || {};
        Object.keys(preEnhancers).length && microserviceType.registerHook(this.name, 'pre_enhance', {type: '@pre-enhance', config: {}});
        Object.keys(postEnhancers).length && microserviceType.registerHook(this.name, 'post_enhance', {type: '@post-enhance', config: {}});
        Object.entries(hooks).forEach(([k, v]) => {
            (v as any[]).forEach(h => microserviceType.registerHook(this.name, k, h));
        });
    }
    // noinspection JSUnusedLocalSymbols
    hasHooks(type: string, operation: string, microserviceType: MicroserviceType, realOperationName: string): boolean {
        switch (type) {
            case 'authorize':
                return !!Object.keys(microserviceType.model.authorizers || {}).length;
            case 'prefetch':
                return !!Object.keys(microserviceType.model.prefetchs || {}).length || !!Object.keys(microserviceType.model.requires || {}).length;
            case 'prefetch-read':
                return !!Object.keys(microserviceType.model.requires || {}).length;
            case 'validate':
                return !!Object.keys(microserviceType.model.fields || {}).length;
            case 'transform':
                return !!Object.keys(microserviceType.model.transformers || {}).length;
            case 'pretransform':
                return !!Object.keys(microserviceType.model.pretransformers || {}).length;
            case 'convert':
                return !!Object.keys(microserviceType.model.converters || {}).length;
            case 'mutator':
                return !!Object.keys(microserviceType.model.mutators || {}).length;
            case 'prepopulate':
                switch (operation) {
                    case 'create':
                        return !!Object.keys(microserviceType.model.defaultValues || {}).length || !!Object.keys(microserviceType.model.cascadeValues || {}).length;
                    case 'update':
                        return !!Object.keys(microserviceType.model.updateDefaultValues || {}).length || !!Object.keys(microserviceType.model.cascadeValues || {}).length;
                    default:
                        return false;
                }
            case 'populate':
                switch (operation) {
                    case 'create':
                        return !!Object.keys(microserviceType.model.values || {}).length;
                    case 'update':
                        return !!Object.keys(microserviceType.model.updateValues || {}).length;
                    default:
                        return false;
                }
            case 'dynamics':
                return !!Object.keys(microserviceType.model.dynamics || {}).length;
            case 'triggers':
                return !!Object.keys(microserviceType.model.triggers || {}).length;
            case 'watch':
                return !!Object.keys(microserviceType.model.watches || {}).length;
            case 'requires':
                return !!Object.keys(microserviceType.model.requires || {}).length;
            case 'prepare':
                return !!Object.keys(microserviceType.model.volatileFields || {}).length;
            case 'after':
                return !!Object.keys(microserviceType.model.volatileFields || {}).length;
            case 'autoTransitionTo':
                return !!Object.keys(microserviceType.model.autoTransitionTo || {}).length;
            default:
                return false;
        }
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        return this.handler ? this.handler.generate(vars) : Promise.resolve({});
    }
}