import AbstractJsTarget from './AbstractJsTarget';

export class JsServeTarget extends AbstractJsTarget {
    getCommandName() {
        return 'serve';
    }
    getCommandEnvs(options: any) {
        return {
            PORT: options.port,
        }
    }
    buildDescription() {
        return 'Serve';
    }
}

export default JsServeTarget