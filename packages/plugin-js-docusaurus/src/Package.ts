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
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build')
            .addPredefinedTarget('deploy', 'yarn-deploy')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'DOCUSAURUS'})
            .addPredefinedTarget('start', 'yarn-start', {port: this.getParameter('startPort')})
            .addPredefinedTarget('serve', 'yarn-serve', {port: this.getParameter('servePort')})
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true, coverage: false})
        ;
    }
}