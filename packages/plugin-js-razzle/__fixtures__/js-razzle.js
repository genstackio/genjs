module.exports = {
    plugins: [
        '@js-razzle',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    packages: {
        app: {
            type: 'js-razzle',
            vars: {
                project_prefix: 'myothercompany',
                project_name: 'someproject',
                name: 'web-app',
            },
        }
    }
};
