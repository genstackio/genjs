import {
    final_mutations,
    final_queries, final_scalars, final_subscriptions,
    final_types,
    gql_mutations,
    gql_queries,
    gql_scalars,
    gql_subscriptions,
    gql_types,
    SchemaGraphqlConfig,
    data, final_type, final_query, final_mutation, final_subscription, final_scalar, gql_inputs, gql_type_field,
} from "./schema-model-types";
import {parseConfigType} from "@genjs/genjs/lib/utils";

export class SchemaGraphqlModel {
    protected types: gql_types;
    protected queries: gql_queries;
    protected mutations: gql_mutations;
    protected subscriptions: gql_subscriptions;
    protected scalars: gql_scalars;
    constructor(pkg: any, config: SchemaGraphqlConfig = {}) {
        const ctx = this.buildCtxFromPkg(pkg);
        const {types, queries, mutations, subscriptions, scalars} = this.buildGroupedData(ctx, {
            types: this.buildTypes(ctx, config),
            inputs: this.buildInputs(ctx, config),
            queries: this.buildQueries(ctx, config),
            mutations: this.buildMutations(ctx, config),
            subscriptions: this.buildSubscriptions(ctx, config),
            scalars: this.buildScalars(ctx, config),
        });

        this.types = types;
        this.queries = queries;
        this.mutations = mutations;
        this.subscriptions = subscriptions;
        this.scalars = scalars;
    }
    protected buildCtxFromPkg(pkg: any) {
        return {
            types: this.sort(Object.entries(pkg?.microservices || {}).reduce((acc, [microserviceName, microservice]: [string, any]) => {
                return Object.entries(microservice?.types || {}).reduce((acc2, [typeName, type]) => {
                    acc2[typeName] = {
                        name: typeName,
                        fullName: `${microserviceName}_${typeName}`,
                        fields: this.buildTypeModelFields(type),
                    };
                    return acc2;
                }, acc);
            }, {} as any)),
        }
    }
    protected buildTypeModelFields(type) {
        return this.sort(Object.entries(type.model?.fields || {}).reduce((acc, [fieldName, field]: [string, any]) => {
            acc[fieldName] = {
                name: fieldName,
                type: 'id' === fieldName ? 'id' : field.type,
                automatic: !!(type.model.statFields || {})[fieldName],
                searchType: type.model.searchFields[fieldName],
                list: !!field.list,
                required: !!(type.model.requiredFields || {})[fieldName],
                private: !!type.model.privateFields[fieldName],
                defaultValue: type.model.defaultValues[fieldName] || undefined,
            };
            return acc;
        }, {}));
    }
    getVars() {
        return {
            types: this.types,
            queries: this.queries,
            mutations: this.mutations,
            subscriptions: this.subscriptions,
            scalars: this.scalars,
        };
    }
    protected buildGroupedData({types: msTypes = {}}: any = {}, data: data): {
        types: final_types,
        queries: final_queries,
        mutations: final_mutations,
        subscriptions: final_subscriptions,
        scalars: final_scalars,
    } {
        const finalTypes = this.sort(Object.entries(msTypes).reduce((acc, [k, v]) => {
            acc[k] = this.buildFinalType(k, v, data);
            return acc;
        }, {} as final_types));
        const finalQueries = this.sort(Object.entries(data.queries).reduce((acc, [k, v]) => {
            acc[k] = this.buildFinalQuery(k, v, data);
            return acc;
        }, {} as final_queries));
        const finalMutations = this.sort(Object.entries(data.mutations).reduce((acc, [k, v]) => {
            acc[k] = this.buildFinalMutation(k, v, data);
            return acc;
        }, {} as final_mutations));
        const finalSubscriptions = this.sort(Object.entries(data.subscriptions).reduce((acc, [k, v]) => {
            acc[k] = this.buildFinalSubscription(k, v, data);
            return acc;
        }, {} as final_subscriptions));
        const finalScalars = this.sort(Object.entries(data.scalars).reduce((acc, [k, v]) => {
            acc[k] = this.buildFinalScalar(k, v, data);
            return acc;
        }, {} as final_scalars));

        return {
            types: finalTypes,
            queries: finalQueries,
            mutations: finalMutations,
            subscriptions: finalSubscriptions,
            scalars: finalScalars,
        };
    }
    protected sort(a: any) {
        const keys = Object.keys(a);
        keys.sort();
        return keys.reduce((acc, k) => Object.assign(acc, {[k]: a[k]}), {} as any);
    }
    protected camelCase(s: string = '') {
        return `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
    }
    protected buildFinalType(name: string, cfg: any, data: data): final_type {
        const camelCaseName = this.camelCase(name);

        return {
            name,
            fullName: cfg.fullName, // @todo change
            types: {
                [camelCaseName]: data.types[camelCaseName],
                [`${camelCaseName}Page`]: data.types[`${camelCaseName}Page`],
            },
            inputs: {
                [`Create${camelCaseName}Input`]: data.inputs[`Create${camelCaseName}Input`],
                [`Update${camelCaseName}Input`]: data.inputs[`Update${camelCaseName}Input`],
            },
        };
    }
    protected buildFinalQuery(name: string, cfg: any, data: data): final_query {
        return {
            name,
            args: [], // @todo change
            type: 'string', // @todo change
            gqlType: 'String', // @todo change
        };
    }
    protected buildFinalMutation(name: string, cfg: any, data: data): final_mutation {
        return {
            name,
            args: [], // @todo change
            type: 'string', // @todo change
            gqlType: 'String', // @todo change
        };
    }
    protected buildFinalSubscription(name: string, cfg: any, data: data): final_subscription {
        return {
            name,
            args: [], // @todo change
            type: 'string', // @todo change
            gqlType: 'String', // @todo change
        };
    }
    protected buildFinalScalar(name: string, cfg: any, data: data): final_scalar {
        return {
            name,
        };
    }
    protected buildTypes(ctx: any, config: SchemaGraphqlConfig): gql_types {
        return Object.entries(ctx?.types || {}).reduce((acc, [typeName, type]: [string, any]) => {
            const camelCaseTypeName = this.camelCase(typeName);
            acc[camelCaseTypeName] = this.buildTypeType(camelCaseTypeName, type, config);
            acc[`${camelCaseTypeName}Page`] = this.buildTypePageType(`${camelCaseTypeName}Page`, camelCaseTypeName, type);
            return acc;
        }, {} as gql_types);
    }
    protected buildQueries(ctx: any, config: SchemaGraphqlConfig): gql_queries {
        return {};
    }
    protected buildMutations(ctx: any, config: SchemaGraphqlConfig): gql_mutations {
        return {};
    }
    protected buildSubscriptions(ctx: any, config: SchemaGraphqlConfig): gql_subscriptions {
        return {};
    }
    protected buildScalars(ctx: any, config: SchemaGraphqlConfig): gql_scalars {
        return {};
    }
    protected buildInputs(ctx: any, config: SchemaGraphqlConfig): gql_inputs {
        return Object.entries(ctx?.types || {}).reduce((acc, [typeName, type]: [string, any]) => {
            const camelCaseTypeName = this.camelCase(typeName);
            acc[`Create${camelCaseTypeName}Input`] = this.buildTypeCreateInput(`Create${camelCaseTypeName}Input`, type);
            acc[`Update${camelCaseTypeName}Input`] = this.buildTypeUpdateInput(`Update${camelCaseTypeName}Input`, type);
            return acc;
        }, {} as gql_inputs);
    }
    protected buildTypeType(name: string, type: any, config: any) {
        const resolvers = config.handlers?.graphql?.vars?.resolvers || {};

        return {
            name,
            fields: this.sort({
                ...this.buildTypeFields(type, 'object'),
                ...this.buildTypeJoinFields(type, resolvers[this.camelCase(type.name)], config),
            }),
        };
    }
    protected buildTypeJoinFields(type: any, resolvers: Record<string, string>, config: any): Record<string, gql_type_field> {
        return Object.entries(resolvers || {}).reduce((acc, [name, v]: [string, string]) => {
            const [a, b = undefined, c = undefined] = v.split(/_/g);
            if (!b || !c) return acc;
            const {operationNature, operationType, operationGqlType, operationArgs} = this.parseOperationValue(config.microservices[a]?.types[b]?.operations[c], {parentType: type, parentField: name, microservice: a, type: b, operation: c});
            if (!operationNature) return acc;
            acc[name] = {
                name,
                required: false,
                type: operationType,
                gqlType: operationGqlType,
                args: operationArgs,
            };
            return acc;
        }, {} as any);
    }
    protected parseOperationValue(op: any, {parentType, parentField, microservice, type: msType, operation: msOperation}) {
        if (!op) {
            console.log('AAA => ', op, `${parentType.name}.${parentField}`, microservice, msType, msOperation);
            return {operationNature: undefined, operationType: undefined, operationGqlType: undefined};
        }
        if ('string' !== typeof op) {
            console.log('BBB => ', op, `${parentType.name}.${parentField}`, microservice, msType, msOperation);
            return {};
        }
        const [operationNature] = parseConfigType({}, op);
        switch (operationNature) {
            case 'findInIndexByHashKey':
                const pageType = `${this.camelCase(msType)}Page`;
                return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                        {name: 'offset', type: 'string', gqlType: 'String'},
                        {name: 'limit', type: 'integer', gqlType: 'Int'},
                        {name: 'sort', type: 'string', gqlType: 'String'},
                    ]};
            default:
                console.log('CCC => ', op, `${parentType.name}.${parentField}`, microservice, msType, msOperation);
                return {};
        }
    }
    protected buildTypePageType(name: string, typeName, type: any) {
        return {
            name,
            fields: {
                count: {name: 'count', type: 'number', gqlType: 'Int'},
                cursor: {name: 'cursor', type: 'string', gqlType: 'String'},
                items: {name: 'items', type: `${name}[]`, gqlType: `[${typeName}]`},
            },
        };
    }
    protected buildTypeCreateInput(name: string, type: any) {
        return {
            name,
            fields: this.buildTypeFields(type, 'create'),
        };
    }
    protected buildTypeUpdateInput(name: string, type: any) {
        return {
            name,
            fields: this.buildTypeFields(type, 'update'),
        };
    }
    protected buildTypeFields(type: any, mode: string) {
        return Object.entries(type.fields || {}).reduce((acc, [k, v]: [string, any]) => {
            let f: any = undefined;
            const typeName = v.list ? `${v.type}[]` : v.type;
            const gqlTypeName = v.list ? `[${this.mapTypeToGqlType(v, mode)}]` : this.mapTypeToGqlType(v, mode);
            if (!this.isTypeFieldExposedFor(k, v, type, mode)) return acc;
            switch (mode) {
                case 'object':
                    f = {
                        name: v.name,
                        required: false,
                        type: typeName,
                        gqlType: gqlTypeName,
                    }
                    break;
                case 'create':
                    f = {
                        name: v.name,
                        required: !!v.required && !v.defaultValue,
                        type: typeName,
                        gqlType: gqlTypeName,
                        defaultValue: v.defaultValue,
                    }
                    break;
                case 'update':
                    f = {
                        name: v.name,
                        required: false,
                        type: typeName,
                        gqlType: gqlTypeName,
                    }
                    break;
                default:
                    break;
            }
            f && (acc[k] = f);
            return acc;
        }, {} as any);
    }
    protected isTypeFieldExposedFor(fieldName: string, field: any, type: any, mode: string) {
        switch (mode) {
            case 'object':
                return true;
            case 'create':
                if (!!field.private) return false;
                if (field.automatic) return false;
                if ('status' === fieldName) return false;
                return true;
            case 'update':
                if (!!field.private) return false;
                if (field.automatic) return false;
                if ('presets' === fieldName) return false;
                if ('inlinePreset' === fieldName) return false;
                return true;
            default:
                return false;
        }
    }
    protected mapTypeToGqlType(type: any, mode: string) {
        const inferredSpecialType = this.infertSpecialType(type, mode);
        if (!!inferredSpecialType) return inferredSpecialType;
        const map = {
            id: 'ID',
            string: 'String',
            integer: 'Int',
            float: 'Float',
            bigint: 'BigInt',
            boolean: 'Boolean',
        };
        if (type.type === 'number') {
            const mapNumber = {
                float: 'Float',
                integer: 'Int',
                bigint: 'BigInt',
                number: 'Int',
            }
            return mapNumber[type.searchType.type || ''] || 'Int';
        }
        return map[type.type || ''] || 'String';
    }
    protected infertSpecialType(type: any, mode: string) {
        const n: string = type.name;
        const map = {
            object: {
                image: 'Image',
                bigint: 'BigInt',
                file: 'File',
                css: 'Css',
                js: 'Js',
            },
            create: {
                image: 'ImageInput',
                bigint: 'BigInt',
                file: 'FileInput',
                css: 'CssInput',
                js: 'JsInput',
            },
            update: {
                image: 'ImageInput',
                bigint: 'BigInt',
                file: 'FileInput',
                css: 'CssInput',
                js: 'JsInput',
            },
        }

        let i: string|undefined;

        switch (true) {
            case /Date/.test(n): i = 'bigint'; break;
            case /Image$/.test(n): i = 'image'; break;
            case /At$/.test(n): i = 'bigint'; break;
            case /File$/.test(n): i = 'file'; break;
            case /Css/.test(n): i = 'css'; break;
            case /Js/.test(n): i = 'js'; break;
        }

        return i ? (map[mode] || {})[i] || undefined : undefined;
    }
}

// noinspection JSUnusedGlobalSymbols
export default SchemaGraphqlConfig