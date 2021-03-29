import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerCleanDirsTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'clean-dirs';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
}

export default TflayerCleanDirsTarget