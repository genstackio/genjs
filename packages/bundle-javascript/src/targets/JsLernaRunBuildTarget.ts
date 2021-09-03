import AbstractJsTarget from './AbstractJsTarget';

export class JsLernaRunBuildTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lerna run build';
    }
    getCommandOptions() {
        return {stream: true};
    }
}

export default JsLernaRunBuildTarget