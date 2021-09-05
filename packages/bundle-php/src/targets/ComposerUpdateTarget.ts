import AbstractComposerTarget from './AbstractComposerTarget';

export class ComposerUpdateTarget extends AbstractComposerTarget {
    getCommandName() {
        return 'update';
    }
    buildDescription() {
        return 'Update the PHP dependencies';
    }
}

export default ComposerUpdateTarget