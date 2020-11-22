module.exports = {
    plugins: [
        '@js-lambda-microlib',
    ],
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oss@genjs.dev',
        },
    },
    packages: {
        'hook-as-string': {
            type: 'js-lambda-microlib',
            microservices: {
                m1: {
                    types: {
                        t1: {
                            operations: {
                                create: {
                                    hooks: {
                                        before: [
                                            'b1',
                                            'b2',
                                            {type: 'b3'},
                                            {type: 'b4', config: {}},
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
