import AbstractJsTarget from './AbstractJsTarget';

export class JsLernaBootstrapTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lerna bootstrap';
    }
    getCommandOptions({scope}) {
        return {scope};
    }
}

export default JsLernaBootstrapTarget