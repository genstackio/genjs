import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerPlanTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'plan';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform-plan on all the specified layers of the specified env';
    }
}

export default TflayerPlanTarget