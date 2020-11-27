import {AbstractConfigEnhancer} from '@genjs/genjs';

export class MicroserviceTypeConfigEnhancer extends AbstractConfigEnhancer {
    constructor(getAsset) {
        super(getAsset, 'code', 'microservice/type');
    }
    protected merge(a: any = {}, b: any = {}) {
        return {
            ...a,
            ...b,
            handlers: this.mergeHandlers(a.handlers, b.handlers),
            middlewares: this.mergeMiddlewares(a.middlewares, b.middlewares),
            backends: this.mergeBackends(a.backends, b.backends),
            mixins: this.mergeMixins(a.mixins, b.mixins),
            attributes: this.mergeAttributes(a.attributes, b.attributes),
            operations: this.mergeOperations(a.operations, b.operations),
            functions: this.mergeFunctions(a.functions, b.functions),
        };
    }
    mergeHandlers(a: any = {}, b: any = {}) {
        return this.mergeObjects(a, b);
    }
    mergeMiddlewares(a: any[] = [], b: any[] = []) {
        return this.mergeListOfStringsOrObjects(a, b);
    }
    mergeBackends(a: any[] = [], b: any[] = []) {
        return this.mergeListOfStringsOrObjects(a, b);
    }
    mergeAttributes(a: any = {}, b: any = {}) {
        return this.mergeObjects(a, b);
    }
    mergeFunctions(a: any = {}, b: any = {}) {
        return this.mergeObjects(a, b);
    }
    mergeOperations(a: any = {}, b: any = {}) {
        return this.mergeObjects(a, b);
    }
}

export default MicroserviceTypeConfigEnhancer