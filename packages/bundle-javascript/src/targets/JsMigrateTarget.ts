import AbstractJsTarget from './AbstractJsTarget';

export class JsMigrateTarget extends AbstractJsTarget {
    getCommandName() {
        return 'migrate';
    }
}

export default JsMigrateTarget