import AbstractJsTarget from './AbstractJsTarget';

export class JsInstallTarget extends AbstractJsTarget {
    isScriptCommand(): boolean {
        return false;
    }
    getCommandName() {
        return 'install';
    }
    buildDescription() {
        return 'Install the Javascript dependencies';
    }
}

export default JsInstallTarget