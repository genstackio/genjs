import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerInitFullTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'init-full';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform-init on all the specified layers of the specified env';
    }
}

export default TflayerInitFullTarget