import Genjs from '../Genjs';

export default {
    command: 'init',
    describe: 'initializes the root project directory',
    builder: {
    },
    handler: async argv =>
        new Genjs({
            ...(argv.config as any),
            rootDir: process.cwd(),
            verbose: argv.verbose || process.env.GENJS_VERBOSE || 0,
        }).init()
    ,
};