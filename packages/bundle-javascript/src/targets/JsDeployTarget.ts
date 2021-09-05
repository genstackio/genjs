import AbstractJsTarget from './AbstractJsTarget';

export class JsDeployTarget extends AbstractJsTarget {
    getCommandName() {
        return 'deploy';
    }
    buildDescription() {
        return 'Deploy';
    }
}

export default JsDeployTarget