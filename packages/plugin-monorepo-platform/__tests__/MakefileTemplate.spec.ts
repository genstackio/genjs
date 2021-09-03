import {MakefileTemplate} from '@genjs/genjs';
import path from 'path';
import * as commonTargets from '@genjs/genjs/lib/targets';
import * as terraformBundleTargets from '@genjs/genjs-bundle-terraform/lib/targets';
import * as javascriptBundleTargets from '@genjs/genjs-bundle-javascript/lib/targets';

const expectRenderSameAsFile = (template: MakefileTemplate, file: string) => {
    expect(template.render()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../__fixtures__/templates/makefiles/${file}`), 'utf8').trim());
};

const predefinedTargets = {...commonTargets, ...javascriptBundleTargets, ...terraformBundleTargets};

describe('render', () => {
    it('sample platform', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({options: {npmClient: 'yarn'}, predefinedTargets})
                .addGlobalVar('env', 'dev')
                .addGlobalVar('b', 'develop')
                .addPredefinedTarget('generate', 'js-genjs')
                .addPredefinedTarget('install-root', 'js-install')
                .addPredefinedTarget('install-terraform', 'tfenv-install')
                .addMetaTarget('pre-install-root', ['install-root'])
                .addTarget('pre-install-git')
                .addTarget('install-git')
                .addTarget('test-git')
                .addMetaTarget('deploy', ['deploy-front', 'deploy-app'])
                .addMetaTarget('build', ['build-pre-provision', 'build-post-provision'])
                .addMetaTarget('build-pre-plan', ['build-api'])
                .addMetaTarget('build-pre-provision', ['build-pre-plan'])
                .addMetaTarget('build-post-provision', ['build-front', 'build-app'])
                .addMetaTarget('test', ['test-git', 'test-front', 'test-app', 'test-api'])
                .addSubTarget('provision', 'infra', 'provision', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('provision-full', 'infra', 'provision-full', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-init', 'infra', 'init', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-plan', 'infra', 'plan', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-refresh', 'infra', 'refresh', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-update', 'infra', 'update', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('list-layers', 'infra', 'list-layers', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-init-full', 'infra', 'init-full', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-init-full-upgrade', 'infra', 'init-full-upgrade', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-destroy', 'infra', 'destroy', {env: '$(env)', layer: '$(layer)'}, ['generate-terraform'])
                .addSubTarget('output', 'infra', 'output', {env: '$(env)', layer: '$(layer)'}, ['generate-terraform'])
                .addSubTarget('output-json', 'infra', 'output-json', {env: '$(env)', layer: '$(layer)'}, ['generate-terraform'])
                .addSubTarget('outputs', 'infra', 'outputs', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('refresh-api', 'infra', 'provision', {env: '$(env)', layer: 'api'}, ['generate-terraform', 'build-api'])
                .addSubTarget('infra-init-upgrade', 'infra', 'init-upgrade', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('pre-install-api', 'api', 'pre-install')
                .addSubTarget('pre-install-app', 'app', 'pre-install')
                .addSubTarget('pre-install-front', 'front', 'pre-install')
                .addSubTarget('install-api', 'api', 'install')
                .addSubTarget('install-app', 'app', 'install')
                .addSubTarget('install-front', 'front', 'install')
                .addSubTarget('deploy-app', 'app', 'deploy', {env: '$(env)'}, ['generate-env-local-app'], {sourceEnvLocal: true})
                .addSubTarget('deploy-front', 'front', 'deploy', {env: '$(env)'}, ['generate-env-local-front'], {sourceEnvLocal: true})
                .addSubTarget('build-api', 'api', 'build', {env: '$(env)'}, ['generate-env-local-api'])
                .addSubTarget('build-front', 'front', 'build', {env: '$(env)'}, ['generate-env-local-front'])
                .addSubTarget('build-app', 'app', 'build', {env: '$(env)'}, ['generate-env-local-app'])
                .addSubTarget('test-api', 'api', 'test')
                .addSubTarget('test-app', 'app', 'test')
                .addSubTarget('test-front', 'front', 'test')
                .addSubTarget('start-front', 'front', 'start', {env: '$(env)'})
                .addSubTarget('start-app', 'app', 'start', {env: '$(env)'})
                .addSubTarget('generate-terraform', 'infra', 'generate')
                .addSubTarget('generate-env-local-front', 'front', 'generate-env-local', {env: '$(env)'})
                .addSubTarget('generate-env-local-api', 'api', 'generate-env-local', {env: '$(env)'})
                .addSubTarget('generate-env-local-app', 'app', 'generate-env-local', {env: '$(env)'})
                .addMetaTarget('generate-env-local', ['generate-env-local-front', 'generate-env-local-app', 'generate-env-local-api'])
                .addMetaTarget('pre-install', ['pre-install-root', 'pre-install-git', 'pre-install-front', 'pre-install-app', 'pre-install-api'])
                .addMetaTarget('install', ['install-root', 'install-git', 'install-front', 'install-app', 'install-api'])
                .addMetaTarget('start', ['start-front'])
                .setDefaultTarget('install')
            ,
            'sample-platform.mk'
        );
    })
})