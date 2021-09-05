import {GenericTarget} from '@genjs/genjs';

export class CleanWebBundlesTarget extends GenericTarget {
    buildSteps({on = undefined, webBundlesDir = 'web/bundles'}: {on?: string|string[], webBundlesDir?: string}) {
        return [
            `rm -rf ${webBundlesDir}/`,
        ];
    }
    buildDescription() {
        return 'Remove the Symfony web bundles generated directory';
    }
}

export default CleanWebBundlesTarget