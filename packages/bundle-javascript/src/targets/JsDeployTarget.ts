import AbstractJsTarget from './AbstractJsTarget';

export class JsDeployTarget extends AbstractJsTarget {
    getCommandName() {
        return 'deploy';
    }
}

export default JsDeployTarget