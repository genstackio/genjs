import {GenericTarget} from '@genjs/genjs';

export class PipInstallBuildUtilsTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `python3 -m pip --disable-pip-version-check --root-user-action=ignore install --upgrade pip`,
            `python3 -m pip --disable-pip-version-check --root-user-action=ignore install --upgrade setuptools wheel twine`,
        ];
    }
    buildDescription() {
        return 'Install Python build-utils';
    }
}

export default PipInstallBuildUtilsTarget