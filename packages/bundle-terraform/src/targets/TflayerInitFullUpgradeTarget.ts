import AbstractTflayerTarget from './AbstractTflayerTarget';

export class TflayerInitFullUpgradeTarget extends AbstractTflayerTarget {
    getCommandName() {
        return 'init-full-upgrade';
    }
    getCommandArgs() {
        return ['$(layer)'];
    }
    buildDescription() {
        return 'Execute terraform-init on all the specified layers of the specified env (with upgrade)';
    }
}

export default TflayerInitFullUpgradeTarget