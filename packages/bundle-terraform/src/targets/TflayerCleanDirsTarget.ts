import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerCleanDirsTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'clean-dirs';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Remove all generated directory for terraform';
    }
}

export default TflayerCleanDirsTarget