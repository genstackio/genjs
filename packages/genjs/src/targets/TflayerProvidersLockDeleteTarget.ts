import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerProvidersLockDeleteTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'providers-lock-delete';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerProvidersLockDeleteTarget