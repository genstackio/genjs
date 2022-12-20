import {AwsLambdaPackage} from '@genjs/genjs-bundle-aws-lambda';
import {applyRefreshMakefileHelper} from "@genjs/genjs-bundle-package";

export default class Package extends AwsLambdaPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            project_prefix: 'mycompany',
            project_name: 'myproject',
            dependencies: {
                "apollo-server-lambda": "2.15.0",
                "graphql": "15.2.0"
            },
            devDependencies: {
                "@types/node": "14.0.14",
                "@typescript-eslint/eslint-plugin": "2.30.0",
                "@typescript-eslint/parser": "2.30.0",
                "eslint": "6.8.0",
                "eslint-config-airbnb-base": "14.1.0",
                "eslint-import-resolver-alias": "1.1.2",
                "eslint-plugin-import": "2.20.2",
                "eslint-plugin-module-resolver": "0.16.0",
                "typescript": "3.9.5",
                "typescript-eslint": "0.0.1-alpha.0"
            },
            scripts: {
                lint: "eslint . --ext .js",
                build: "tsc",
                test: "echo \"Error: no test specified\" && exit 0"
            }
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any) {
        return {
            ...super.buildFilesFromTemplates(vars, cfg),
            ['.eslintignore']: true,
            ['.eslintrc.js']: true,
            ['tsconfig.json']: true,
        };
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addComment('See https://help.github.com/articles/ignoring-files/ for more about ignoring files.')
            .addGroup('dependencies', [
                '/node_modules', '/.pnp', '.pnp.js',
            ])
            .addGroup('testing', [
                '/coverage',
            ])
            .addGroup('production', [
                '/build',
            ])
            .addGroup('misc', [
                '.DS_Store',
                '.env.local', '.env.development.local', '.env.test.local', '.env.production.local',
                'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', '/dist'
            ])
        ;
    }
    protected buildMakefile(vars: any) {
        const t = super.buildMakefile(vars)
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
            .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-${vars.name}`)
            .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_${vars.name.toUpperCase()})`)
            .addTarget('pre-install')
            .addPredefinedTarget('install', 'js-install')
            .addPredefinedTarget('build', 'js-build')
            .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'build/', cacheControl: vars.s3_cache_control})
            .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
            .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'STATICS', mode: vars.env_mode || 'terraform'})
            .addPredefinedTarget('start', 'js-start')
            .addPredefinedTarget('test', 'js-test', {ci: true, coverage: true})
            .addPredefinedTarget('test-dev', 'js-test', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'js-test', {local: true})
            .addPredefinedTarget('test-ci', 'js-test', {ci: true})
        ;

        applyRefreshMakefileHelper(t, vars, this);

        return t;
    }
}