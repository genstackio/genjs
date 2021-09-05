import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerApplyTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'apply';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform-apply on all the specified layers of the specified env';
    }
}

export default TflayerApplyTarget