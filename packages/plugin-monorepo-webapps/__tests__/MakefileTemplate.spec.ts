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
            new MakefileTemplate({predefinedTargets})
                .addGlobalVar('env', 'dev')
                .addGlobalVar('b', 'develop')
                .addPredefinedTarget('generate', 'yarn-genjs')
                .addPredefinedTarget('install-root', 'yarn-install')
                .addMetaTarget('pre-install-root', ['install-root'])
                .addTarget('pre-install-git')
                .addTarget('install-git')
                .addTarget('test-git')
                .addMetaTarget('deploy', ['deploy-front', 'deploy-app'])
                .addMetaTarget('build', ['build-front', 'build-app'])
                .addMetaTarget('test', ['test-git', 'test-front', 'test-app'])
                .addSubTarget('pre-install-app', 'app', 'pre-install')
                .addSubTarget('pre-install-front', 'front', 'pre-install')
                .addSubTarget('install-app', 'app', 'install')
                .addSubTarget('install-front', 'front', 'install')
                .addSubTarget('deploy-app', 'app', 'deploy', {env: '$(env)'}, ['generate-env-local-app'], {sourceEnvLocal: true})
                .addSubTarget('deploy-front', 'front', 'deploy', {env: '$(env)'}, ['generate-env-local-front'], {sourceEnvLocal: true})
                .addSubTarget('build-front', 'front', 'build', {env: '$(env)'}, ['generate-env-local-front'])
                .addSubTarget('build-app', 'app', 'build', {env: '$(env)'}, ['generate-env-local-app'])
                .addSubTarget('test-app', 'app', 'test')
                .addSubTarget('test-front', 'front', 'test')
                .addSubTarget('start-front', 'front', 'start', {env: '$(env)'})
                .addSubTarget('start-app', 'app', 'start', {env: '$(env)'})
                .addMetaTarget('pre-install', ['pre-install-root', 'pre-install-git', 'pre-install-front', 'pre-install-app'])
                .addMetaTarget('install', ['install-root', 'install-git', 'install-front', 'install-app'])
                .addMetaTarget('start', ['start-front'])
                .setDefaultTarget('install')
            ,
            'sample-platform.mk'
        );
    })
})