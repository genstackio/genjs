import AbstractJsTarget from './AbstractJsTarget';

export class JsStoryTarget extends AbstractJsTarget {
    getCommandName() {
        return 'story';
    }
    buildDescription() {
        return 'Execute the Storybook';
    }
}

export default JsStoryTarget