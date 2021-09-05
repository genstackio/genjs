import AbstractJsTarget from './AbstractJsTarget';

export class JsLernaPublishTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lerna publish';
    }
    buildDescription() {
        return 'Publish all changed packages';
    }
}

export default JsLernaPublishTarget