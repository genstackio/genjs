import {JavascriptPackage} from '@genjs/genjs-bundle-javascript';
import {ServableBehaviour} from "@genjs/genjs";
import {applyRefreshMakefileHelper} from "@genjs/genjs-bundle-package/lib/helpers/applyRefreshMakefileHelper";

export default class Package extends JavascriptPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    protected getBehaviours() {
        return [
            ...super.getBehaviours(),
            new ServableBehaviour(),
        ]
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            project_prefix: 'mycompany',
            project_name: 'myproject',
        };
    }
    protected buildReadme(vars: any) {
        return super.buildReadme(vars)
            .addFragmentFromTemplate(`${__dirname}/../templates/readme/original.md.ejs`)
        ;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildDynamicFiles({licenseFile: 'LICENSE.md', ...vars}, cfg)),
        };
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
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
    protected buildMakefile(vars: any) {
        const t = super.buildMakefile(vars)
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-${vars.name}`)
            .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_${vars.name.toUpperCase().replace(/[^A-Z0-9_]+/g, '_')})`)
            .addPredefinedTarget('install', 'js-install')
            .addPredefinedTarget('build', 'js-build', {ci: (!!vars.hide_ci) ? 'hidden' : undefined, sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
            .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'public/'})
            .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
            .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'GATSBY', mode: vars.env_mode || 'terraform'})
            .addPredefinedTarget('start', 'js-start', {port: this.getParameter('startPort'), sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
            .addPredefinedTarget('serve', 'js-serve', {port: this.getParameter('servePort')})
            .addPredefinedTarget('test', 'js-test', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'js-test', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'js-test', {local: true})
            .addPredefinedTarget('test-ci', 'js-test', {ci: true, coverage: false})
        ;

        applyRefreshMakefileHelper(t, vars, this);

        if (vars.publish_image) {
            t
                .addPredefinedTarget('build-publish-image', 'docker-build', {tag: vars.publish_image.tag, path: vars.publish_image.dir || '.', buildArgs: vars.publish_image.buildArgs || {}})
                .addPredefinedTarget('deploy-publish-image', 'docker-push', {...vars.publish_image})
                .addPredefinedTarget('build-code', 'js-build', {sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
                .addMetaTarget('build', vars.publish_image.noPreBuildCode ? ['build-publish-image'] : ['build-code', 'build-publish-image'])
                .addMetaTarget('deploy', ['deploy-publish-image'])
                .addMetaTarget('deploy-raw', ['deploy-code', 'invalidate-cache'])
            ;
        }

        return t;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'react_gatsby',
            'aws_cli',
            'aws_cloudfront',
            'aws_s3',
            'aws_route53',
            'json',
            this.vars.publish_image && 'docker',
        ];
    }
}