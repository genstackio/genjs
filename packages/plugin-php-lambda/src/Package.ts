import {AwsLambdaPackage} from '@genjs/genjs-bundle-aws-lambda';
import {
    BuildableBehaviour,
    CleanableBehaviour,
    InstallableBehaviour,
    GenerateEnvLocalableBehaviour,
    TestableBehaviour,
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
    // noinspection JSUnusedLocalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            project_name: 'project',
            scripts: {
                "build": "build-package"
            },
            dependencies: {
                "@ohoareau/build-package": "^0.1.0"
            }
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildDynamicFiles(vars, cfg)),
            ['package.json']: this.buildPackageJson(vars),
        };
    }
    protected buildPackageJson(vars: any): Function {
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
        }, null, 4);
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addIgnore('/coverage/')
            .addIgnore('/node_modules/')
            .addIgnore('/vendor/')
            .addIgnore('/composer.phar')
            .addIgnore('/build/')
            .addIgnore('/reports/')
            .addIgnore('/.idea/')
            .addIgnore('/.env')
            .addIgnore('/bin/phpunit')
        ;
    }
    protected buildMakefile(vars: any) {
        const t = super.buildMakefile(vars)
            .addMetaTarget('install', ['install-js', 'install-php'])
            .addPredefinedTarget('install-js', 'yarn-install')
            .addPredefinedTarget('build-package', 'yarn-build')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {mode: vars.env_mode || 'terraform'})
            .addMetaTarget('clean', ['clean-modules', 'clean-coverage', 'clean-vendor', 'clean-build'])
            .addPredefinedTarget('clean-modules', 'clean-node-modules')
            .addPredefinedTarget('clean-coverage', 'clean-coverage')
            .addPredefinedTarget('clean-vendor', 'clean-vendor')
            .addPredefinedTarget('clean-build', 'clean-build')
            .addPredefinedTarget('test', 'composer-test', {ci: true, coverage: true})
            .addPredefinedTarget('test-dev', 'composer-test', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'composer-test', {local: true})
            .addPredefinedTarget('test-ci', 'composer-test', {ci: true})
        ;
        if (!!vars.env_local_required) {
            t
                .addPredefinedTarget('install-php', 'composer-install', {sourceLocalEnvLocal: !!vars.env_local_required}, [], ['generate-env-local'])
                .addPredefinedTarget('install-php-prod', 'composer-install-prod', {sourceLocalEnvLocal: !!vars.env_local_required}, [], ['generate-env-local'])
            ;
        } else {
            t
                .addPredefinedTarget('install-php', 'composer-install')
                .addPredefinedTarget('install-php-prod', 'composer-install-prod')
            ;
        }
        const buildSteps = ['build-package'];
        if (vars.download_on_build) {
            t
                .addTarget('build-downloads', Object.entries(vars.download_on_build).map(([k, v]) => {
                    return `rm -f ${k} && curl -sL ${v} -o ${k}`;
                }))
            ;
            buildSteps.push('build-downloads');
        }
        t
            .addMetaTarget('build', ['install-php-prod', ...buildSteps, 'install-php'])
        ;
        return t;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
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