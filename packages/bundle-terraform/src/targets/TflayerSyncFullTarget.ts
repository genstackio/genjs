import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerSyncFullTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'sync-full';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute init/plan/apply(if need) on all the specified layers of the specified env';
    }
}

export default TflayerSyncFullTarget