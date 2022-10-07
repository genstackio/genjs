import {
    applyDeployMakefileHelper,
    applyMigrateMakefileHelper,
    applyStarterMakefileHelper,
    applyLogMakefileHelper,
    AwsLambdaPackage, applyDebugMakefileHelper
} from '@genjs/genjs-bundle-aws-lambda';
import {
    DeployableBehaviour,
    StartableBehaviour,
    BuildableBehaviour,
    CleanableBehaviour,
    InstallableBehaviour,
    GenerateEnvLocalableBehaviour,
    TestableBehaviour,
    LoggableBehaviour,
} from '@genjs/genjs';
import {applyRefreshMakefileHelper} from "@genjs/genjs-bundle-package";

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
            new LoggableBehaviour(),
            new StartableBehaviour(),
            new DeployableBehaviour(),
        ];
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            description: 'Python FastAPI AWS Lambda',
            url: 'https://github.com',
            pypi_repo: 'pypi',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any) {
        return {
            ...super.buildFilesFromTemplates(vars, cfg),
            ['requirements.txt']: true,
            ['requirements-dev.txt']: true,
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
        const t = super.buildMakefile(vars)
            .addGlobalVar('env', 'dev')

            .addGlobalVar('pip_dev_config_file', 'requirements-dev.txt')
            .addGlobalVar('pip_deps_dir', vars.pip_deps_dir ? vars.pip_deps_dir : 'package')
            .addGlobalVar('prefix', vars.prefix ? vars.prefix : vars.project_prefix)
            .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
            .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-${vars.name}-assets`)
            .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_${vars.name.toUpperCase()})`)
            .addPredefinedTarget('install', 'pip-install', {configFile: '$(pip_dev_config_file)', target: '$(pip_deps_dir)', sourceLocalEnvLocal: !!vars.env_local_required}, [], !!vars.env_local_required ? ['generate-env-local'] : [])
            .addNoopTarget('build')

            .addPredefinedTarget('generate-env-local', 'generate-env-local', {mode: vars.env_mode || 'terraform'})
            .addMetaTarget('clean', ['clean-build'])
            .addPredefinedTarget('clean-build', 'clean-build')

            .addNoopTarget('test')
            .addNoopTarget('test-dev')
            .addNoopTarget('test-cov')
            .addNoopTarget('test-ci')
        ;

        applyDebugMakefileHelper(t, vars, this);
        applyLogMakefileHelper(t, vars, this);
        applyStarterMakefileHelper(t, vars, this);
        applyDeployMakefileHelper(t, vars, this, {predefinedTarget: 'python-deploy'});
        applyMigrateMakefileHelper(t, vars, this);
        applyRefreshMakefileHelper(t, vars, this);

        return t;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'python',
            'fastapi',
        ];
    }
}