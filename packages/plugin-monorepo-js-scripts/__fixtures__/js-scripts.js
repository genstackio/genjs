module.exports = {
    plugins: [
        '@monorepo-js-scripts',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    packages: {
        libs: {
            type: 'monorepo-js-scripts',
            vars: {
            }
        }
    }
};
