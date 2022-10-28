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
        m = this.buildFinalizedModelTriggers(m, enrichments);
        m = this.buildFinalizedModelWatches(m, enrichments);
        m = this.buildFinalizedModelStatFields(m, enrichments);
        m = this.buildFinalizedModelStatTargets(m, enrichments);
        m = this.buildFinalizedModelTransformers(m, enrichments);
        m = this.buildFinalizedModelEnhancers(m, enrichments);
        m = this.buildFinalizedModelCascadeValues(m, enrichments);
        m = this.buildFinalizedModelOwnedReferenceListFields(m, enrichments);
        m = this.buildFinalizedModelUpdateDefaultValues(m, enrichments);
        m = this.buildFinalizedModelAutoTransitionTo(m, enrichments);
        m = this.buildFinalizedModelMultiRefAttributeTargetFields(m, enrichments);
        m = this.clean(m);
        m = this.sort(m);
        return m;
    }
    protected clean(m: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'defaultValues');
        m = this.cleanObjectKeyIfEmpty(m, 'fields');
        m = this.cleanObjectKeyIfEmpty(m, 'privateFields');
        m = this.cleanObjectKeyIfEmpty(m, 'indexes', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'refAttributeFields', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'referenceFields');
        m = this.cleanObjectKeyIfEmpty(m, 'requiredFields');
        m = this.cleanObjectKeyIfEmpty(m, 'updateValues');
        m = this.cleanObjectKeyIfEmpty(m, 'validators', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'values');
        m = this.cleanObjectKeyIfEmpty(m, 'dynamics');
        m = this.cleanObjectKeyIfEmpty(m, 'triggers');
        m = this.cleanObjectKeyIfEmpty(m, 'watchTargets');
        m = this.cleanObjectKeyIfEmpty(m, 'statFields');
        m = this.cleanObjectKeyIfEmpty(m, 'statTargets', 'object');
        m = this.cleanObjectKeyIfEmpty(m, 'transformers', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'cascadeValues');
        m = this.cleanObjectKeyIfEmpty(m, 'ownedReferenceListFields');
        m = this.cleanObjectKeyIfEmpty(m, 'updateDefaultValues');
        m = this.cleanObjectKeyIfEmpty(m, 'autoTransitionTo');
        m = this.cleanObjectKeyIfEmpty(m, 'multiRefAttributeTargetFields', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'converters', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'requires', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'mutators', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'pretransformers', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'authorizers', 'array');
        m = this.cleanObjectKeyIfEmpty(m, 'prefetchs', 'object');
        m = this.cleanObjectKeyIfEmpty(m, 'enhancers', 'strict_object');
        m = this.cleanObjectKeyIfEmpty(m, 'referenceTargets', 'object');
        return m;
    }
    protected sort(m: any) {
        m.defaultValues && (m.defaultValues = this.sortObject(m.defaultValues));
        m.fields && (m.fields = this.sortObject(m.fields));
        m.privateFields && (m.privateFields = this.sortObject(m.privateFields));
        m.indexes && (m.indexes = this.sortObject(m.indexes));
        m.refAttributeFields && (m.refAttributeFields = this.sortObject(m.refAttributeFields));
        m.referenceFields && (m.referenceFields = this.sortObject(m.referenceFields));
        m.requiredFields && (m.requiredFields = this.sortObject(m.requiredFields));
        m.updateValues && (m.updateValues = this.sortObject(m.updateValues));
        m.validators && (m.validators = this.sortObject(m.validators));
        m.values && (m.values = this.sortObject(m.values));
        m.dynamics && (m.dynamics = this.sortObject(m.dynamics));
        m.triggers && (m.triggers = this.sortObject(m.triggers));
        m.watchTargets && (m.watchTargets = this.sortObject(m.watchTargets));
        m.statFields && (m.statFields = this.sortObject(m.statFields));
        m.statTargets && (m.statTargets = this.sortObject(m.statTargets));
        m.transformers && (m.transformers = this.sortObject(m.transformers));
        m.cascadeValues && (m.cascadeValues = this.sortObject(m.cascadeValues));
        m.ownedReferenceListFields && (m.ownedReferenceListFields = this.sortObject(m.ownedReferenceListFields));
        m.updateDefaultValues && (m.updateDefaultValues = this.sortObject(m.updateDefaultValues));
        m.autoTransitionTo && (m.autoTransitionTo = this.sortObject(m.autoTransitionTo));
        m.multiRefAttributeTargetFields && (m.multiRefAttributeTargetFields = this.sortObject(m.multiRefAttributeTargetFields));
        m.converters && (m.converters = this.sortObject(m.converters));
        m.requires && (m.requires = this.sortObject(m.requires));
        m.mutators && (m.mutators = this.sortObject(m.mutators));
        m.pretransformers && (m.pretransformers = this.sortObject(m.pretransformers));
        m.authorizers && (m.authorizers = this.sortObject(m.authorizers));
        m.prefetchs && (m.prefetchs = this.sortObject(m.prefetchs));
        m.enhancers && (m.enhancers = this.sortObject(m.enhancers));
        m.referenceTargets && (m.referenceTargets = this.sortObject(m.referenceTargets));
        return this.sortObject(m);
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelDefaultValues(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelFields(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelPrivateFields(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelIndexes(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelRefAttributeFields(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelReferenceFields(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelRequiredFields(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelUpdateValues(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelValidators(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelValues(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelDynamics(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelTriggers(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelWatches(m: any, enrichments: any) {
        if (!enrichments.watch) return m;

        m.watchTargets = enrichments.watch.reduce((acc, w) => {
            acc[w.track] = acc[w.track] || [];
            acc[w.track] = [...acc[w.track], ...w.notify]
            acc[w.track].sort();
            return acc;
        }, m.watchTargets || {} as any);

        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelStatFields(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelStatTargets(m: any, enrichments: any) {
        m.statTargets = (enrichments.stat || []).reduce((acc: any, {type, operation, targetField, idField = 'id', ...s}: any) => {
            acc[operation] = acc[operation] || {};
            acc[operation][type] = acc[operation][type] || {};
            const kk = `${s.join}__${idField || 'id'}`;
            acc[operation][type][kk] = acc[operation][type][kk] || {};
            if (acc[operation][type][kk][targetField]) {
                throw new Error(`Multiple stat from the same event and on the same target field are not allowed (${operation} => ${type}.${targetField})`);
            }
            acc[operation][type][kk][targetField] = s;
            if (s?.action?.config?.value) {
                const operations = [operation];
                if ((operation !== 'delete') && (operation !== 'update') && (operation !== 'create')) {
                    operations.push('update');
                }
                operations.forEach((ope: string) => {
                    // trying to detect the prefetchs from the `value` expression
                    if ('%' === s.action.config.value.slice(0, 1)) {
                        m.prefetchs = m.prefetchs || {};
                        m.prefetchs[ope] = m.prefetchs[ope] || {};
                        m.prefetchs[ope][s.action.config.value.slice(1)] = true;
                    } else if (/old\.([a-z0-9_]+)/.test(s.action.config.value)) {
                        Array.from(s.action.config.value.matchAll(/old\.([a-z0-9_]+)/ig)).forEach((a: any) => {
                            m.prefetchs = m.prefetchs || {};
                            m.prefetchs[ope] = m.prefetchs[ope] || {};
                            m.prefetchs[ope][a[1]] = true;
                        })
                    }
                });
            }
            return acc;
        }, {});
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelTransformers(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelCascadeValues(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelOwnedReferenceListFields(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelUpdateDefaultValues(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelAutoTransitionTo(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelMultiRefAttributeTargetFields(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelConverters(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelRequires(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelEnhancers(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelMutators(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelPretransformers(m: any, enrichments: any) {
        return m;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFinalizedModelAuthorizers(m: any, enrichments: any) {
        return m;
    }
    protected buildFinalizedModelReferences(m: any, enrichments: any) {
        if (!enrichments?.reference) return m;

        // 1. add all required prefetchs
        m.prefetchs = enrichments.reference.reduce((acc: any, ref: any) => {
            acc['update'] = ref.fields.reduce((acc2: any, field: string) => {
                acc2[field] = true;
                return acc2;
            }, {...(acc['update'] || {})});
            return acc;
        }, {...(m.prefetchs || {})});

        // 2. add the `referenceTargets` attribute
        m.referenceTargets = enrichments.reference.reduce((acc: any, ref: any) => {
            acc[ref.type] = acc[ref.type] || {};
            const kk = `${ref.join}__${ref.idField}`;
            acc[ref.type][kk] = acc[ref.type][kk] || {join: ref.join, idField: ref.idField, trackedFields: {}};
            acc[ref.type][kk].trackedFields = ref.fields.reduce((acc2: any, field: string) => {
                acc2[field] = {};
                return acc2;

            }, acc[ref.type][kk].trackedFields);
            if (ref.fieldTargets && Object.keys(ref.fieldTargets).length) {
                acc[ref.type][kk].fieldTargets = acc[ref.type][kk].fieldTargets || {};
                acc[ref.type][kk].fieldTargets = {...acc[ref.type][kk].fieldTargets, ...ref.fieldTargets};
            }
            return acc;
        }, {...(m.referenceTargets || {})});
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
            case 'strict_object':
                if (0 === Object.entries(o[key] || {}).reduce((acc: number, [kk, v]: [string, any]) => {
                    if (!Object.keys(v).length) {
                        delete o[key][kk];
                        return acc;
                    }
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