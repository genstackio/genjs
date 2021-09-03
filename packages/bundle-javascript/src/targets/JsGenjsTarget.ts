import AbstractJsTarget from './AbstractJsTarget';

export class JsGenjsTarget extends AbstractJsTarget {
    getCommandName() {
        return 'genjs';
    }
}

export default JsGenjsTarget