import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerUpdateTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'update';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform-update on all the specified layers of the specified env';
    }
}

export default TflayerUpdateTarget