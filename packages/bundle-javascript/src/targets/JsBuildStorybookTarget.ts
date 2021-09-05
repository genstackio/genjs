import AbstractJsTarget from './AbstractJsTarget';

export class JsBuildStorybookTarget extends AbstractJsTarget {
    getCommandName() {
        return 'build-storybook';
    }
    buildDescription() {
        return 'Build the Storybook to a deployable local directory';
    }
}

export default JsBuildStorybookTarget