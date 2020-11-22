module.exports = {
    plugins: [
        '@ts-lambda-gql',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    packages: {
        cdn: {
            type: 'ts-lambda-gql',
            vars: {
                prefix: 'myothercompany',
                project: 'someproject',
                name: 'gql',
            },
        }
    }
};
