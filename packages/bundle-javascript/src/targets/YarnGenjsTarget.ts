import AbstractYarnTarget from './AbstractYarnTarget';

export class YarnGenjsTarget extends AbstractYarnTarget {
    getCommandName() {
        return 'genjs';
    }
}

export default YarnGenjsTarget