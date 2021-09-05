import AbstractComposerTarget from './AbstractComposerTarget';

export class ComposerTestTarget extends AbstractComposerTarget {
    getCommandName() {
        return 'run-script';
    }
    getCommandArgs(options: any): any[] {
        return ['test'];
    }
    buildDescription() {
        return 'Execute the tests';
    }
}

export default ComposerTestTarget