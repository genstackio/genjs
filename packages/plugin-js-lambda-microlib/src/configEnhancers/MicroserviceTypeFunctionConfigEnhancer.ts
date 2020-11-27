import {AbstractConfigEnhancer} from '@genjs/genjs';

export class MicroserviceTypeFunctionConfigEnhancer extends AbstractConfigEnhancer {
    constructor(getAsset) {
        super(getAsset, 'code', 'microservice/type/function');
    }
    protected merge(a: any = {}, b: any = {}) {
        return {
            ...a,
            ...b,
            mixins: this.mergeMixins(a.mixins, b.mixins),
            vars: this.mergeVars(a.vars, b.vars),
        }
    }
}

export default MicroserviceTypeFunctionConfigEnhancer