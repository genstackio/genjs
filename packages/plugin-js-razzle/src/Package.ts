import {
    applyDebugMakefileHelper,
    applyDeployMakefileHelper, applyLogMakefileHelper,
    applyMigrateMakefileHelper,
    applyStarterMakefileHelper,
    AwsLambdaPackage
} from '@genjs/genjs-bundle-aws-lambda';
import {
    BuildableBehaviour,
    CleanableBehaviour,
    InstallableBehaviour,
    GenerateEnvLocalableBehaviour,
    TestableBehaviour,
    ValidatableBehaviour,
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
            new ValidatableBehaviour(),
        ];
    }
    protected getDefaultExtraOptions() {
        return {
            phase: 'pre',
        };
    }
    protected buildVars(vars: any) {
        const staticVars = require('../vars.json');
        vars = {...staticVars, ...super.buildVars(vars)};
        vars.deploy_assets_support = true;
        vars.cdn_support = true;
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
            ['package.json']: this.buildPackageJson(vars),
        };
    }
    protected buildReadme(vars: any) {
        return super.buildReadme(vars)
            .addFragmentFromTemplate(`${__dirname}/../templates/readme/original.md.ejs`)
        ;
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
        }, null, 4);
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addIgnore('/coverage/')
            .addIgnore('/node_modules/')
            .addIgnore('/.idea/')
            .addIgnore('/build/')
            .addIgnore('/logs/')
            .addIgnore('/cache/')
            .addIgnore('/.env.local')
            .addIgnore('/.env.*.local')
            .addIgnore('.DS_Store')
            .addIgnore('*.log')
            .addIgnore('npm-debug.log*')
        ;
    }
    protected buildMakefile(vars: any) {
        const t = super.buildMakefile(vars)
            .addGlobalVar('env', 'dev')
            .addPredefinedTarget('install', 'js-install')
            .addPredefinedTarget('build-code', 'js-build', {sourceLocalEnvLocal: vars.sourceLocalEnvLocal, options: {noninteractive: true}})
            .addPredefinedTarget('build-package', 'js-package', {sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
            .addMetaTarget('build', ['build-code', 'build-package'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {mode: vars.env_mode || 'terraform'})
            .addMetaTarget('clean', ['clean-modules', 'clean-coverage'])
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
            'node',
            'es6',
            'yarn',
            'nvm',
            'npm',
            'markdown',
            'jest',
            'prettier',
            'react_razzle',
        ];
    }
}