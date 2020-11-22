module.exports = {
    plugins: [
        '@js-libs',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    packages: {
        libs: {
            type: 'js-libs',
            vars: {
                npm_scope: 'myscope',
            }
        }
    }
};
