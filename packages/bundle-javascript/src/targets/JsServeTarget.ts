import AbstractJsTarget from './AbstractJsTarget';

export class JsServeTarget extends AbstractJsTarget {
    getCommandName() {
        return 'serve';
    }
    getCommandEnvs(options: any) {
        return {
            ...super.getCommandEnvs(options),
            ...(options.PORT ? {PORT: options.port} : {}),
        }
    }
    buildDescription() {
        return 'Serve';
    }
}

export default JsServeTarget