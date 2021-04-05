import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnPackageTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'package';
    }
}

export default YarnPackageTarget