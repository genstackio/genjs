import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerListLayersTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'list-layers';
    }
    buildDescription() {
        return 'List all terraform layers';
    }
}

export default TflayerListLayersTarget