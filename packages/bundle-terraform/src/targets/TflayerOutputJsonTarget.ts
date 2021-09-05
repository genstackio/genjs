import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerOutputJsonTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'output-json';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Export all the outputs of the specified terraform layer in JSON';
    }
}

export default TflayerOutputJsonTarget