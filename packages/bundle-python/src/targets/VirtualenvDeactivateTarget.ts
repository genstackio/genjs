import {GenericTarget} from '@genjs/genjs';

export class VirtualenvDeactivateTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `deactivate`,
        ];
    }
    buildDescription() {
        return 'Disable the virtualenv';
    }
}

export default VirtualenvDeactivateTarget