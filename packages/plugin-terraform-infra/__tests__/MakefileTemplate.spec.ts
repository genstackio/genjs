import {MakefileTemplate} from '@genjs/genjs';
import path from 'path';
import * as commonTargets from '@genjs/genjs/lib/targets';
import * as terraformBundleTargets from '@genjs/genjs-bundle-terraform/lib/targets';
import * as javascriptBundleTargets from '@genjs/genjs-bundle-javascript/lib/targets';

const expectRenderSameAsFile = (template: MakefileTemplate, file: string) => {
    expect(template.render()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../__fixtures__/templates/makefiles/${file}`), 'utf8').trim());
};

const predefinedTargets = {...commonTargets, ...terraformBundleTargets, ...javascriptBundleTargets};

describe('render', () => {
    it('sample infra', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addGlobalVar('prefix', 'myprefix')
                .addGlobalVar('env', 'dev')
                .addGlobalVar('layer', '"all"')
                .addGlobalVar('layers', '$(shell AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) list-layers)')
                .addGlobalVar('AWS_PROFILE', '$(prefix)-$(env)')
                .addTarget('all')
                .addTarget('pre-install')
                .addPredefinedTarget('apply', 'tflayer-apply')
                .addPredefinedTarget('destroy', 'tflayer-destroy')
                .addPredefinedTarget('get', 'tflayer-get')
                .addPredefinedTarget('init', 'tflayer-init')
                .addPredefinedTarget('init-full', 'tflayer-init-full')
                .addPredefinedTarget('init-full-upgrade', 'tflayer-init-full-upgrade')
                .addPredefinedTarget('init-upgrade', 'tflayer-init-upgrade')
                .addPredefinedTarget('list-layers', 'tflayer-list-layers')
                .addPredefinedTarget('plan', 'tflayer-plan')
                .addPredefinedTarget('refresh', 'tflayer-refresh')
                .addPredefinedTarget('sync', 'tflayer-sync')
                .addPredefinedTarget('sync-full', 'tflayer-sync-full')
                .addPredefinedTarget('update', 'tflayer-update')
                .addPredefinedTarget('generate', 'tfgen')
                .addPredefinedTarget('output', 'tflayer-output')
                .addPredefinedTarget('output-json', 'tflayer-output-json')
                .addPredefinedTarget('outputs', 'outputs')
                .addMetaTarget('provision', ['init', 'sync'])
                .addMetaTarget('provision-full', ['init-full', 'sync-full'])
            ,
            'sample-infra.mk'
        );
    })
})