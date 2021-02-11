import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnMigrateTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'migrate';
    }
}

export default YarnMigrateTarget