import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerRefreshTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'refresh';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform init/plan/apply on all the specified layers of the specified env';
    }
}

export default TflayerRefreshTarget