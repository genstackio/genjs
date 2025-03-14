import {
    applyDeployMakefileHelper,
    applyMigrateMakefileHelper,
    applyStarterMakefileHelper,
    applyLogMakefileHelper,
    AwsLambdaPackage, applyDebugMakefileHelper
} from '@genjs/genjs-bundle-aws-lambda';
import {
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
        vars.resolutions = {
            ...(staticVars.resolutions || {}),
            ...(vars.resolutions || {}),
        };

        !Object.keys(vars.resolutions).length && delete vars.resolutions;
        return vars;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildDynamicFiles({licenseFile: 'LICENSE.md', ...vars}, cfg)),
            ['package.json']: this.buildPackageJson(vars),
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildStaticFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildStaticFiles(vars, cfg)),
            '.dockerignore?': true,
            'Dockerfile?': true,
            'react-router.config.ts?': true,
            'tailwind.config.ts?': true,
            'tsconfig.json?': true,
            'vite.config.ts?': true,
        };
    }
    protected buildPackageJson(vars: any) {
        return () => JSON.stringify({
            name: vars.name,
            license: vars.license,
            dependencies: vars.dependencies,
            scripts: vars.scripts,
            devDependencies: vars.devDependencies,
            ...(vars.resolutions ? {resolutions: vars.resolutions} : {}),
            version: vars.version,
            description: vars.description,
            author: (vars.author && ('object' === typeof vars.author)) ? vars.author : {name: vars.author_name, email: vars.author_email},
            private: true,
            ...(vars.packageJson || {}),
            ...(vars.type ? { type: vars.type } : {}),
        }, null, 4);
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addIgnore('/coverage/')
            .addIgnore('/node_modules/')
            .addIgnore('/.idea/')
            .addIgnore('.DS_Store')
            .addIgnore('/.react-router/')
            .addIgnore('/build/')
        ;
    }
    protected buildMakefile(vars: any) {
        const t = super.buildMakefile(vars)
            .addGlobalVar('env', 'dev')
            .addPredefinedTarget('install', 'js-install')
            .addPredefinedTarget('build', 'js-build')
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
        ];
    }
}
