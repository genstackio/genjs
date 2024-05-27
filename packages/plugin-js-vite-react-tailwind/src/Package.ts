import {JavascriptPackage} from '@genjs/genjs-bundle-javascript';

export default class Package extends JavascriptPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            project_prefix: 'mycompany',
            project_name: 'myproject',
        };
    }
    protected buildVars(vars: any): any {
        const staticVars = require('../vars.json');
        vars = {...staticVars, ...super.buildVars(vars)};
        vars.scripts = {
            ...staticVars.scripts,
            ...(vars.scripts || {}),
        };
        vars.dependencies = {
            ...staticVars.dependencies,
            ...(vars.dependencies || {}),
        };
        vars.devDependencies = {
            ...staticVars.devDependencies,
            ...(vars.devDependencies || {}),
        };
        return vars;
    }
    protected buildReadme(vars: any) {
        return super.buildReadme(vars)
            .addFragmentFromTemplate(`${__dirname}/../templates/readme/original.md.ejs`)
            ;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildStaticFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildStaticFiles(vars, cfg)),
            'public/favicon.svg?': true,
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildDynamicFiles({licenseFile: 'LICENSE.md', ...vars}, cfg)),
            ['package.json?']: () => JSON.stringify({
                name: vars.name,
                type: 'module',
                version: vars.version,
                license: vars.license,
                scripts: vars.scripts,
                devDependencies: vars.devDependencies,
                dependencies: vars.dependencies,
                description: vars.description,
                author: (vars.author && ('object' === typeof vars.author)) ? vars.author : {name: vars.author_name, email: vars.author_email},
                private: true,
                ...(vars.raw_package_json ? vars.raw_package_json : {}),
            }, null, 4),
        };
    }
    protected async buildFilesFromTemplates(vars: any, cfg: any) {
        return {
            ...(await super.buildFilesFromTemplates(vars, cfg)),
            'tsconfig.json?': true,
            'tsconfig.node.json?': true,
            'vite.config.ts?': true,
            'tailwind.config.cjs?': true,
            'postcss.config.js?': true,
            'index.html?': true,
            '.eslintrc.cjs?': true,
            'public/manifest.json?': true,
            'public/robots.txt?': true,
            'src/App.css?': true,
            'src/App.tsx?': true,
            'src/index.css?': true,
            'src/main.tsx?': true,
            'src/vite-env.d.ts?': true,
            ...Object.entries(vars.project_envs || {}).reduce((acc, [k, v]) => {
                acc[`env/${k}.env?`] = ['env/env.env.ejs', {project_env: v}];
                return acc;
            }, {}),
        };
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addGroup('build output', [
                '/dist/',
                '/dist-ssr/',
            ])
            .addGroup('dependencies', [
                '/node_modules/',
            ])
            .addGroup('testing', [
                '/coverage',
            ])
            .addGroup('misc', [
                '.DS_Store', '/.idea/', '/.vscode/',
                '.env.local', '.env.development.local', '.env.test.local', '.env.production.local',
                'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', 'pnpm-debug.log*', '/src/index.generated.css'
            ])
        ;
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
            .addPredefinedTarget('build', 'js-build', {force_npm_run: true, ci: (!!vars.hide_ci) ? 'hidden' : undefined, sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
            .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'dist/', cacheControl: vars.s3_cache_control})
            .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
            .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'PUBLIC', mode: vars.env_mode || 'terraform'})
            .addPredefinedTarget('start', 'js-start', {port: this.getParameter('startPort'), sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
            .addPredefinedTarget('test', 'js-test', {force_npm_run: true, ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'js-test', {force_npm_run: true, local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'js-test', {force_npm_run: true, local: true})
            .addPredefinedTarget('test-ci', 'js-test', {force_npm_run: true, ci: true, coverage: false})
        ;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            // 'vite',
            'tailwindcss',
            'aws_cli',
            'aws_cloudfront',
            'aws_s3',
            'aws_route53',
            this.vars.publish_image && 'docker',
        ];
    }
}