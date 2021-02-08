module.exports = {
    plugins: [
        '@monorepo-terraform-modules',
    ],
    root: {
        type: 'monorepo-terraform-modules',
        vars: {
            author: {
                name: 'Olivier Hoareau',
                email: 'oss@genjs.dev',
            },
            prefix: 'myothercompany',
            project: 'someproject',
            manage_modules: true,
            manage_layers: true,
            terraform_docs: true,
        },
    }
};
