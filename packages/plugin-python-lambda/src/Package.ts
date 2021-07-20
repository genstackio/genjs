import {AwsLambdaPackage} from '@genjs/genjs-bundle-aws-lambda';
import {
    BuildableBehaviour,
    CleanableBehaviour,
    InstallableBehaviour,
    GenerateEnvLocalableBehaviour, TestableBehaviour,
} from '@genjs/genjs';

export default class Package extends AwsLambdaPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    protected getBehaviours() {
        return [
            ...super.getBehaviours(),
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new TestableBehaviour(),
        ];
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            description: 'Python AWS Lambda',
            url: 'https://github.com',
            pypi_repo: 'pypi',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any) {
        return {
            ...super.buildFilesFromTemplates(vars, cfg),
            ['requirements.txt']: true,
            ['tests/__init__.py']: true,
        };
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addIgnore('/build/')
            .addIgnore('/.idea/')
            .addIgnore('/.env')
        ;
    }
    protected buildMakefile(vars: any) {
        return super.buildMakefile(vars)
            .addPredefinedTarget('install', 'pip-install', {sourceLocalEnvLocal: !!vars.env_local_required}, [], ['generate-env-local'])
            .addNoopTarget('build')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {mode: vars.env_mode || 'terraform'})
            .addMetaTarget('clean', ['clean-build'])
            .addPredefinedTarget('clean-build', 'clean-build')
            .addNoopTarget('test')
            .addNoopTarget('test-dev')
            .addNoopTarget('test-cov')
            .addNoopTarget('test-ci')
        ;
    }
}