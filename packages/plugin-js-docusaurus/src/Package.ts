import {JavascriptPackage} from '@genjs/genjs-bundle-javascript';
import {ServableBehaviour} from '@genjs/genjs';

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
    protected buildReadme(vars: any) {
        return super.buildReadme(vars)
            .addFragmentFromTemplate(`${__dirname}/../templates/readme/original.md.ejs`)
        ;
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addGroup('Logs', [
                'logs', '*.log', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*',
            ])
            .addGroup('Dependency directories', [
                'node_modules/',
            ])
            .addGroup('dotenv environment variable files', [
                '.env*',
            ])
            .addGroup('Docusaurus files', [
                '.docusaurus', '.cache-loader', '/build',
            ])
            .addGroup('Mac files', [
                '.DS_Store',
            ])
            .addGroup('IDE files', [
                '.idea',
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
        return super.buildMakefile(vars)
            .addGlobalVar('env', 'dev')
            .addPredefinedTarget('install', 'js-install')
            .addPredefinedTarget('build', 'js-build')
            .addPredefinedTarget('deploy', 'js-deploy')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'DOCUSAURUS', mode: vars.env_mode || 'terraform'})
            .addPredefinedTarget('start', 'js-start', {port: this.getParameter('startPort')})
            .addPredefinedTarget('serve', 'js-serve', {port: this.getParameter('servePort')})
            .addPredefinedTarget('test', 'js-test', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'js-test', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'js-test', {local: true})
            .addPredefinedTarget('test-ci', 'js-test', {ci: true, coverage: false})
        ;
    }
}