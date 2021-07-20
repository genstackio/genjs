import {BasePackage} from '@genjs/genjs-bundle-package';
import {
    BuildableBehaviour,
    DeployableBehaviour,
    InstallableBehaviour,
    TestableBehaviour,
    CleanableBehaviour,
    GenerateEnvLocalableBehaviour,
    StartableBehaviour,
} from '@genjs/genjs';

export class RustPackage extends BasePackage {
    protected getBehaviours() {
        return [
            ...super.getBehaviours(),
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
            new DeployableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new StartableBehaviour(),
            new TestableBehaviour(),
        ]
    }
    protected buildMakefile(vars: any) {
        return super.buildMakefile(vars)
            .addGlobalVar('env', 'dev')
            .addNoopTarget('install')
            .addNoopTarget('build')
            .addNoopTarget('deploy')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'RUST', mode: vars.env_mode || 'terraform'})
            .addNoopTarget('start')
            .addNoopTarget('test')
            ;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'rust',
        ];
    }
}

export default RustPackage