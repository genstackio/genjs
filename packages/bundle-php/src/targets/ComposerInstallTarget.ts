import AbstractComposerTarget from './AbstractComposerTarget';

export class ComposerInstallTarget extends AbstractComposerTarget {
    getCommandName() {
        return 'install';
    }
    buildDescription() {
        return 'Install the PHP dependencies';
    }
}

export default ComposerInstallTarget