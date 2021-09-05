import AbstractJsTarget from './AbstractJsTarget';

export class JsLernaChangedTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lerna changed';
    }
    buildDescription() {
        return 'Display all changed packages since last publish';
    }
}

export default JsLernaChangedTarget