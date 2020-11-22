module.exports = {
    plugins: [
        '@monorepo-lambda-layers',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    root: {
        type: 'monorepo-lambda-layers',
        vars: {
            npm_scope: 'hello',
            project_copyright: 'The copyright.'
        }
    }
};
