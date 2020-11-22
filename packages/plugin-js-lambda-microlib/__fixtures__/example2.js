module.exports = {
    plugins: [
        '@js-lambda-microlib',
        '@registry-base'
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    packages: {
        xinea: {
            type: 'js-lambda-microlib',
            handlers: {
                handler: {
                    type: 'ping',
                },
            },
            microservices: {
                user: {
                    types: {
                        user: {
                            mixins: ['token'],
                            backends: ['dynamoose'],
                            operations: {
                                create: {},
                            }
                        }
                    }
                }
            }
        }
    }
};
