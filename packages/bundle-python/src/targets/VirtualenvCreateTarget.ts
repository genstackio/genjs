import {GenericTarget} from '@genjs/genjs';

export class VirtualenvCreateTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `virtualenv venv`,
        ];
    }
}

export default VirtualenvCreateTarget