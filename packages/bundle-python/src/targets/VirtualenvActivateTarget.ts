import {GenericTarget} from '@genjs/genjs';

export class VirtualenvActivateTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `. venv/bin/activate`,
        ];
    }
}

export default VirtualenvActivateTarget