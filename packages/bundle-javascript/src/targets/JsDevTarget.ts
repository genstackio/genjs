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
}

export default JsDevTarget