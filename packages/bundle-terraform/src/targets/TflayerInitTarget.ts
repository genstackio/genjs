import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerInitTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'init';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform-init on all the specified layers of the specified env';
    }
}

export default TflayerInitTarget