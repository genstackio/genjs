import AbstractJsTarget from './AbstractJsTarget';

export class JsMigrateTarget extends AbstractJsTarget {
    getCommandName() {
        return 'migrate';
    }
    buildDescription() {
        return 'Migrate';
    }
}

export default JsMigrateTarget