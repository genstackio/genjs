module.exports = {
    plugins: [
        '@cicd-github',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    root: {
        type: 'cicd-github',
        vars: {
            npm_scope: 'toto',
            github: {
                workflows: {
                    'push-to-master': true,
                }
            }
        }
    }
};
