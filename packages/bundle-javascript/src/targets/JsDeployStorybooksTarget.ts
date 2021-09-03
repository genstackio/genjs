import AbstractJsTarget from './AbstractJsTarget';

export class JsDeployStorybooksTarget extends AbstractJsTarget {
    getCommandName() {
        return 'deploy-storybooks';
    }
}

export default JsDeployStorybooksTarget