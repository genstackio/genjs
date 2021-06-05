module.exports = {
    plugins: [
        '@monorepo-webapps',
        '@js-gatsby',
        '@js-next',
        '@js-react-app',
    ],
    projects: {
        front: {type: 'js-gatsby'},
        app: {type: 'js-next'},
        back: {type: 'js-react-app'},
        projectx: {},
        projecty: {},
        projectz: {},
        projectt: {},
    },
    root: {
        type: 'monorepo-webapps',
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
