import AbstractJsTarget from './AbstractJsTarget';

export class JsBuildStorybookTarget extends AbstractJsTarget {
    getCommandName() {
        return 'build-storybook';
    }
}

export default JsBuildStorybookTarget