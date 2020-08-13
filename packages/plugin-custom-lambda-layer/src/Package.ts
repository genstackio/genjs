import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, MakefileTemplate, ReadmeTemplate, LicenseTemplate} from "@ohoareau/microgen-templates";

export default class Package extends AbstractPackage {
    protected getDefaultFeatures(): any {
        return {
            buildable: true,
            cleanable: true,
            installable: true,
        };
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
        }
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars);
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addIgnore('/.idea/')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const t = new MakefileTemplate(vars.makefile || {})
            .addGlobalVar('env', 'dev')
            .addShellTarget('build', './bin/build', ['clean'])
            .addShellTarget('clean', './bin/clean')
            .addShellTarget('install', './bin/install')
            .setDefaultTarget('install')
        ;
        vars.deployable && t.addTarget('deploy');
        return t;
    }
}