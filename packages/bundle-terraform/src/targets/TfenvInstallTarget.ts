import AbstractTfenvTarget from './AbstractTfenvTarget';

export class TfenvInstallTarget extends AbstractTfenvTarget {
    getCommandName() {
        return 'install';
    }
    buildDescription() {
        return 'Install Terraform required version using tfenv';
    }
}

export default TfenvInstallTarget