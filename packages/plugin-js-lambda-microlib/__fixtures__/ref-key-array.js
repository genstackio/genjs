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
        'ref-key-array': {
            type: 'js-lambda-microlib',
            microservices: {
                m1: {
                    types: {
                        t1: {
                            attributes: {
                                a: '@ref:x',
                                b: '@ref:y:id',
                                c: '@ref:z:id,code',
                                d: '@ref:t:id*,code',
                                e: '@ref:t:id,code*',
                            },
                            operations: {
                                create: {},
                                update: {},
                                delete: {},
                            }
                        },
                        x: {
                            attributes: {
                                id: '&:autoUuid!'
                            },
                            operations: {
                                create: {},
                                update: {},
                                delete: {},
                            }
                        },
                        y: {
                            attributes: {
                                id: '&:autoUuid!',
                                code: 'string!'
                            },
                            operations: {
                                create: {},
                                update: {},
                                delete: {},
                            }
                        },
                        z: {
                            attributes: {
                                id: '&:autoUuid!',
                                code: 'string!'
                            },
                            operations: {
                                create: {},
                                update: {},
                                delete: {},
                            }
                        },
                        t: {
                            attributes: {
                                id: '&:autoUuid!',
                                code: 'string!'
                            },
                            operations: {
                                create: {},
                                update: {},
                                delete: {},
                            }
                        }
                    }
                }
            }
        }
    }
};
