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

export class TypescriptPackage extends BasePackage {
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
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build')
            .addPredefinedTarget('deploy', 'yarn-deploy')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'APP', mode: vars.env_mode || 'terraform'})
            .addPredefinedTarget('start', 'yarn-start', {port: this.getParameter('startPort')})
            .addPredefinedTarget('serve', 'yarn-serve', {port: this.getParameter('servePort')})
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true, coverage: false})
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
            'typescript',
        ];
    }
}

export default TypescriptPackage