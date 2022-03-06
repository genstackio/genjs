export class ModelEnhancer {
    // noinspection JSUnusedLocalSymbols
    enhance(name: string, baseModel: any, enrichments: any, vars?: any) {
        enrichments = enrichments || {};
        let m = {...baseModel};
        m = this.buildFinalizedModelReferences(m, enrichments);
        m = this.buildFinalizedModelDefaultValues(m, enrichments);
        m = this.buildFinalizedModelFields(m, enrichments);
        m = this.buildFinalizedModelIndexes(m, enrichments);
        m = this.buildFinalizedModelPrivateFields(m, enrichments);
        m = this.buildFinalizedModelRefAttributeFields(m, enrichments);
        m = this.buildFinalizedModelReferenceFields(m, enrichments);
        m = this.buildFinalizedModelRequiredFields(m, enrichments);
        m = this.buildFinalizedModelRequires(m, enrichments);
        m = this.buildFinalizedModelAuthorizers(m, enrichments);
        m = this.buildFinalizedModelMutators(m, enrichments);
        m = this.buildFinalizedModelPretransformers(m, enrichments);
        m = this.buildFinalizedModelConverters(m, enrichments);
        m = this.buildFinalizedModelUpdateValues(m, enrichments);
        m = this.buildFinalizedModelValidators(m, enrichments);
        m = this.buildFinalizedModelValues(m, enrichments);
        m = this.buildFinalizedModelDynamics(m, enrichments);
        m = this.buildFinalizedModelStatFields(m, enrichments);
        m = this.buildFinalizedModelStatTargets(m, enrichments);
        m = this.buildFinalizedModelTransformers(m, enrichments);
        m = this.buildFinalizedModelCascadeValues(m, enrichments);
        m = this.buildFinalizedModelOwnedReferenceListFields(m, enrichments);
        m = this.buildFinalizedModelUpdateDefaultValues(m, enrichments);
        m = this.buildFinalizedModelAutoTransitionTo(m, enrichments);
        m = this.buildFinalizedModelMultiRefAttributeTargetFields(m, enrichments);
        m = this.sortObject(m);
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelDefaultValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'defaultValues');
        m.defaultValues && (m.defaultValues = this.sortObject(m.defaultValues));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'fields');
        m.fields && (m.fields = this.sortObject(m.fields));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelPrivateFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'privateFields');
        m.privateFields && (m.privateFields = this.sortObject(m.privateFields));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelIndexes(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'indexes', 'array');
        m.indexes && (m.indexes = this.sortObject(m.indexes));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelRefAttributeFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'refAttributeFields', 'array');
        m.refAttributeFields && (m.refAttributeFields = this.sortObject(m.refAttributeFields));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelReferenceFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'referenceFields');
        m.referenceFields && (m.referenceFields = this.sortObject(m.referenceFields));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelRequiredFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'requiredFields');
        m.requiredFields && (m.requiredFields = this.sortObject(m.requiredFields));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelUpdateValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'updateValues');
        m.updateValues && (m.updateValues = this.sortObject(m.updateValues));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelValidators(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'validators', 'array');
        m.validators && (m.validators = this.sortObject(m.validators));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'values');
        m.values && (m.values = this.sortObject(m.values));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelDynamics(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'dynamics');
        m.dynamics && (m.dynamics = this.sortObject(m.dynamics));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelStatFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'statFields');
        m.statFields && (m.statFields = this.sortObject(m.statFields));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelStatTargets(m: any, enrichments: any) {
        m.statTargets = (enrichments.stat || []).reduce((acc: any, {on, type, field, ...s}: any) => {
            const operation = on.replace(/^.+_([^_]+)$/, '$1');
            acc[operation] = acc[operation] || {};
            acc[operation][type] = acc[operation][type] || {};
            if (acc[operation][type][field]) {
                throw new Error(`Multiple stat from the same event and on the same target field are not allowed (${on} => ${type}.${field})`);
            }
            acc[operation][type][field] = s;
            return acc;
        }, {});
        m = this.cleanObjectKeyIfEmpty(m, 'statTargets', 'array');
        m.statTargets && (m.statTargets = this.sortObject(m.statTargets));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelTransformers(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'transformers', 'array');
        m.transformers && (m.transformers = this.sortObject(m.transformers));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelCascadeValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'cascadeValues');
        m.cascadeValues && (m.cascadeValues = this.sortObject(m.cascadeValues));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelOwnedReferenceListFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'ownedReferenceListFields');
        m.ownedReferenceListFields && (m.ownedReferenceListFields = this.sortObject(m.ownedReferenceListFields));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelUpdateDefaultValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'updateDefaultValues');
        m.updateDefaultValues && (m.updateDefaultValues = this.sortObject(m.updateDefaultValues));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelAutoTransitionTo(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'autoTransitionTo');
        m.autoTransitionTo && (m.autoTransitionTo = this.sortObject(m.autoTransitionTo));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelMultiRefAttributeTargetFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'multiRefAttributeTargetFields', 'array');
        m.multiRefAttributeTargetFields && (m.multiRefAttributeTargetFields = this.sortObject(m.multiRefAttributeTargetFields));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelConverters(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'converters', 'array');
        m.converters && (m.converters = this.sortObject(m.converters));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelRequires(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'requires', 'array');
        m.requires && (m.requires = this.sortObject(m.requires));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelMutators(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'mutators', 'array');
        m.mutators && (m.mutators = this.sortObject(m.mutators));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelPretransformers(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'pretransformers', 'array');
        m.pretransformers && (m.pretransformers = this.sortObject(m.pretransformers));
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelAuthorizers(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'authorizers', 'array');
        m.authorizers && (m.authorizers = this.sortObject(m.authorizers));
        return m;
    }
    protected buildFinalizedModelReferences(m: any, enrichments: any) {
        if (!enrichments?.reference) return m;
        m.prefetchs = enrichments.reference.reduce((acc: any, ref: any) => {
            acc['update'] = ref.fields.reduce((acc2: any, field: string) => {
                acc2[field] = true;
                return acc2;
            }, {...(acc['update'] || {})});
            return acc;
        }, {...(m.prefetchs || {})});
        this.cleanObjectKeyIfEmpty(m, 'prefetchs', 'object');
        m.prefetchs && (m.prefetchs = this.sortObject(m.prefetchs));
        return m;
    }
    protected sortObject(o: any) {
        const keys = Object.keys(o);
        keys.sort();
        return keys.reduce((acc: any, k: string) => Object.assign(acc, {[k]: o[k]}), {});
    }
    protected cleanObjectKeyIfEmpty(o: any, key: string, mode: string = 'default') {
        if ('undefined' === typeof o[key]) return o;
        if (!o[key] || !Object.keys(o[key]).length) delete o[key];
        switch (mode) {
            case 'object':
                if (0 === Object.entries(o[key] || {}).reduce((acc: number, [_, v]: [string, any]) => {
                    return acc + Object.keys(v).length;
                }, 0)) {
                    delete o[key];
                }
                break;
            case 'array':
                if (0 === Object.entries(o[key] || {}).reduce((acc: number, [_, v]: [string, any]) => {
                    return acc + v.length;
                }, 0)) {
                    delete o[key];
                }
                break;
            default:
                break;
        }
        return o;
    }
}