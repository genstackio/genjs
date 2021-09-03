import {
    AbstractPackage,
    GitIgnoreTemplate,
    LicenseTemplate,
    ReadmeTemplate,
    TerraformToVarsTemplate,
    MakefileTemplate, IBehaviour,
} from '@genjs/genjs';

export class BasePackage extends AbstractPackage {
    protected getBehaviours(): IBehaviour[] {
        return [];
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            description: 'package',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
        };
    }
    protected getDefaultExtraOptions(): any {
        return {
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        return {
            [vars.licenseFile || 'LICENSE']: this.buildLicense(vars),
            [vars.readmeFile || 'README.md']: this.buildReadme(vars),
            [vars.gitignoreFile || '.gitignore']: this.buildGitIgnore(vars),
            [vars.terraformToVarsJsonFile || 'terraform-to-vars.json']: this.buildTerraformToVars(vars),
            [vars.makefileFile || 'Makefile']: this.buildMakefile(vars),
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
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return GitIgnoreTemplate.create(vars);
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        return new MakefileTemplate({options: {npmClient: vars.npm_client || vars.npmClient}, predefinedTargets: this.predefinedTargets, relativeToRoot: this.relativeToRoot, makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .setDefaultTarget('install')
            .addExportedVar('CI')
        ;
    }
    protected getTechnologies(): any {
        return [
            'make',
            'git',
            'json',
        ];
    }
}

export default BasePackage