import {JavascriptPackage} from '@genjs/genjs-bundle-javascript';

export default class Package extends JavascriptPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            project_prefix: 'mycompany',
            project_name: 'myproject',
            target_dir: 'build',
            ignore_target_dir: true,
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildDynamicFiles({licenseFile: 'LICENSE.md', ...vars}, cfg)),
        };
    }
    protected buildGitIgnore(vars: any) {
        const t = super.buildGitIgnore(vars)
            .addGroup('dependencies', [
                '/node_modules', '/.pnp', '.pnp.js',
            ])
            .addGroup('testing', [
                '/coverage',
            ])
            .addGroup('misc', [
                '.DS_Store',
                '.env.local', '.env.development.local', '.env.test.local', '.env.production.local',
                'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*'
            ])
        ;
        if (vars.ignore_target_dir) {
            t
                .addGroup('production', [
                    `/${vars.target_dir}`,
                ])
        }
        return t;
    }
    protected buildMakefile(vars: any) {
        return super.buildMakefile(vars)
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-${vars.name}`)
            .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_${vars.name.toUpperCase().replace(/[^A-Z0-9_]+/g, '_')})`)
            .addPredefinedTarget('install', 'js-install')
            .addPredefinedTarget('build', 'js-build', {ci: (!!vars.hide_ci) ? 'hidden' : undefined, sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
            .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'build/'})
            .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
            .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'STATICS_APP', mode: vars.env_mode || 'terraform'})
            .addPredefinedTarget('start', 'js-start', {port: this.getParameter('startPort'), sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
            .addPredefinedTarget('test', 'js-test', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'js-test', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'js-test', {local: true})
            .addPredefinedTarget('test-ci', 'js-test', {ci: true, coverage: false})
            ;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'aws_cli',
            'aws_cloudfront',
            'aws_s3',
            'aws_route53',
        ];
    }
}