import {GenericTarget} from '@genjs/genjs';

export class VirtualenvDeactivateTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `deactivate`,
        ];
    }
}

export default VirtualenvDeactivateTarget