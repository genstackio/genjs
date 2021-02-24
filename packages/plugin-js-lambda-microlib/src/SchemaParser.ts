import * as fieldTypes from './fieldTypes';
import * as fieldModifiers from './fieldModifiers';
import * as fieldPrefixes from './fieldPrefixes';

export default class SchemaParser {
    public readonly fieldTypes: {[key: string]: Function} = {};
    public readonly fieldModifiers: {[key: string]: {priority: number, parse: Function}} = {};
    public readonly parsers: {[key: string]: Function} = {};
    public readonly fieldPrefixes: {[key: string]: {prefixes: string[], parse: Function}} = {};
    public readonly modifiers: {priority: number, name: string, parse: Function}[];
    constructor({fieldTypes: customFieldTypes = {}, fieldModifiers: customFieldModifiers = {}, fieldPrefixes: customFieldPrefixes = {}} = {}) {
        // fieldTypes
        Object.entries(fieldTypes).forEach(([k, v]) => this.fieldTypes[k] = v);
        Object.entries(customFieldTypes).forEach(([k, v]) => this.fieldTypes[k] = v as Function);
        // fieldModifiers
        Object.entries(fieldModifiers).forEach(([k, v]) => this.fieldModifiers[k] = v);
        Object.entries(customFieldModifiers).forEach(([k, v]) => this.fieldModifiers[k] = v as {priority: number, parse: Function});
        this.modifiers = Object.entries(this.fieldModifiers).reduce((acc, [k, v]) => {
            acc.push({name: k, ...v});
            return acc;
        }, [] as any[]);
        this.modifiers.sort((a, b) => a.priority - b.priority);
        // fieldPrefixes
        Object.entries(fieldPrefixes).forEach(([k, v]) => this.fieldPrefixes[k] = v);
        Object.entries(customFieldPrefixes).forEach(([k, v]) => this.fieldPrefixes[k] = v as {prefixes: [], parse: Function});
        this.parsers = Object.values(this.fieldPrefixes).reduce((acc, {prefixes, parse}: any) =>
                prefixes.reduce((acc2, p) => Object.assign(acc2, {[p]: parse}), acc)
            , {} as any) as any;
    }
    parse(def: any): any {
        def = {name: 'unknown', attributes: {}, operations: {}, ...def};
        const schema = this.createSchema(def);
        this.parseAttributes(def, schema);
        this.parseRefAttributeFields(def, schema);
        this.parseOperations(def, schema);
        return this.cleanSchema(schema);
    }
    parseOperations(def: any, schema: any) {
        Object.entries(def.operations).reduce((acc, [k, d]) => {
            if (!d || !(<any>d)['prefetch']) return acc;
            Object.assign(acc.prefetchs[k] = acc.prefetchs[k] || {}, (<any>d).prefetch.reduce((acc2, k) => Object.assign(acc2, {[k]: true}), {}));
            return acc;
        }, schema);
    }
    parseAttributes(def: any, schema: any) {
        Object.entries(def.attributes).reduce((acc, [k, d]) => {
            d = {
                config: {},
                internal: false, required: false, primaryKey: false, volatile: false, unique: false,
                reference: <any>undefined, refAttribute: <any>undefined, validators: [],
                ownedReferenceList: <any>undefined,
                index: <any>[],
                type: 'string',
                ...(('string' === typeof d) ? {type: d} : (d as object)),
            };
            this.parseField(d, k, schema)
            const forcedDef: any = {...(<any>d || {})};
            delete forcedDef.config;
            delete forcedDef.type;
            let officialDef = this.createField(d);
            const def = {
                ...officialDef,
                ...forcedDef,
                validators: [].concat(officialDef.validators || [], forcedDef.validators || []),
            };
            const {
                unique = false, type = 'string', prefetch = false, list = false, volatile = false, required = false, index = [], internal = false, validators = undefined, primaryKey = false,
                value = undefined, default: rawDefaultValue = undefined, defaultValue = undefined, updateValue = undefined, updateDefault: rawUpdateDefaultValue = undefined, updateDefaultValue = undefined,
                upper = false, lower = false, transform = undefined, reference = undefined, ownedReferenceList = undefined, refAttribute = undefined,
                autoTransitionTo = undefined, cascadePopulate = undefined, cascadeClear = undefined, permissions = undefined, authorizers = [],
                pretransform = undefined, convert = undefined, mutate = undefined,
                dynamic = undefined, from = undefined, requires = undefined, stat = undefined,
            } = def;
            const detectedRequires = this.buildDetectedRequires(def);
            acc.fields[k] = {
                type, primaryKey, volatile,
                ...((index && index.length > 0) ? {index} : {}),
                ...(list ? {list} : {}),
            };
            acc.authorizers[k] = [];
            acc.requires[k] = [];
            acc.multiRefAttributeTargetFields[k] = [];
            acc.indexes[k] = acc.indexes[k] || [];
            acc.mutators[k] = mutate ? (Array.isArray(mutate) ? [...mutate] : [mutate]) : [];
            acc.pretransformers[k] = pretransform ? (Array.isArray(pretransform) ? [...pretransform] : [pretransform]) : [];
            acc.converters[k] = convert ? (Array.isArray(convert) ? [...convert] : [convert]) : [];
            acc.transformers[k] = transform ? (Array.isArray(transform) ? [...transform] : [transform]) : [];
            required && (acc.requiredFields[k] = true);
            if (refAttribute) {
                const refAttributes = Array.isArray(refAttribute) ? refAttribute : [refAttribute];
                refAttributes.forEach(ra => {
                    if (!acc.refAttributeFields[ra.parentField]) acc.refAttributeFields[ra.parentField] = [];
                    acc.refAttributeFields[ra.parentField].push({
                        sourceField: ra.sourceField,
                        targetField: k,
                        field: ra.field
                    });
                })
                if (refAttributes.length > 1) {
                    acc.multiRefAttributeTargetFields[k] = [...refAttributes];
                }
            }
            (undefined !== reference) && (acc.referenceFields[k] = reference);
            (undefined !== ownedReferenceList) && (acc.ownedReferenceListFields[k] = ownedReferenceList);
            (validators && 0 < validators.length) && (acc.validators[k] = [...(acc.validators[k] || []), ...validators]);
            (authorizers && 0 < authorizers.length) && (acc.authorizers[k] = [...(acc.authorizers[k] || []), ...authorizers]);
            unique && (acc.validators[k].push({type: '@unique', config: {type: schema.name, index: k}}));
            (undefined !== value) && (acc.values[k] = value);
            (undefined !== updateValue) && (acc.updateValues[k] = updateValue);
            (undefined !== defaultValue) && (acc.defaultValues[k] = defaultValue);
            (undefined !== rawDefaultValue) && (acc.defaultValues[k] = {type: '@value', config: {value: rawDefaultValue}});
            (undefined !== updateDefaultValue) && (acc.updateDefaultValues[k] = updateDefaultValue);
            (undefined !== rawUpdateDefaultValue) && (acc.updateDefaultValues[k] = {type: '@value', config: {value: rawUpdateDefaultValue}});
            (undefined !== autoTransitionTo) && (acc.autoTransitionTo[k] = {type: '@value', config: {value: autoTransitionTo}});
            (undefined !== cascadePopulate) && (acc.cascadeValues[k] = cascadePopulate);
            (undefined !== cascadeClear) && (acc.cascadeValues[k] = this.mergeCascades(acc.cascadeValues[k], cascadeClear));
            (undefined !== permissions) && (acc.authorizers[k].push({type: '@permissions', config: {permissions}}));
            internal && (acc.privateFields[k] = true);
            index && (index.length > 0) && (acc.indexes[k] = [...(acc.indexes[k] || []), ...index]);
            volatile && (acc.volatileFields[k] = true);
            primaryKey && (acc.primaryKey = k);
            upper && (acc.transformers[k].push({type: '@upper'}));
            lower && (acc.transformers[k].push({type: '@lower'}));
            prefetch && ((acc.prefetchs['update'] = acc.prefetchs['update'] || {})[k] = true);
            dynamic && (acc.dynamics[k] = dynamic);
            requires && (acc.requires[k] = Array.isArray(requires) ? [...acc.requires[k], ...requires] : [...acc.requires[k], requires]);
            detectedRequires && (acc.requires[k] = Array.isArray(detectedRequires) ? [...acc.requires[k], ...detectedRequires] : [...acc.requires[k], detectedRequires]);
            detectedRequires && detectedRequires.forEach(dr => {
                (acc.prefetchs['update'] = acc.prefetchs['update'] || {})[dr] = true;
            })
            from && (acc.froms[k] = from) && (acc.dynamics[k] = {type: '@from', config: {name: from}});
            (undefined !== stat) && (acc.statFields[k] = stat);
            if (!acc.indexes[k].length) delete acc.indexes[k];
            if (!acc.transformers[k].length) delete acc.transformers[k];
            if (!acc.authorizers[k].length) delete acc.authorizers[k];
            if (!acc.pretransformers[k].length) delete acc.pretransformers[k];
            if (!acc.converters[k].length) delete acc.converters[k];
            if (!acc.mutators[k].length) delete acc.mutators[k];
            if (!acc.dynamics[k]) delete acc.dynamics[k];
            if (!acc.requires[k] || !acc.requires[k].length) delete acc.requires[k];
            if (!acc.froms[k]) delete acc.froms[k];
            if (!acc.statFields[k]) delete acc.statFields[k];
            if (!acc.multiRefAttributeTargetFields[k].length) delete acc.multiRefAttributeTargetFields[k];
            return acc;
        }, schema);
    }
    buildDetectedRequires(value) {
        if (!value || (true === value) || ('number' === typeof value)) return [];
        if ('string' === typeof value) {
            const r = new RegExp('\{\{([^\}]+)\}\}', 'g');
            const matches = [...(value as any).matchAll(r)];
            return matches.reduce((acc, m) => {
                for (let i = 0; i < (m.length - 1); i++) {
                    acc.push(m[i+1]);
                }
                return acc;
            }, []);
        }
        if (Array.isArray(value)) return value.reduce((acc, v) => [...acc, ...this.buildDetectedRequires(v)], []);
        if ('object' === typeof value) return Object.values(value).reduce((acc: string[], v) => [...acc, ...this.buildDetectedRequires(v)], []);
        return [];
    }
    parseRefAttributeFields(def: any, schema: any) {
        Object.entries(schema.refAttributeFields).forEach(([k, vList]) => {
            const x = (<any[]>vList).reduce((acc, v) => {
                acc.sourceFields[v.sourceField] = true;
                acc.targetFields[v.targetField] = true;
                acc.values[v.targetField] = acc.updateValues[v.targetField] = {
                    type: '@ref-attribute-field',
                    config: ((schema.multiRefAttributeTargetFields || {})[v.targetField]?.length > 1)
                        ? {
                            sources: schema.multiRefAttributeTargetFields[v.targetField].map(xxx => ({
                                key: xxx.parentField,
                                prefix: this.buildTypeName(schema.referenceFields[xxx.parentField].reference, schema.name),
                                sourceField: xxx.sourceField,
                            })),
                          }
                        : {
                            key: k,
                            prefix: this.buildTypeName(schema.referenceFields[k].reference, schema.name),
                            sourceField: v.sourceField,
                          }
                };
                return acc;
            }, {targetFields: [], sourceFields: [], values: [], updateValues: []});
            if (!schema.referenceFields[k]) throw new Error(`${k} is not a reference field (but is a ref attribute requirement for ${Object.keys(x.targetFields).join(', ')})`);
            if (!schema.validators[k]) schema.validators[k] = [];
            schema.referenceFields[k].fetchedFields = ['id'].concat(schema.referenceFields[k].fetchedFields, Object.keys(x.sourceFields));
            Object.assign(schema.values, x.values);
            Object.assign(schema.updateValues, x.updateValues);
        });
        Object.keys(schema.referenceFields).forEach(k => {
            if (!schema.validators[k]) schema.validators[k] = [];
            schema.validators[k].push(
                this.buildReferenceValidator(schema.referenceFields[k], k, schema.name)
            );
        });
    }
    mergeCascades(a, b) {
        a = {...(a || {})};
        b = b || {};

        Object.entries(b).forEach(([k, v]) => {
            a[k] = a[k] || {};
            (v as any).reduce((acc, vv) => {
                acc[vv] = '**clear**';
                return acc;
            }, a[k]);
        });

        return a;
    }
    parseField(d: any, name, schema: any) {
        const ctx = {buildTypeName: this.buildTypeName.bind(this)};
        this.modifiers.forEach(modifier => {
            try {
                modifier.parse(d, name, schema, ctx);
            } catch (e) {
                throw new Error(`Error when parsing with field modifier '${modifier.name}': ${e.message}`);
            }
        });
        if (0 <= d.type.indexOf(':')) {
            const [prefix, ...tokens] = d.type.split(/:/g);
            (this.parsers[prefix]) && this.parsers[prefix](prefix, tokens, d, name, schema, ctx);
        }
    }
    createField(def: any) {
        let tt = def.type;
        const extra = <any>{};
        if (Array.isArray(tt)) {
            extra.type = tt;
            tt = tt[0].type;
        }
        if ('object' === typeof tt) {
            extra.type = tt;
            tt = 'object';
        }
        return {...this.getFieldType(tt)((def || {}).config || {}), ...extra};
    }
    getFieldType(name: string): Function {
        if (!this.fieldTypes[name]) {
            throw new Error(`Unknown field type '${name}'`);
        }
        return this.fieldTypes[name];
    }
    buildTypeName(type, modelName) {
        const tokens = modelName.split(/_/g);
        let fullType = type.replace(/\./g, '_');
        if (!/_/.test(fullType)) {
            tokens.pop();
            tokens.push(fullType);
            fullType = tokens.join('_');
        }
        return fullType;
    }
    buildReferenceValidator(def: {[key: string]: any}, localField: string, modelName: string) {
        const config = {
            type: this.buildTypeName(def.reference, modelName),
            localField,
            idField: def['idField'],
            ...(def['targetIdField'] ? {targetIdField: def['targetIdField']} : {}),
            fetchedFields: def['fetchedFields'] || [],
        };
        return {
            type: '@reference',
            config,
        };
    }
    protected cleanSchema(schema: any): any {
        return Object.entries(schema).reduce((acc, [k, v]) => {
            if (undefined === v) return acc;
            if (null === v) return acc;
            if (Array.isArray(v) && (0 === v.length)) return acc;
            if (('object' === typeof v) && (0 === Object.keys(v as any).length)) return acc;
            acc[k] = v;
            return acc;
        }, {} as any);
    }
    protected createSchema({indexes = {}, hooks = {}, name, shortName = undefined}): any {
        return {
            primaryKey: <any>undefined,
            fields: {},
            privateFields: {},
            requiredFields: {},
            validators: {},
            values: {},
            updateValues: {},
            defaultValues: {},
            updateDefaultValues: {},
            indexes,
            volatileFields: {},
            transformers: {},
            referenceFields: {},
            ownedReferenceListFields: {},
            refAttributeFields: {},
            hooks,
            name,
            prefetchs: {},
            autoTransitionTo: {},
            cascadeValues: {},
            authorizers: {},
            mutators: {},
            pretransformers: {},
            dynamics: {},
            froms: {},
            requires: {},
            converters: {},
            statFields: {},
            multiRefAttributeTargetFields: {},
            shortName: shortName || (name || '').replace(/^.+_([^_]+)$/, '$1'),
        };
    }
}