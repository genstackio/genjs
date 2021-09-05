import AbstractJsTarget from './AbstractJsTarget';

export class JsLernaRunBuildTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lerna run build';
    }
    getCommandOptions() {
        return {stream: true};
    }
    buildDescription() {
        return 'Execute the build on all the packages';
    }
}

export default JsLernaRunBuildTarget