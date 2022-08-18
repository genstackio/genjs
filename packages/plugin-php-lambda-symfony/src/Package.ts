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
    protected buildVars(vars: any) {
        const staticVars = require('../vars.json');
        vars = {...staticVars, ...super.buildVars(vars)};
        vars.scripts = {
            ...staticVars.scripts,
            ...(vars.scripts || {}),
        };
        vars.dependencies = {
            ...staticVars.dependencies,
            ...(vars.dependencies || {}),
        };
        vars.devDependencies = {
            ...staticVars.devDependencies,
            ...(vars.devDependencies || {}),
        };
        return vars;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildDynamicFiles({licenseFile: 'LICENSE.md', ...vars}, cfg)),
//            ['package.json']: this.buildPackageJson(vars),
        };
    }
    protected buildPackageJson(vars: any) {
        return () => JSON.stringify({
            name: vars.name,
            license: vars.license,
            dependencies: vars.dependencies,
            scripts: vars.scripts,
            devDependencies: vars.devDependencies,
            version: vars.version,
            description: vars.description,
            author: (vars.author && ('object' === typeof vars.author)) ? vars.author : {name: vars.author_name, email: vars.author_email},
            private: true,
            ...(vars.packageJson || {}),
        }, null, 4);
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)

            .addEnclosedGroup('symfony/framework-bundle', [
                '/.env.local',
                '/.env.local.php',
                '/.env.*.local',
                '/config/secrets/prod/prod.decrypt.private.php',
                '/public/bundles/',
                '/var/',
                '/vendor/',
            ], )

            .addEnclosedGroup('symfony/phpunit-bridge', [
                '.phpunit.result.cache',
                '/phpunit.xml',
            ])

            .addEnclosedGroup('phpunit/phpunit', [
                '/phpunit.xml',
                '.phpunit.result.cache',
            ])

            .addIgnore('/.idea/')

            .addEnclosedGroup('symfony/webpack-encore-bundle', [
                '/node_modules/',
                '/public/build/',
                'npm-debug.log',
                'yarn-error.log',
            ])

            .addIgnore('/coverage/')
            .addIgnore('/composer.phar')
            .addIgnore('/build/')
            .addIgnore('/reports/')
            .addIgnore('/.env')
            .addIgnore('/web/bundles/')
            .addIgnore('/app/bootstrap.php.cache')
            .addIgnore('/app/cache/*')
            .addNonIgnore('/app/cache/.gitkeep')
            .addIgnore('/app/logs/*')
            .addNonIgnore('/app/logs/.gitkeep')
            .addIgnore('/app/files/*')
            .addNonIgnore('/app/files/.gitkeep')
//            .addIgnore('/bin/doctrine*')
//            .addIgnore('/bin/phpunit')
            .addIgnore('/app/config/parameters.yml')
        ;
    }
    protected buildMakefile(vars: any) {
        const t = super.buildMakefile(vars)
            .addGlobalVar('env', 'dev')

            .addGlobalVar('prefix', vars.prefix ? vars.prefix : vars.project_prefix)
            .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
            .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-${vars.name}-assets`)
            .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_${vars.name.toUpperCase()})`)
            .addGlobalVar('symfony_env', vars.symfony_env ? vars.symfony_env : `$(env)`)
            .addMetaTarget('install', ['install-js', 'install-php'])

            .addPredefinedTarget('install-js', 'js-install')
            .addPredefinedTarget('install-php', 'composer-install')
            .addPredefinedTarget('build', 'js-build')

            .addPredefinedTarget('generate-env-local', 'generate-env-local', {mode: vars.env_mode || 'terraform'})
            .addMetaTarget('clean', ['clean-modules', 'clean-coverage', 'clean-vendor', 'clean-build', 'clean-web-bundles'])

            .addPredefinedTarget('clean-modules', 'clean-node-modules')
            .addPredefinedTarget('clean-coverage', 'clean-coverage')
            .addPredefinedTarget('test', 'js-test', {ci: true, coverage: true})
            .addPredefinedTarget('test-dev', 'js-test', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'js-test', {local: true})
            .addPredefinedTarget('test-ci', 'js-test', {ci: true})
        ;

        applyDebugMakefileHelper(t, vars, this);
        applyLogMakefileHelper(t, vars, this);
        applyStarterMakefileHelper(t, vars, this);
        applyDeployMakefileHelper(t, vars, this, {predefinedTarget: 'js-deploy'});
        applyMigrateMakefileHelper(t, vars, this);
        applyRefreshMakefileHelper(t, vars, this);

        return t;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'symfony',
            'php',
            'phpenv',
            'node',
            'es6',
            'yarn',
            'nvm',
            'npm',
            'markdown',
            'composer',
        ];
    }
}