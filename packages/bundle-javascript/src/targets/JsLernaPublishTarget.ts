import AbstractJsTarget from './AbstractJsTarget';

export class JsLernaPublishTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lerna publish';
    }
}

export default JsLernaPublishTarget