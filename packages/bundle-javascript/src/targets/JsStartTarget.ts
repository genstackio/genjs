import AbstractJsTarget from './AbstractJsTarget';

export class JsStartTarget extends AbstractJsTarget {
    getCommandName() {
        return 'start';
    }
    getCommandEnvs(options: any) {
        return {
            PORT: options.port,
        }
    }
    buildDescription() {
        return 'Start (local)';
    }
}

export default JsStartTarget