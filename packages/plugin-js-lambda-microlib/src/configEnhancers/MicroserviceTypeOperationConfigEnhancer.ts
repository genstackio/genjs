import {AbstractConfigEnhancer} from '@genjs/genjs';

export class MicroserviceTypeOperationConfigEnhancer extends AbstractConfigEnhancer {
    constructor(getAsset) {
        super(getAsset, 'code', 'microservice/type/operation');
    }
    protected merge(a: any = {}, b: any = {}) {
        return {
            ...a,
            ...b,
            mixins: this.mergeMixins(a.mixins, b.mixins),
            hooks: this.mergeHooks(a.hooks, b.hooks),
            enhancers: this.mergeEnhancers(a.enhancers, b.enhancers),
            vars: this.mergeVars(a.vars, b.vars),
            config: this.mergeExtraConfig(a.config, b.config),
        }
    }
    protected mergeHooks(a: any = {}, b: any = {}) {
        return this.mergeMapOfLists(a, b);
    }
    protected mergeEnhancers(a: any = {}, b: any = {}) {
        return this.mergeMapOfLists(a, b);
    }
    protected mergeExtraConfig(a: any = {}, b: any = {}) {
        return this.mergeObjects(a, b);
    }
}

export default MicroserviceTypeOperationConfigEnhancer