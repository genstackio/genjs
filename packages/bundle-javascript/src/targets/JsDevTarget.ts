import AbstractJsTarget from './AbstractJsTarget';

export class JsDevTarget extends AbstractJsTarget {
    getCommandName() {
        return 'dev';
    }
    getCommandEnvs(options: any) {
        return {
            PORT: options.port,
        };
    }
    buildDescription() {
        return 'Execute dev server';
    }
}

export default JsDevTarget