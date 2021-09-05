import {GenericTarget} from '@genjs/genjs';

export class PipInstallTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `python3 -m pip install -r requirements.txt`,
        ];
    }
    buildDescription() {
        return 'Install the Python dependencies';
    }
}

export default PipInstallTarget