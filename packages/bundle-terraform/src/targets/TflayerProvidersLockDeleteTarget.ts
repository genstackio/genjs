import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerProvidersLockDeleteTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'providers-lock-delete';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Delete the terraform lock-file on all the specified layers of the specified env';
    }
}

export default TflayerProvidersLockDeleteTarget