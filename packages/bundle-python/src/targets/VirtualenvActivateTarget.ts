import {GenericTarget} from '@genjs/genjs';

export class VirtualenvActivateTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `. venv/bin/activate`,
        ];
    }
    buildDescription() {
        return 'Enable the virtualenv';
    }
}

export default VirtualenvActivateTarget