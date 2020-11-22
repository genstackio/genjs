import {AbstractPackage} from '@genjs/genjs';
import {
    GitIgnoreTemplate,
    LicenseTemplate,
    MakefileTemplate,
    ReadmeTemplate,
    TerraformToVarsTemplate
} from '@genjs/genjs-templates';
import {BuildableBehaviour, InstallableBehaviour, DeployableBehaviour, GenerateEnvLocalableBehaviour, StartableBehaviour, ServableBehaviour, TestableBehaviour} from '@genjs/genjs-behaviours';

export default class Package extends AbstractPackage {
    protected getBehaviours() {
        return [
            new BuildableBehaviour(),
            new InstallableBehaviour(),
            new DeployableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new StartableBehaviour(),
            new ServableBehaviour(),
            new TestableBehaviour(),
        ]
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            project_prefix: 'mycompany',
            project_name: 'myproject',
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars)
            .addFragmentFromTemplate(`${__dirname}/../templates/readme/original.md.ejs`)
        ;
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addGroup('Logs', [
                'logs', '*.log', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*',
            ])
            .addGroup('Runtime data', [
                'pids', '*.pid', '*.seed', '*.pid.lock',
            ])
            .addGroup('Directory for instrumented libs generated by jscoverage/JSCover', [
                'lib-cov',
            ])
            .addGroup('Coverage directory used by tools like istanbul', [
                'coverage',
            ])
            .addGroup('nyc test coverage', [
                '.nyc_output',
            ])
            .addGroup('Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)', [
                '.grunt',
            ])
            .addGroup('Bower dependency directory (https://bower.io/)', [
                'bower_components',
            ])
            .addGroup('node-waf configuration', [
                '.lock-wscript',
            ])
            .addGroup('Compiled binary addons (http://nodejs.org/api/addons.html)', [
                'build/Release',
            ])
            .addGroup('Dependency directories', [
                'node_modules/', 'jspm_packages/',
            ])
            .addGroup('Typescript v1 declaration files', [
                'typings/',
            ])
            .addGroup('Optional npm cache directory', [
                '.npm',
            ])
            .addGroup('Optional eslint cache', [
                '.eslintcache',
            ])
            .addGroup('Optional REPL history', [
                '.node_repl_history',
            ])
            .addGroup("Output of 'npm pack'", [
                '*.tgz',
            ])
            .addGroup('dotenv environment variable files', [
                '.env*',
            ])
            .addGroup('gatsby files', [
                '.cache/', 'public',
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
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const t = new MakefileTemplate({makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-${vars.name}`)
            .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_${vars.name.toUpperCase()})`)
            .setDefaultTarget('install')
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build')
            .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'public/'})
            .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
            .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'GATSBY'})
            .addPredefinedTarget('start', 'yarn-start', {port: this.getParameter('startPort')})
            .addPredefinedTarget('serve', 'yarn-serve', {port: this.getParameter('servePort')})
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true, coverage: false})
        ;
        if (vars.publish_image) {
            t
                .addPredefinedTarget('build-publish-image', 'docker-build', {tag: vars.publish_image.tag, path: vars.publish_image.dir || '.', buildArgs: vars.publish_image.buildArgs || {}})
                .addPredefinedTarget('deploy-publish-image', 'docker-push', {...vars.publish_image})
                .addPredefinedTarget('build-code', 'yarn-build')
                .addMetaTarget('build', vars.publish_image.noPreBuildCode ? ['build-publish-image'] : ['build-code', 'build-publish-image'])
                .addMetaTarget('deploy', ['deploy-publish-image'])
                .addMetaTarget('deploy-raw', ['deploy-code', 'invalidate-cache'])
            ;
        }
        return t;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
    protected getPreRequisites(): any {
        return {
        };
    }
    protected getInstallProcedures(): any {
        return {
        };
    }
    protected getTechnologies(): any {
        return [
            'react_gatsby',
            'make',
            'aws_cli',
            'aws_cloudfront',
            'aws_s3',
            'aws_route53',
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
            this.vars.publish_image && 'docker',
        ];
    }
}