import AbstractJsTarget from './AbstractJsTarget';

export class JsLogTarget extends AbstractJsTarget {
    isScriptCommand(): boolean {
        return false;
    }
    getCommandName() {
        return 'log';
    }
    buildDescription() {
        return 'Log';
    }
}

export default JsLogTarget