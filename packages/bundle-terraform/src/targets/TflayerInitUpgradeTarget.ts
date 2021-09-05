import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerInitUpgradeTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'init-upgrade';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform-init on all the specified layers of the specified env (with upgrade)';
    }
}

export default TflayerInitUpgradeTarget