module.exports = {
    plugins: [
        '@js-docusaurus',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    packages: {
        front: {
            type: 'js-docusaurus',
            vars: {
                name: 'mysite',
            },
        }
    }
};
