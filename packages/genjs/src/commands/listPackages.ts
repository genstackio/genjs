import Genjs from '../Genjs';

export default {
    command: 'list-packages',
    describe: 'list all the packages',
    builder: {
    },
    handler: async argv =>
        (await new Genjs({
            ...(argv.c as any),
            rootDir: process.cwd(),
            verbose: argv.verbose,
        }).describePackages()).map(p => {
            console.log(`${p.name} (${p.type})`);
        })
    ,
};