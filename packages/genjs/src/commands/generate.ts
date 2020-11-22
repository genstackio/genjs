import Genjs from '../Genjs';

export default {
    command: ['generate', '$0'],
    describe: 'generate the packages directories',
    builder: {
        target: {
            alias: 't',
            default: '.',
        }
    },
    handler: async argv =>
        new Genjs({
            ...(argv.config as any),
            rootDir: process.cwd(),
            verbose: argv.verbose || process.env.GENJS_VERBOSE || 0,
        }).generate({
            targetDir: argv.target,
            write: true,
            verbose: argv.verbose || process.env.GENJS_VERBOSE || 0,
        })
    ,
};