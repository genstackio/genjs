import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerProvidersLockTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'providers-lock';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Regenerate the terraform lock-file on all the specified layers of the specified env';
    }
}

export default TflayerProvidersLockTarget