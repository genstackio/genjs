import {GenericTarget} from '@genjs/genjs';

export class VirtualenvCreateTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `virtualenv venv`,
        ];
    }
    buildDescription() {
        return 'Create the virtualenv';
    }
}

export default VirtualenvCreateTarget