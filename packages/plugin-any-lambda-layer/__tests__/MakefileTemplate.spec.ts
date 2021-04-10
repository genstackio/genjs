import {MakefileTemplate} from '@genjs/genjs';
import path from 'path';
import * as commonTargets from '@genjs/genjs/lib/targets';
import * as awsLambdaLayerBundleTargets from '@genjs/genjs-bundle-aws-lambda-layer/lib/targets';

const expectRenderSameAsFile = (template: MakefileTemplate, file: string) => {
    expect(template.render()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../__fixtures__/templates/makefiles/${file}`), 'utf8').trim());
};

const predefinedTargets = {...commonTargets, ...awsLambdaLayerBundleTargets};

describe('render', () => {
    it('sample custom lambda layer', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addGlobalVar('env', 'dev')
                .setDefaultTarget('install')
                .addTarget('pre-install')
                .addTarget('install-test')
                .addTarget('test')
                .addTarget('test-cov')
                .addTarget('test-ci')
                .addShellTarget('install', './bin/install')
                .addShellTarget('clean', './bin/clean')
                .addShellTarget('build', './bin/build', ['clean'])
                .addTarget('deploy')
            ,
            'sample-custom-lambda-layer.mk'
        );
    })
})