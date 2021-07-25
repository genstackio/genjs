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
            'public/favicon.ico?': true,
            'public/logo192.png?': true,
            'public/logo512.png?': true,
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildDynamicFiles({licenseFile: 'LICENSE.md', ...vars}, cfg)),
            ['package.json?']: () => JSON.stringify({
                name: vars.name,
                license: vars.license,
                dependencies: vars.dependencies,
                scripts: vars.scripts,
                devDependencies: vars.devDependencies,
                version: vars.version,
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
            'craco.config.js?': true,
            'tsconfig.json?': true,
            'tailwind.config.js?': true,
            'public/index.html?': true,
            'public/manifest.json?': true,
            'public/robots.txt?': true,
            ...Object.entries(vars.project_envs || {}).reduce((acc, [k, v]) => {
                acc[`env/${k}.env`] = ['env/env.env.ejs', {project_env: v}];
                return acc;
            }, {}),
            'src/App.test.tsx?': true,
            'src/App.tsx': true,
            'src/index.tsx': true,
            'src/react-app-env.d.ts': true,
            'src/reportWebVitals.js': true,
            'src/setupTests.ts': true,
            'src/configs/app.ts?': true,
            'src/configs/icons.ts?': true,
            'src/configs/index.ts?': true,
            'src/configs/logos.ts?': true,
            'src/configs/queries.ts?': true,
            'src/configs/routes.ts?': true,
            'src/configs/theme.ts?': true,
            'src/configs/translations.ts?': true,
            'src/layouts/AppLayout.tsx?': true,
            'src/screens/HomeScreen.tsx?': true,
            'src/screens/LoginScreen.tsx?': true,
            'src/screens/NotFoundScreen.tsx?': true,
            'src/templates/DisplayScreenTemplate.tsx?': true,
            'src/templates/ListScreenTemplate.tsx?': true,
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
                'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*',
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
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build', {ci: (!!vars.hide_ci) ? 'hidden' : undefined, sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
            .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'build/'})
            .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
            .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'REACT_APP', mode: vars.env_mode || 'terraform'})
            .addPredefinedTarget('start', 'yarn-start', {port: this.getParameter('startPort'), sourceLocalEnvLocal: vars.sourceLocalEnvLocal})
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true, coverage: false})
            ;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'react_cra',
            'aws_cli',
            'aws_cloudfront',
            'aws_s3',
            'aws_route53',
            this.vars.publish_image && 'docker',
        ];
    }
}