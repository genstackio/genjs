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
}

export default JsServeTarget