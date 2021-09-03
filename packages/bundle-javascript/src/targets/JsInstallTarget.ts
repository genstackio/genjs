import AbstractJsTarget from './AbstractJsTarget';

export class JsInstallTarget extends AbstractJsTarget {
    isScriptCommand(): boolean {
        return false;
    }
    getCommandName() {
        return 'install';
    }
}

export default JsInstallTarget