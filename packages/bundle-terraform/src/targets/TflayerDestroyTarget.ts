import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerDestroyTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'destroy';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform-destroy on all the specified layers of the specified env';
    }
}

export default TflayerDestroyTarget