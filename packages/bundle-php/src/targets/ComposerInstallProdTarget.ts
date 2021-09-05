import AbstractComposerTarget from './AbstractComposerTarget';

export class ComposerInstallProdTarget extends AbstractComposerTarget {
    getCommandName() {
        return 'install';
    }
    getCommandOptions(options: any): any {
        return {'no-dev': true};
    }
    buildDescription() {
        return 'Install production PHP dependencies';
    }
}

export default ComposerInstallProdTarget