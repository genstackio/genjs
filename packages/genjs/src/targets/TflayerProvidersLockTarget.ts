import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerProvidersLockTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'providers-lock';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerProvidersLockTarget