import {BasePackage} from '@genjs/genjs-bundle-package';
import {
    BuildableBehaviour,
    DeployableBehaviour,
    InstallableBehaviour,
    PreInstallableBehaviour,
    TestableBehaviour,
    CleanableBehaviour,
} from '@genjs/genjs';

export class PythonPackage extends BasePackage {
    protected getBehaviours() {
        return [
            ...super.getBehaviours(),
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new DeployableBehaviour(),
            new InstallableBehaviour(),
            new PreInstallableBehaviour(),
            new TestableBehaviour(),
        ]
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            url: 'https://github.com',
            pypi_repo: 'pypi',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any) {
        return {
            ...super.buildFilesFromTemplates(vars, cfg),
            ['requirements.txt']: true,
            ['setup.py']: true,
            ['tests/__init__.py']: true,
        };
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'python',
        ];
    }
}

export default PythonPackage