import {
    AbstractPackage,
    GitIgnoreTemplate,
    LicenseTemplate,
    ReadmeTemplate,
    PackageExcludesTemplate,
    TerraformToVarsTemplate,
    BuildableBehaviour,
    CleanableBehaviour,
    InstallableBehaviour,
    GenerateEnvLocalableBehaviour, TestableBehaviour,
} from '@genjs/genjs';

export default class Package extends AbstractPackage {
    protected getBehaviours() {
        return [
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new TestableBehaviour(),
        ];
    }
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
            description: 'Python AWS Lambda',
            url: 'https://github.com',
            pypi_repo: 'pypi',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['requirements.txt']: true,
            ['tests/__init__.py']: true,
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        return {
            ['LICENSE']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['package-excludes.lst']: this.buildPackageExcludes(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
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
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return GitIgnoreTemplate.create(vars)
            .addIgnore('/.idea/')
        ;
    }
}