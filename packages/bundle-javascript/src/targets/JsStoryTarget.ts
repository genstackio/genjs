import AbstractJsTarget from './AbstractJsTarget';

export class JsStoryTarget extends AbstractJsTarget {
    getCommandName() {
        return 'story';
    }
}

export default JsStoryTarget