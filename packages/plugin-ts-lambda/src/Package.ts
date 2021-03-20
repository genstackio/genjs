import {
    AbstractPackage,
    GitIgnoreTemplate,
    LicenseTemplate,
    MakefileTemplate, PackageExcludesTemplate, ReadmeTemplate,
    TerraformToVarsTemplate,
} from '@genjs/genjs';

export default class Package extends AbstractPackage {
    protected getDefaultExtraOptions(): any {
        return {
            phase: 'pre',
        };
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            description: 'Typescript AWS Lambda',
            url: 'https://github.com',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['package-excludes.lst']: this.buildPackageExcludes(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
            ['Makefile']: this.buildMakefile(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return GitIgnoreTemplate.create(vars)
            .addComment('See https://help.github.com/articles/ignoring-files/ for more about ignoring files.')
            .addGroup('dependencies', [
                '/node_modules', '/.pnp', '.pnp.js',
            ])
            .addGroup('testing', [
                '/coverage',
            ])
            .addGroup('production', [
                '/build',
                '/lib',
            ])
            .addGroup('misc', [
                '.DS_Store',
                '.env.local', '.env.development.local', '.env.test.local', '.env.production.local',
                'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', '/dist'
            ])
            ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        return new MakefileTemplate({relativeToRoot: this.relativeToRoot, makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .setDefaultTarget('install')
            .addTarget('pre-install')
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {})
            .addPredefinedTarget('start', 'yarn-start')
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: true})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true})
            .addExportedVar('CI')
        ;
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars);
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
    protected buildPackageExcludes(vars: any): PackageExcludesTemplate {
        return PackageExcludesTemplate.create(vars);
    }
}