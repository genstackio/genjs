import AbstractJsTarget from './AbstractJsTarget';

export class JsDeployStorybooksTarget extends AbstractJsTarget {
    getCommandName() {
        return 'deploy-storybooks';
    }
    buildDescription() {
        return 'Deploy the already built storybook export directory';
    }
}

export default JsDeployStorybooksTarget