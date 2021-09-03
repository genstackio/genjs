import AbstractJsTarget from './AbstractJsTarget';

export class JsInstallProdTarget extends AbstractJsTarget {
    isScriptCommand(): boolean {
        return false;
    }
    getCommandName() {
        return 'install';
    }
    getCommandOptions(options: any): any {
        return {prod: true};
    }
}

export default JsInstallProdTarget