module.exports = {
    plugins: [
        '@ts-sls',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    packages: {
        app: {
            type: 'ts-sls',
            vars: {
                prefix: 'myothercompany',
                project: 'someproject',
                name: 'api',
            },
        }
    }
};
