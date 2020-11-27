import AbstractConfigEnhancer from '../AbstractConfigEnhancer';

export class PackageConfigEnhancer extends AbstractConfigEnhancer {
    constructor(getAsset) {
        super(getAsset, 'code', 'package', {parseType: false});
    }
    protected merge(a: any, b: any) {
        return {
            ...a,
            ...b,
            mixins: this.mergeMixins(a.mixins, b.mixins),
            vars: this.mergeVars(a.vars, b.vars),
        };
    }
}

export default PackageConfigEnhancer