import AbstractJsTarget from './AbstractJsTarget';

export class JsLernaBootstrapTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lerna bootstrap';
    }
    getCommandOptions({scope}) {
        return {scope};
    }
    buildDescription() {
        return 'Install the dependencies of all packages using Lerna';
    }
}

export default JsLernaBootstrapTarget