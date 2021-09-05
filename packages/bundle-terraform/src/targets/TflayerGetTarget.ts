import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerGetTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'get';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform-get on all the specified layers of the specified env';
    }
}

export default TflayerGetTarget