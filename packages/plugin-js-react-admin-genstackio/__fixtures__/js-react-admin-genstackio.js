module.exports = {
    plugins: [
        '@js-react-admin-genstackio',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha+oss@greenberets.io',
        },
        project_envs: {
            dev: {awsAccount: "000000000001", priority: 1, apiUrl: 'https://gql.dev.mydomain.com/graphql', adminCloudfront: 'E123456780'},
            test: {awsAccount: "000000000002", priority: 2, apiUrl: 'https://gql.test.mydomain.com/graphql', adminCloudfront: 'E123456781'},
            preprod: {awsAccount: "000000000003", priority: 3, apiUrl: 'https://gql.preprod.mydomain.com/graphql', adminCloudfront: 'E123456782'},
            prod: {awsAccount: "000000000004", priority: 4, apiUrl: 'https://gql.prod.mydomain.com/graphql', adminCloudfront: 'E123456783'},
        },
    },
    root: {
        type: 'js-react-admin-genstackio',
        vars: {
            readme: true,
            project_prefix: 'myothercompany',
            project_name: 'someproject',
            name: 'admin',
            env_mode: 'env-dir',
            env_local: true,
        },
    }
};
