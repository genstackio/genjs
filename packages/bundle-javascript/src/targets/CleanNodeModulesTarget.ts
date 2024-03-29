import {GenericTarget} from '@genjs/genjs';

export class CleanNodeModulesTarget extends GenericTarget {
    buildSteps({on = undefined, nodeModulesDir = 'node_modules'}: {on?: string|string[], nodeModulesDir?: string}) {
        const dirs: string[] = Array.isArray(on) ? on : (on ? [on] : []);
        return [
            `rm -rf ${nodeModulesDir}/`,
            ...(dirs.map(d => `find ${d}/ -name ${nodeModulesDir} -type d -exec rm -rf {} +`)),
        ];
    }
    buildDescription() {
        return 'Remove Javascript dependencies directory';
    }
}

export default CleanNodeModulesTarget