import {GenericTarget} from '@genjs/genjs';

export class CleanCoverageTarget extends GenericTarget {
    buildSteps({on = undefined, coverageDir = 'coverage'}: {on?: string|string[], coverageDir?: string}) {
        const dirs: string[] = Array.isArray(on) ? on : (on ? [on] : []);
        return [
            `rm -rf ${coverageDir}/`,
            ...(dirs.map(d => `find ${d}/ -name ${coverageDir} -type d -exec rm -rf {} +`)),
        ];
    }
    buildDescription() {
        return 'Remove test coverage directory';
    }
}

export default CleanCoverageTarget