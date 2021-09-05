import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerOutputTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'output';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Display all the outputs of the specified terraform layer';
    }
}

export default TflayerOutputTarget