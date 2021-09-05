import {GenericTarget} from '@genjs/genjs';

export class CleanVendorTarget extends GenericTarget {
    buildSteps({on = undefined, vendorDir = 'vendor'}: {on?: string|string[], vendorDir?: string}) {
        return [
            `rm -rf ${vendorDir}/`,
        ];
    }
    buildDescription() {
        return 'Remove the PHP dependencies directory';
    }
}

export default CleanVendorTarget