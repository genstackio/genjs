import {GenericTarget} from '@genjs/genjs';

export class PipInstallTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `python3 -m pip --disable-pip-version-check --root-user-action=ignore install -r requirements.txt`,
        ];
    }
    buildDescription() {
        return 'Install the Python dependencies';
    }
}

export default PipInstallTarget