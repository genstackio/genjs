import {GenericTarget} from '@genjs/genjs';

export class CleanBuildTarget extends GenericTarget {
    buildSteps({on = undefined, buildDir = 'build'}: {on?: string|string[], buildDir?: string}) {
        return [
            `rm -rf ${buildDir}/`,
        ];
    }
    buildDescription() {
        return 'Removes build directory';
    }
}

export default CleanBuildTarget