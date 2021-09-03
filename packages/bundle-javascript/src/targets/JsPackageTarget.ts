import AbstractJsTarget from './AbstractJsTarget';

export class JsPackageTarget extends AbstractJsTarget {
    getCommandName() {
        return 'package';
    }
}

export default JsPackageTarget