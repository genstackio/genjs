import {AbstractConfigEnhancer} from '@genjs/genjs';

export class MicroserviceConfigEnhancer extends AbstractConfigEnhancer {
    constructor(getAsset) {
        super(getAsset, 'code', 'microservice');
    }
    protected merge(a: any = {}, b: any = {}) {
        return {
            ...a,
            ...b,
            mixins: this.mergeMixins(a.mixins, b.mixins),
            types: this.mergeTypes(a.types, b.types),
        };
    }
    protected mergeTypes(a: any = {}, b: any = {}) {
        return {...a, ...b};
    }
}

export default MicroserviceConfigEnhancer