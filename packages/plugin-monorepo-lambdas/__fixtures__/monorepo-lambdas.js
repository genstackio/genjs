module.exports = {
    plugins: [
        '@monorepo-lambdas',
        '@js-lambda',
    ],
    projects: {
        l1: {type: 'js-lambda'},
        l2: {type: 'js-lambda'},
        l3: {type: 'js-lambda'},
    },
    root: {
        type: 'monorepo-lambdas',
        vars: {
            author: {
                name: 'Olivier Hoareau',
                email: 'oss@genjs.dev',
            },
            project_envs: {
                dev: {},
                test: {},
                preprod: {},
                prod: {},
            },
            prefix: 'myothercompany',
            project: 'someproject',
            technologies: {
                sometechno: {name: 'Some other techno', link: 'https://mytechno.org'},
            },
            readme: true,
        },
    }
};
