import {
    AbstractPackage,
    GitIgnoreTemplate,
    LicenseTemplate,
    MakefileTemplate,
    ReadmeTemplate,
    CodeOfConductTemplate,
    ContributingTemplate,
    NvmRcTemplate,
    TerraformToVarsTemplate,
} from '@genjs/genjs';
import {applyScmMakefileHelper} from "@genjs/genjs-bundle-scm";

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            project_prefix: 'mycompany',
            project_name: 'myproject',
            project_git_url: '<your-git-url-here>',
            node_version: '14.4.0',
            project_copyright: 'Copyright (c) 2020 Mycompany',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        const files = {
            ['jest.config.js']: true,
            ['lerna.json']: true,
            ['tsconfig.json']: true,
            ['tslint.json']: true,
        }
        vars.generator_package && Object.assign(files, {
            ['packages/generator-package/__tests__/index.spec.ts']: true,
            ['packages/generator-package/src/index.ts']: true,
            ['packages/generator-package/templates/__tests__/index.spec.tsx']: true,
            ['packages/generator-package/templates/_tpls/index.stories.tsx']: true,
            ['packages/generator-package/templates/_tpls/MainComponent.tsx']: true,
            ['packages/generator-package/templates/src/index.ts']: true,
            ['packages/generator-package/templates/LICENSE.md']: true,
            ['packages/generator-package/templates/package.json.remove_ext']: true,
            ['packages/generator-package/templates/README.md']: true,
            ['packages/generator-package/templates/tsconfig.json']: true,
            ['packages/generator-package/LICENSE.md']: true,
            ['packages/generator-package/package.json']: true,
            ['packages/generator-package/README.md']: true,
            ['packages/generator-package/tsconfig.json']: true,
            ['.storybook/main.js']: true,
        });
        return files;
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: new LicenseTemplate(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['CODE_OF_CONDUCT.md']: new CodeOfConductTemplate(vars),
            ['CONTRIBUTING.md']: new ContributingTemplate(vars),
            ...(vars.node_version ? {['.nvmrc']: new NvmRcTemplate(vars)} : {}),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
        };
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        const map = {
            full: [
                'introduction',
                'executive-summary',
                'requirements',
                'get-the-project',
                'installation',
                'running-components-locally',
                'development',
            ],
            basic: [
                'introduction',
                'executive-summary',
                'requirements',
                'get-the-project',
                'installation',
                'development',
            ]
        };
        const defaultTemplate = 'full';
        const kk = (vars.readme || {}).template || defaultTemplate;
        const kkk = map[kk] ? kk : defaultTemplate;
        return new ReadmeTemplate(vars).addNamedFragmentsFromTemplateDir(
            `${__dirname}/../templates/readme/${kkk}`,
            map[kkk]
        );
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return GitIgnoreTemplate.create(vars)
            .addIgnore('.idea/')
            .addIgnore('node_modules/')
            .addIgnore('lerna-debug.log')
            .addIgnore('npm-debug.log')
            .addIgnore('/packages/*/lib/')
            .addIgnore('/packages/*/*/lib/')
            .addIgnore('coverage/')
            .addIgnore('*.log')
            .addIgnore('*.tsbuildinfo')
            .addIgnore('/packages/*/public/')
            .addIgnore('.DS_Store')
            .addIgnore('public/')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const scm = vars.scm || 'git';
        const m = {options: {npmClient: vars.npm_client}, predefinedTargets: this.predefinedTargets, relativeToRoot: this.relativeToRoot, makefile: false !== vars.makefile, ...(vars.makefile || {})};
        const t = new MakefileTemplate(m)
            .addPredefinedTarget('install-root', 'js-install')
            .addPredefinedTarget('install-packages', 'js-lerna-bootstrap')
            .addPredefinedTarget('build', 'js-lerna-run-build')
            .addPredefinedTarget('package-build', 'js-build', {dir: 'packages/$(p)'})
            .addPredefinedTarget('package-test', 'js-test', {dir: 'packages/$(p)', local: true, coverage: true}, [], ['package-build'])
            .addPredefinedTarget('test-only', 'js-test', {local: true, parallel: false, coverage: true})
            .addPredefinedTarget('test-local', 'js-test', {local: true, coverage: true})
            .addPredefinedTarget('package-clear-test', 'js-test-clear-cache', {dir: 'packages/$(p)'})
            .addPredefinedTarget('package-install', 'js-lerna-bootstrap', {scope: `@${vars.npm_scope}/$(p)`})
            .addPredefinedTarget('changed', 'js-lerna-changed')
            .addPredefinedTarget('publish', 'js-lerna-publish')
            .addPredefinedTarget('clean-buildinfo', 'clean-ts-build-info', {on: 'packages'})
            .addPredefinedTarget('clean-coverage', 'clean-coverage', {on: 'packages'})
            .addPredefinedTarget('clean-lib', 'clean-lib', {on: 'packages'})
            .addPredefinedTarget('clean-modules', 'clean-node-modules', {on: 'packages'})
            .addMetaTarget('test', ['build', 'test-only'])
            .addMetaTarget('install', ['install-root', 'install-packages', 'build'])
            .addMetaTarget('clean', ['clean-lib', 'clean-modules', 'clean-coverage', 'clean-buildinfo'])
            .setDefaultTarget('install')
            .addExportedVar('CI')
            .addExportedVar('FORCE_COLOR')
        ;
        if (vars.storybooks) {
            t
                .addPredefinedTarget('package-build-storybook', 'js-build-storybook', {dir: 'packages/$(p)'})
                .addPredefinedTarget('package-storybook', 'js-story', {dir: 'packages/$(p)'})
            ;
        }
        if (vars.svg_components) {
            t
                .addPredefinedTarget('package-generate-svg-components', 'js-generate-svg-components', {dir: 'packages/$(p)'})
            ;
        }
        if (vars.generator_package) {
            t
                .addPredefinedTarget('new', 'js-script', {script: 'yo ./packages/generator-package 2>/dev/null'})
            ;
        }
        if (m.deployable_storybooks) {
            t
                .addPredefinedTarget('deploy-storybooks', 'js-deploy-storybooks')
                .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')

                .addGlobalVar('prefix', vars.project_prefix)
                .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
                .addGlobalVar('env', 'dev')
                .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
                .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-storybook`)
                .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_STORYBOOK)`)
                .addMetaTarget('deploy', ['deploy-storybooks', 'invalidate-cache'])
            ;
        }
        if (m.generate_target) {
            t
                .addPredefinedTarget('generate', 'js-genjs')
            ;
        }

        applyScmMakefileHelper(t, vars, this);

        if ('github' === scm) {
            t
                .addGlobalVar('b', vars.default_branch ? vars.default_branch : 'master')
            ;
        }
        return t;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
}