import AbstractJsTarget from './AbstractJsTarget';

export class JsBuildTarget extends AbstractJsTarget {
    isScriptCommand(): boolean {
        return false;
    }

    getCommandName() {
        return 'build';
    }
}

export default JsBuildTarget