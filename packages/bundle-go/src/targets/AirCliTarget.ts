import {GenericTarget} from '@genjs/genjs';

export abstract class AirCliTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            this.buildCli(
                'air',
                [],
                {},
                options,
                {},
                [],
                [],
                options['envs'] || {}
            )
        ];
    }
}

export default AirCliTarget