import AbstractJsTarget from './AbstractJsTarget';

export class JsLernaChangedTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lerna changed';
    }
}

export default JsLernaChangedTarget