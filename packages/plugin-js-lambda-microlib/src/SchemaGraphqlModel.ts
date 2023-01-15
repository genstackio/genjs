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
        const ctx = this.buildCtxFromPkg(pkg, config);
        const {types, queries, mutations, subscriptions, scalars} = this.buildGroupedData(ctx, {
            types: this.buildTypes(ctx, config, pkg),
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
    protected buildOperations(pkg: any) {
        return Object.entries(pkg.microservices).reduce((acc: any, [k, v]: [string, any]) => {
            return Object.entries(v.types || {}).reduce((acc2, [kk, vv]: [string, any]) => {
                return Object.entries(vv.operations).reduce((acc3, [kkk, vvv]: [string, any]) => {
                    acc3[`${k}_${kk}_${kkk}`] = {name: kkk, type: vvv.type || kkk, gqlType: `${kk.slice(0, 1).toUpperCase()}${kk.slice(1)}`};
                    return acc3;
                }, acc2);
            }, acc);
        }, {});
    }
    protected buildCtxFromPkg(pkg: any, config: SchemaGraphqlConfig) {
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
            operations: this.sort(this.buildOperations(pkg)),
        }
    }
    protected buildTypeModelFields(type) {
        return this.sort(Object.entries(type.model?.fields || {}).reduce((acc, [fieldName, field]: [string, any]) => {
            acc[fieldName] = {
                name: fieldName,
                type: 'id' === fieldName ? 'id' : field.type,
                automatic: !!(type.model.statFields || {})[fieldName],
                searchType: type.model.searchFields[fieldName],
                outputType: (type.model.outputTypes || {})[fieldName],
                inputType: (type.model.inputTypes || {})[fieldName],
                nonFetchable: !!(type.model.nonFetchables || {})[fieldName],
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
        return data.queries[name] || {
            name,
            args: [], // @todo change
            type: 'string', // @todo change
            gqlType: 'String', // @todo change
        };
    }
    protected buildFinalMutation(name: string, cfg: any, data: data): final_mutation {
        return data.mutations[name] || {
            name,
            args: [], // @todo change
            type: 'string', // @todo change
            gqlType: 'String', // @todo change
        };
    }
    protected buildFinalSubscription(name: string, cfg: any, data: data): final_subscription {
        return data.subscriptions[name] || {
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
    protected buildTypes(ctx: any, config: SchemaGraphqlConfig, pkg: any): gql_types {
        return Object.entries(ctx?.types || {}).reduce((acc, [typeName, type]: [string, any]) => {
            const camelCaseTypeName = this.camelCase(typeName);
            acc[camelCaseTypeName] = this.buildTypeType(camelCaseTypeName, type, config, pkg);
            acc[`${camelCaseTypeName}Page`] = this.buildTypePageType(`${camelCaseTypeName}Page`, camelCaseTypeName, type);
            return acc;
        }, {} as gql_types);
    }
    protected buildQueries(ctx: any, config: SchemaGraphqlConfig): gql_queries {
        const resolvers = (config as any).handlers?.graphql?.vars?.resolvers || {};

        return Object.entries(resolvers?.Query || {}).reduce((acc, [k, v]: [string, any]) => Object.assign(acc, {[k]: this.buildQuery(k, v, ctx, config)}), {} as any);
    }
    protected buildMutations(ctx: any, config: SchemaGraphqlConfig): gql_mutations {
        const resolvers = (config as any).handlers?.graphql?.vars?.resolvers || {};

        return Object.entries(resolvers?.Mutation || {}).reduce((acc, [k, v]: [string, any]) => Object.assign(acc, {[k]: this.buildMutation(k, v, ctx, config)}), {} as any);
    }
    protected buildSubscriptions(ctx: any, config: SchemaGraphqlConfig): gql_subscriptions {
        const resolvers = (config as any).handlers?.graphql?.vars?.resolvers || {};

        return Object.entries(resolvers?.Subscription || {}).reduce((acc, [k, v]: [string, any]) => Object.assign(acc, {[k]: this.buildSubscription(k, v, ctx, config)}), {} as any);
    }
    protected buildQuery(name: string, resolverName: string, ctx: any, config: SchemaGraphqlConfig): any {
        const op = (ctx.operations || {})[resolverName] || {name};
        const [a, b, c] = resolverName.split(/_/g);
        switch (op.type || op.name) {
            case 'search': return {
                name,
                type: 'search',
                args: [
                    {name: 'offset', gqlType: 'String'},
                    {name: 'limit', gqlType: 'Int'},
                    {name: 'query', gqlType: 'SearchQueryInput'},
                    {name: 'sort', gqlType: 'String'},
                ],
                gqlType: `${op.gqlType}Page`,
            };
            case 'find': return {
                name,
                type: 'find',
                args: [
                    {name: 'offset', gqlType: 'String'},
                    {name: 'limit', gqlType: 'Int'},
                ],
                gqlType: `${op.gqlType}Page`,
            };
            case 'get': return {
                name,
                type: 'get',
                args: [
                    {name: 'id', gqlType: 'ID', required: true}
                ],
                gqlType: op.gqlType,
            };
            case 'getByCode': return {
                name,
                type: 'getByCode',
                args: [
                    {name: 'code', gqlType: 'String', required: true}
                ],
                gqlType: op.gqlType,
            };
            case 'getByToken': return {
                name,
                type: 'getByToken',
                args: [
                    {name: 'token', gqlType: 'String', required: true}
                ],
                gqlType: op.gqlType,
            };
            case 'getByKey': return {
                name,
                type: 'getByKey',
                args: [
                    {name: 'key', gqlType: 'String', required: true}
                ],
                gqlType: op.gqlType,
            };
            case 'getByEmail': return {
                name,
                type: 'getByEmail',
                args: [
                    {name: 'email', gqlType: 'String', required: true}
                ],
                gqlType: op.gqlType,
            };
            default:
                const {operationNature, operationGqlType, operationArgs} = this.parseOperationValue(((((config as any).microservices || {})[a]?.types || {})[b]?.operations || {})[c], {parentType: {name: 'Query'}, parentField: name, microservice: a, type: b, operation: c});

                return {
                    name,
                    type: operationNature,
                    args: operationArgs,
                    gqlType: operationGqlType,
                };
        }
    }
    protected buildMutation(name: string, resolverName: string, ctx: any, config: SchemaGraphqlConfig): any {
        const op = (ctx.operations || {})[resolverName] || {name};
        switch (op.type || op.name) {
            case 'create': return {
                name,
                type: 'create',
                args: [
                    {name: 'data', gqlType: `Create${op.gqlType.slice(0, 1).toUpperCase()}${op.gqlType.slice(1)}Input`, required: true}
                ],
                gqlType: op.gqlType,
            };
            case 'update': return {
                name,
                type: 'update',
                args: [
                    {name: 'id', gqlType: 'ID', required: true},
                    {name: 'data', gqlType: `Update${op.gqlType.slice(0, 1).toUpperCase()}${op.gqlType.slice(1)}Input`, required: true}
                ],
                gqlType: op.gqlType,
            };
            case 'delete': return {
                name,
                type: 'delete',
                args: [
                    {name: 'id', gqlType: 'ID', required: true}
                ],
                gqlType: 'DeleteResponse',
            };
            default: return {
                name,
            };
        }
    }
    protected buildSubscription(name: string, resolverName: string, ctx: any, config: SchemaGraphqlConfig): any {
        return {name};
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
    protected buildTypeType(name: string, type: any, config: any, pkg: any) {
        const resolvers = config.handlers?.graphql?.vars?.resolvers || {};

        return {
            name,
            fields: this.sort({
                ...this.buildTypeFields(type, 'object'),
                ...this.buildTypeJoinFields(type, resolvers[this.camelCase(type.name)], config, pkg),
            }),
        };
    }
    protected buildTypeJoinFields(type: any, resolvers: Record<string, string>, config: any, pkg: any): Record<string, gql_type_field> {
        return Object.entries(resolvers || {}).reduce((acc, [name, v]: [string, string]) => {
            const [a, b = undefined, c = undefined] = v.split(/_/g);
            if (!b || !c) return acc;
            const {operationNature, operationType, operationGqlType, operationArgs} = this.parseOperationValue(pkg.microservices[a]?.types[b]?.operations[c], {parentType: type, parentField: name, microservice: a, type: b, operation: c});
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
            op = msOperation;
        }
        if ('string' !== typeof op) {
            if (op?.wrap) {
                op = op.wrap[0];
            } else if (op?.rawType) {
                op = op.rawType;
            } else if (op?.backend) {
                console.log('DDD => ', op, `${parentType.name}.${parentField}`, microservice, msType, msOperation);
                return {};
            } else {
                op = msOperation;
            }
        }
        const [operationNature, cfg] = parseConfigType({}, op);
        let pageType: string = '';
        switch (operationNature) {
            case 'findInIndex':
                pageType = `${this.camelCase(msType)}Page`;
                return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                        {name: 'offset', type: 'string', gqlType: 'String'},
                        {name: 'limit', type: 'integer', gqlType: 'Int'},
                        {name: 'sort', type: 'string', gqlType: 'String'},
                    ]};
            case 'getBy':
                pageType = this.camelCase(msType);
                return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                        {name: cfg?.vars?.default || cfg?.vars?.field || 'value', type: 'string', gqlType: 'String', required: true},
                    ]};
            case 'findInIndexByHashKey':
                pageType = `${this.camelCase(msType)}Page`;
                return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                        /Parent/.test(msOperation) ? false : {name: 'id', type: 'string', gqlType: 'String', required: true},
                        {name: 'offset', type: 'string', gqlType: 'String'},
                        {name: 'limit', type: 'integer', gqlType: 'Int'},
                        {name: 'sort', type: 'string', gqlType: 'String'},
                    ].filter(x => !!x)};
            case 'findInIndexByHashKeyAndRangeKey':
                pageType = `${this.camelCase(msType)}Page`;
                return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                        /Parent/.test(msOperation) ? false : {name: /InPeriodBy/.test(msOperation) ? cfg.vars.key || 'id' : 'id', type: 'string', gqlType: 'String', required: true},
                        /InPeriodBy/.test(msOperation) ? {name: 'period', type: '[bigint!]!]', gqlType: '[BigInt!]!'} : {name: 'value', type: 'string', gqlType: 'String'},
                        {name: 'offset', type: 'string', gqlType: 'String'},
                        {name: 'limit', type: 'integer', gqlType: 'Int'},
                        {name: 'sort', type: 'string', gqlType: 'String'},
                    ].filter(x => !!x)};
            case 'findByParentTenant':
                pageType = `${this.camelCase(msType)}Page`;
                return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                        {name: 'offset', type: 'string', gqlType: 'String'},
                        {name: 'limit', type: 'integer', gqlType: 'Int'},
                        {name: 'sort', type: 'string', gqlType: 'String'},
                    ]};
            default:
                if (/^fetchAll/.test(operationNature || '')) {
                    pageType = `${this.camelCase(msType)}Page`;
                    return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                            {name: 'limit', type: 'integer', gqlType: 'Int'},
                        ]};
                }
                if (/^findByParent/.test(operationNature || '')) {
                    pageType = `${this.camelCase(msType)}Page`;
                    return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                            {name: 'offset', type: 'string', gqlType: 'String'},
                            {name: 'limit', type: 'integer', gqlType: 'Int'},
                            {name: 'sort', type: 'string', gqlType: 'String'},
                        ]};
                }
                if (/^findRankedByParent/.test(operationNature || '')) {
                    pageType = `${this.camelCase(msType)}Page`;
                    return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                            {name: 'limit', type: 'integer', gqlType: 'Int'},
                        ]};
                }
                if (/^findBy/.test(operationNature || '')) {
                    pageType = `${this.camelCase(msType)}Page`;
                    return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                            {name: 'id', type: 'string', gqlType: 'String', required: true},
                            {name: 'offset', type: 'string', gqlType: 'String'},
                            {name: 'limit', type: 'integer', gqlType: 'Int'},
                            {name: 'sort', type: 'string', gqlType: 'String'},
                        ]};
                }
                if (/^findRankedBy/.test(operationNature || '')) {
                    pageType = `${this.camelCase(msType)}Page`;
                    return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                            {name: 'id', type: 'string', gqlType: 'String', required: true},
                            {name: 'limit', type: 'integer', gqlType: 'Int'},
                        ]};
                }
                if (/^getBy/.test(operationNature || '')) {
                    pageType = this.camelCase(msType);
                    return {operationNature, operationType: pageType, operationGqlType: pageType, operationArgs: [
                            {name: cfg?.vars?.default || cfg?.vars?.field || 'value', type: 'string', gqlType: 'String', required: true},
                        ]};
                }
                console.log('CCC => ', 'object' === typeof op ? '[Object]' : op, `${parentType.name}.${parentField}`, microservice, msType, msOperation);
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
            fields: this.buildTypeFields(type, 'create', true),
        };
    }
    protected buildTypeUpdateInput(name: string, type: any) {
        return {
            name,
            fields: this.buildTypeFields(type, 'update', true),
        };
    }
    protected buildTypeFields(type: any, mode: string, input: boolean = false) {
        return Object.entries(type.fields || {}).reduce((acc, [k, v]: [string, any]) => {
            let f: any = undefined;
            const typeName = v.list ? `${v.type}[]` : v.type;
            const gqlTypeName = v.list ? this.mapTypeToGqlType(v, mode, true, input) : this.mapTypeToGqlType(v, mode, false, input);
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

            f && (input || (!input && !v.nonFetchable)) && (acc[k] = f);
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
    protected mapTypeToGqlType(type: any, mode: string, list: boolean = false, input: boolean = false) {
        let forcedType = input ? type.inputType : type.outputType;
        if (forcedType) return forcedType;
        const inferredSpecialType = this.inferSpecialType(type, mode);
        if (!!inferredSpecialType) return list ? `[${inferredSpecialType}]` : inferredSpecialType;
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
            const r = mapNumber[type.searchType.type || ''] || 'Int';
            return list ? `[${r}]` : r;
        }
        if (type.searchType?.type && (type.searchType?.type !== 'text')) {
            const r = map[type.searchType?.type] || map[type.type || ''] || 'String';
            return list ? `[${r}]` : r;
        }
        const r = map[type.type || ''] || 'String';
        return list ? `[${r}]` : r;
    }
    protected inferSpecialType(type: any, mode: string) {
        const n: string = type.name;
        const map = {
            object: {
                image: 'Image',
                bigint: 'BigInt',
                file: 'File',
                css: 'Css',
                js: 'Js',
                screenshot: 'Screenshot',
                screenshots: 'Screenshots',
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
            case /Screenshots$/.test(n): i = 'screenshots'; break;
            case /Screenshot$/.test(n): i = 'screenshot'; break;
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