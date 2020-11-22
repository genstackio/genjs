module.exports = {
    plugins: [
        '@js-docker-image',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    projects: {
        myimage: {
            type: 'js-docker-image',
        }
    }
};
