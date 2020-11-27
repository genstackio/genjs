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
            vars: this.mergeVars(a.vars, b.vars),
        }
    }
    protected mergeHooks(a: any = {}, b: any = {}) {
        return this.mergeMapOfLists(a, b);
    }
}

export default MicroserviceTypeOperationConfigEnhancer