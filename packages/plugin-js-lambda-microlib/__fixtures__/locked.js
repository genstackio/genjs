module.exports = {
    plugins: [
        '@js-lambda-microlib',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
        locked: {
            'api/abcd/def.js': true,
        }
    },
    packages: {
        api: {
            type: 'js-lambda-microlib',
            files: {
                'abcd/def.js': 'module.exports = {};',
            }
        }
    }
};
