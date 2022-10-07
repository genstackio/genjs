import {GenericTarget} from '@genjs/genjs';

export class PipInstallBuildUtilsTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `python3 -m pip install --disable-pip-version-check --root-user-action=ignore --upgrade pip`,
            `python3 -m pip install --disable-pip-version-check --root-user-action=ignore --upgrade setuptools wheel twine`,
        ];
    }
    buildDescription() {
        return 'Install Python build-utils';
    }
}

export default PipInstallBuildUtilsTarget