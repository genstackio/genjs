import {MakefileTemplate} from '@genjs/genjs';
import path from 'path';
import * as commonTargets from '@genjs/genjs/lib/targets';
import * as awsLambdaBundleTargets from '@genjs/genjs-bundle-aws-lambda/lib/targets';
import * as javascriptBundleTargets from '@genjs/genjs-bundle-javascript/lib/targets';
const expectRenderSameAsFile = (template: MakefileTemplate, file: string) => {
    expect(template.render()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../__fixtures__/templates/makefiles/${file}`), 'utf8').trim());
};

const predefinedTargets: {[key: string]: any} = {
    ...awsLambdaBundleTargets,
    ...javascriptBundleTargets,
    ...commonTargets,
}
describe('render', () => {
    it('sample api', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({options: {npmClient: 'yarn'}, predefinedTargets,})
                .addGlobalVar('env', 'dev')
                .setDefaultTarget('install')
                .addTarget('pre-install')
                .addPredefinedTarget('generate-env-local', 'generate-env-local')
                .addPredefinedTarget('build', 'js-build')
                .addPredefinedTarget('deploy', 'js-deploy')
                .addPredefinedTarget('install', 'js-install')
                .addPredefinedTarget('clean-modules', 'clean-node-modules')
                .addPredefinedTarget('clean-coverage')
                .addPredefinedTarget('test-ci', 'js-test', {ci: true})
                .addPredefinedTarget('test', 'js-test', {local: true, coverage: false})
                .addPredefinedTarget('test-cov', 'js-test', {local: true})
                .addMetaTarget('clean', ['clean-modules', 'clean-coverage'])
            ,
            'sample-api.mk'
        );
    })
})