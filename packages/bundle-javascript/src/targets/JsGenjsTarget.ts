import AbstractJsTarget from './AbstractJsTarget';

export class JsGenjsTarget extends AbstractJsTarget {
    getCommandName() {
        return 'genjs';
    }
    buildDescription() {
        return 'Generate and synchronize the source code using GenJS';
    }
}

export default JsGenjsTarget