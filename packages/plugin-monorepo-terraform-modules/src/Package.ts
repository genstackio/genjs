import {
    AbstractPackage,
    GitIgnoreTemplate,
    LicenseTemplate,
    MakefileTemplate,
    ReadmeTemplate,
    TerraformToVarsTemplate,
} from '@genjs/genjs';

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            project_prefix: 'mycompany',
            project_name: 'myproject',
            projects: [],
            scm: 'git',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        return {
            ['LICENSE.md']: this.buildLicense(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
            ['README.md']: this.buildReadme(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars);
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return GitIgnoreTemplate.create(vars)
            .addGroup('Logs', [
                'logs', '*.log', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*',
            ])
            .addGroup('Root Dependency directories', [
                '/node_modules/',
            ])
            .addGroup('Optional npm cache directory', [
                '.npm',
            ])
            .addGroup('dotenv environment variable files', [
                '.env*',
            ])
            .addGroup('Mac files', [
                '.DS_Store',
            ])
            .addGroup('Yarn', [
                'yarn-error.log', '.pnp/', '.pnp.js',
            ])
            .addGroup('Yarn Integrity file', [
                '.yarn-integrity',
            ])
            .addGroup('IDE files', [
                '.idea/'
            ])
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const scm = vars.scm || 'git';
        const withLayers = true === vars.manage_layers;
        const withModules = true === vars.manage_modules;
        const withTerraformDocs = true === vars.terraform_docs;
        const t = new MakefileTemplate({relativeToRoot: this.relativeToRoot, makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addPredefinedTarget('generate', 'yarn-genjs')
            .addPredefinedTarget('install-root', 'yarn-install')
            .addMetaTarget('install', ['install-root', withLayers && 'install-layers', withModules && 'install-modules'].filter(x => !!x) as string[])
            .setDefaultTarget('install')
        ;
        if (withTerraformDocs && (withLayers || withModules)) {
            t
                .addMetaTarget('generate-docs', [withLayers && 'generate-docs-layers', withModules && 'generate-docs-modules'].filter(x => !!x) as string[])
        }
        if (withLayers) {
            t
                .addGlobalVar('layers', '$(shell cd layers && ls -d */ 2>/dev/null)')
                .addGlobalVar('makeable_layers', '$(shell cd layers && ls -d */Makefile 2>/dev/null | sed s,/Makefile,,)')
                .addTarget('install-layers', ['$(foreach l,$(makeable_layers),make -C layers/$(l)/ install;)'], ['install-root'])
                .addTarget('build-layers', ['$(foreach l,$(makeable_layers),make -C layers/$(l)/ build;)'], ['install-root'])
                .addTarget('test-layers', ['$(foreach l,$(makeable_layers),make -C layers/$(l)/ test;)'], ['install-root'])
                .addSubTarget('layer-install', 'layers/$(l)', 'install')
                .addSubTarget('layer-build', 'layers/$(l)', 'build')
                .addSubTarget('layer-test', 'layers/$(l)', 'test')
            ;
            if (withTerraformDocs) {
                t
                    .addTarget('layer-generate-docs', ['cd layers/$(l) && terraform-docs markdown . > README.md && cd ..'], ['install-root'])
                    .addTarget('generate-docs-layers', ['$(foreach l,$(layers),cd layers/$(l) && terraform-docs markdown . > README.md && cd ..;)'], ['install-root'])
                ;
            }
        }
        if (withModules) {
            t
                .addGlobalVar('modules', '$(shell cd modules && ls -d */ 2>/dev/null)')
                .addGlobalVar('makeable_modules', '$(shell cd modules && ls -d */Makefile 2>/dev/null | sed s,/Makefile,,)')
                .addTarget('install-modules', ['$(foreach m,$(makeable_modules),make -C modules/$(m)/ install;)'], ['install-root'])
                .addTarget('build-modules', ['$(foreach m,$(makeable_modules),make -C modules/$(m)/ build;)'], ['install-root'])
                .addTarget('test-modules', ['$(foreach m,$(makeable_modules),make -C modules/$(m)/ test;)'], ['install-root'])
                .addSubTarget('module-install', 'module/$(m)', 'install')
                .addSubTarget('module-build', 'module/$(m)', 'build')
                .addSubTarget('module-test', 'module/$(m)', 'test')
            ;
            if (withTerraformDocs) {
                t
                    .addTarget('module-generate-docs', ['cd modules/$(m) && terraform-docs markdown . > README.md && cd ..'], ['install-root'])
                    .addTarget('generate-docs-modules', ['$(foreach m,$(modules),cd modules/$(l) && terraform-docs markdown . > README.md && cd ..;)'], ['install-root'])
                ;
            }
        }
        ('github' === scm) && t.addTarget('pr', ['hub pull-request -b $(b)']);
        return t;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
    protected getTechnologies(): any {
        return [
            'genjs',
            'make',
            'node',
            'es6',
            'yarn',
            'nvm',
            'npm',
            'markdown',
            'git',
            'jest',
            'prettier',
            'json',
            ...((this.vars.scm === 'github') ? ['github', 'github_actions', 'github_packages', 'npm_rc_github', 'hub', 'ssh_github'] : []),
            (this.vars.scm === 'gitlab') && 'gitlab',
            'terraform',
        ];
    }
}