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
        api: {
            type: 'js-lambda-microlib',
            microservices: {
                m1: {
                    types: {
                        t1: {
                            backends: ['@dynamoose'],
                            operations: {
                                o1: {
                                },
                                o2: {
                                    wrap: ['o1'],
                                },
                                o3: {
                                    wrap: "((2 + 2) >= 4) && service.o2('Hello', `world`)",
                                },
                                o4: {
                                    wrap: ['o3', 'a', 12, '{query}'],
                                },
                            }
                        }
                    }
                }
            }
        }
    }
};
