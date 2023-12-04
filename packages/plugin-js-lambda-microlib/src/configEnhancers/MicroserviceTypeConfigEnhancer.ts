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
            indexes: this.mergeIndexes(a.indexes, b.indexes),
            authorizations: this.mergeAuthorizations(a.authorizations, b.authorizations),
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
    mergeAuthorizations(a: any = {}, b: any = {}) {
        return this.mergeObjects(a, b);
    }
    mergeFunctions(a: any = {}, b: any = {}) {
        return this.mergeObjects(a, b);
    }
    mergeOperations(a: any = {}, b: any = {}) {
        return this.mergeObjects(a, b);
    }
    mergeIndexes(a: any = {}, b: any = {}) {
        return this.mergeMapOfLists(a, b);
    }
    mergeObjectsWithAppend(a: any = {}, b: any = {}) {
        a = Object.entries(a).reduce((acc, [k, v]) => {
            if ('+' === k.slice(0, 1)) {
                k = k.slice(1);
                if (!acc[k]) acc[k] = {};
                acc[k] = this.mergeObjectsN1(acc[k], v);
                return acc;
            }
            acc[k] = v;
            return acc;
        }, {});
        return Object.entries(b).reduce((acc, [k, v]) => {
            if ('+' === k.slice(0, 1)) {
                k = k.slice(1);
                if (!acc[k]) acc[k] = {};
                acc[k] = this.mergeObjectsN1(acc[k], v);
                return acc;
            }
            acc[k] = v;
            return acc;
        }, a);
    }
    mergeObjectsN1(a: any = {}, b: any = {}) {
        if (!a || 'object' !== typeof a) a = {};
        if (!b || 'object' !== typeof b) b = {};
        return Object.entries(b).reduce((acc, [k, v]) => {
            if ((undefined === acc[k]) || (null === acc[k])) {
                acc[k] = v;
                return acc;
            }
            if (Array.isArray(v)) {
                if (Array.isArray(acc[k])) {
                    acc[k] = [...acc[k], ...v];
                    return acc;
                }
                acc[k] = v;
                return;
            }
            if ('object' === typeof v) {
                if ('object' === typeof acc[k]) {
                    acc[k] = {...acc[k], ...v};
                    return acc;
                }
                acc[k] = v;
                return acc;
            }
            acc[k] = v;
            return acc;
        }, a);
    }
}

export default MicroserviceTypeConfigEnhancer