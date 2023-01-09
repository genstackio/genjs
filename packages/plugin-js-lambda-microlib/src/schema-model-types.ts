export type graphql_config = {
    queries?: any;
    mutations?: any;
    subscriptions?: any;
    types?: any;
    inputs?: any;
};

export type SchemaGraphqlConfig = {
    graphql?: graphql_config;
};

export type final_type = {
    name: string;
    fullName: string;
    types?: gql_types;
    inputs?: gql_inputs;
};

export type data = {
    types: gql_types;
    inputs: gql_inputs;
    queries: gql_queries;
    mutations: gql_mutations;
    subscriptions: gql_subscriptions;
    scalars: gql_scalars;
};

export type final_query = gql_query;
export type final_mutation = gql_mutation;
export type final_subscription = gql_subscription;
export type final_scalar = gql_scalar;

export type final_types = Record<string, final_type>;
export type final_queries = Record<string, final_query>;
export type final_mutations = Record<string, final_mutation>;
export type final_subscriptions = Record<string, final_subscription>;
export type final_scalars = Record<string, final_scalar>;

export type gql_arg = {
    name: string;
    required?: boolean;
    type: string;
    gqlType: string;
    defaultValue?: any;
}
export type gql_type_field = {
    name: string;
    type: string;
    gqlType: string;
}
export type gql_input_field = {
    name: string;
    type: string;
    gqlType: string;
}
export type gql_type = {
    name: string;
    fields?: Record<string, gql_type_field>;
};
export type gql_input = {
    name: string;
    fields?: Record<string, gql_input_field>;
};
export type gql_query = {
    name: string;
    args?: gql_arg[];
    type: string;
    gqlType: string;
};
export type gql_mutation = {
    name: string;
    args?: gql_arg[];
    type: string;
    gqlType: string;
};
export type gql_subscription = {
    name: string;
    args?: gql_arg[];
    type: string;
    gqlType: string;
};
export type gql_scalar = {
    name: string;
};

export type gql_types = Record<string, gql_type>;
export type gql_queries = Record<string, gql_query>;
export type gql_mutations = Record<string, gql_mutation>;
export type gql_subscriptions = Record<string, gql_subscription>;
export type gql_scalars = Record<string, gql_scalar>;
export type gql_inputs = Record<string, gql_input>;
