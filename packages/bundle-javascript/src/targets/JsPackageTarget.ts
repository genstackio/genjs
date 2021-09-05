import AbstractJsTarget from './AbstractJsTarget';

export class JsPackageTarget extends AbstractJsTarget {
    getCommandName() {
        return 'package';
    }
    buildDescription() {
        return 'Package';
    }
}

export default JsPackageTarget