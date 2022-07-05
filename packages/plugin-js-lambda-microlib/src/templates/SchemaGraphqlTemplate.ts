import {AbstractFileTemplate} from '@genjs/genjs';

export type graphql_config = {
    queries?: any;
    mutations?: any;
    subscriptions?: any;
    types?: any;
    inputs?: any;
};

export type SchemaGraphqlTemplateConfig = {
    graphql?: graphql_config;
};

export type gql_type = {
};

export type gql_input = {
};

export type gql_types = {
    [key: string]: Omit<gql_type, 'name'>;
};

export type gql_inputs = {
    [key: string]: Omit<gql_input, 'name'>;
};

export class SchemaGraphqlTemplate extends AbstractFileTemplate {
    protected types: gql_types;
    protected inputs: gql_inputs;
    constructor(config: SchemaGraphqlTemplateConfig = {}) {
        super();
        this.types = this.buildTypes(config);
        this.inputs = this.buildInputs(config);
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'schema.graphql.ejs';
    }
    getVars() {
        return {
            types: this.types,
            inputs: this.inputs,
            graphql_scalars: true,
        }
    }
    protected buildTypes(config: SchemaGraphqlTemplateConfig) {
        const xResolvers = this.buildPartialSchemaFromResolversX((config as any).handlers?.graphql?.vars?.resolvers || {});
        const yResolvers = this.buildPartialSchemaFromResolversY(config.graphql);
        return this.mergeResolvers(xResolvers, yResolvers);
    }
    protected buildPartialSchemaFromResolversX(resolvers: any = {}) {
        const {Query: rQuery, Mutation: rMutation, ...rRest} = resolvers;

        const rr: any = {
            Query: {},
            Mutation: {},
        };

        Object.entries(rQuery || {}).reduce((acc, [k, v]) => {
            acc[k] = {}; // @todo
            return acc;
        }, rr.Query);
        Object.entries(rMutation || {}).reduce((acc, [k, v]) => {
            acc[k] = {}; // @todo
            return acc;
        }, rr.Mutation);

        !Object.keys(rr.Query).length && delete rr.Query;
        !Object.keys(rr.Mutation).length && delete rr.Mutation;

        return Object.entries(rRest).reduce((acc, [k, v]: [string, any]) => Object.entries(v || {}).reduce((acc2, [kk, vv]) => {
            acc2[k] = acc2[k] || {};
            acc2[k][kk] = {}; // @todo
            return acc2;
        }, acc), rr);
    }
    protected buildPartialSchemaFromResolversY(gcfg: graphql_config = {}) {
        const {queries, mutations, inputs, types, subscriptions} = gcfg;

        const rr: any = {
            Query: {},
            Mutation: {},
            Subscription: {},
        };

        Object.entries(queries || {}).reduce((acc, [k, v]) => {
            acc[k] = {
            };
            return acc;
        }, rr.Query);
        Object.entries(mutations || {}).reduce((acc, [k, v]) => {
            acc[k] = {
            };
            return acc;
        }, rr.Mutation);
        Object.entries(inputs || {}).reduce((acc, [k, v]) => {
            acc[k] = {
            };
            return acc;
        }, rr);
        Object.entries(types || {}).reduce((acc, [k, v]) => {
            acc[k] = {
            };
            return acc;
        }, rr);
        Object.entries(subscriptions || {}).reduce((acc, [k, v]) => {
            acc[k] = {
            };
            return acc;
        }, rr.Subscription);

        !Object.keys(rr.Query).length && delete rr.Query;
        !Object.keys(rr.Mutation).length && delete rr.Mutation;
        !Object.keys(rr.Subscription).length && delete rr.Subscription;

        return rr;
    }
    protected mergeResolvers(a: any = {}, b: any = {}) {
        const c: {Query?: any, Mutation?: any} = {
        };
        if (a.Query) {
            if (b.Query) {
                c.Query = {fields: {...a.Query, ...b.Query}};
            } else {
                c.Query = {fields: {...a.Query}};
            }
        } else if (b.Query) {
            c.Query = {fields: {...b.Query}};
        }
        if (a.Mutation) {
            if (b.Mutation) {
                c.Mutation = {fields: {...a.Mutation, ...b.Mutation}};
            } else {
                c.Mutation = {fields: {...a.Mutation}};
            }
        } else if (b.Mutation) {
            c.Mutation = {fields: {...b.Mutation}};
        }

        const {Query: aQuery, Mutation: aMutation, ...aRest} = a;
        const {Query: bQuery, Mutation: bMutation, ...bRest} = b;

        const aaRest = (Object.entries(aRest || {}).reduce((acc, [k, v]) => Object.assign(acc, {[k]: {fields: v}}), {} as any));
        const bbRest = (Object.entries(bRest || {}).reduce((acc, [k, v]) => Object.assign(acc, {[k]: {fields: v}}), {} as any));

        return {...c, ...aaRest, ...bbRest};
    }
    protected buildInputs(config: SchemaGraphqlTemplateConfig) {
        return {};
    }
}

// noinspection JSUnusedGlobalSymbols
export default SchemaGraphqlTemplateConfig