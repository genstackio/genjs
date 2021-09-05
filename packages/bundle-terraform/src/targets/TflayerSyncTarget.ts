import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerSyncTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'sync';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute init/plan/apply(if need) on all the specified layers of the specified env';
    }
}

export default TflayerSyncTarget