import {BasePackage} from '@genjs/genjs-bundle-package';
import {
    BuildableBehaviour,
    CleanableBehaviour,
    InstallableBehaviour,
    DeployableBehaviour,
    GenerateEnvLocalableBehaviour,
    StartableBehaviour,
    TestableBehaviour,
} from '@genjs/genjs';

export class JavascriptPackage extends BasePackage {
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
            .addPredefinedTarget('install', 'js-install')
            .addPredefinedTarget('build', 'js-build')
            .addPredefinedTarget('deploy', 'js-deploy')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'APP', mode: vars.env_mode || 'terraform'})
            .addPredefinedTarget('start', 'js-start', {port: this.getParameter('startPort')})
            .addPredefinedTarget('test', 'js-test', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'js-test', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'js-test', {local: true})
            .addPredefinedTarget('test-ci', 'js-test', {ci: true, coverage: false})
        ;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'node',
            'es6',
            'yarn',
            'nvm',
            'npm',
            'markdown',
            'jest',
            'prettier',
        ];
    }
}

export default JavascriptPackage