import {MakefileTemplate} from '@genjs/genjs';
import path from 'path';
import * as commonTargets from '@genjs/genjs/lib/targets';
import * as javascriptBundleTargets from '@genjs/genjs-bundle-javascript/lib/targets';
import * as awsBundleTargets from '@genjs/genjs-bundle-aws/lib/targets';
import * as dockerBundleTargets from '@genjs/genjs-bundle-docker/lib/targets';

const expectRenderSameAsFile = (template: MakefileTemplate, file: string) => {
    expect(template.render()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../__fixtures__/templates/makefiles/${file}`), 'utf8').trim());
};

const predefinedTargets = {...commonTargets, ...javascriptBundleTargets, ...awsBundleTargets, ...dockerBundleTargets};

describe('render', () => {
    it('sample front', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addGlobalVar('prefix', 'myprefix')
                .addGlobalVar('bucket_prefix', '$(prefix)-myproject')
                .addGlobalVar('env', 'dev')
                .addGlobalVar('AWS_PROFILE', '$(prefix)-$(env)')
                .addGlobalVar('bucket', '$(env)-$(bucket_prefix)-front')
                .addGlobalVar('cloudfront', '$(AWS_CLOUDFRONT_DISTRIBUTION_ID_FRONT)')
                .setDefaultTarget('install')
                .addTarget('pre-install')
                .addPredefinedTarget('install', 'yarn-install')
                .addPredefinedTarget('build', 'yarn-build')
                .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'public/'})
                .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
                .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
                .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'GATSBY', mode: 'terraform'})
                .addPredefinedTarget('start', 'yarn-start')
                .addPredefinedTarget('serve', 'yarn-serve')
                .addPredefinedTarget('test', 'yarn-test-jest', {coverage: true})
                .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            ,
            'sample-front.mk'
        );
    })
    it('sample front with publish image', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addGlobalVar('prefix', 'myprefix')
                .addGlobalVar('bucket_prefix', '$(prefix)-myproject')
                .addGlobalVar('env', 'dev')
                .addGlobalVar('AWS_PROFILE', '$(prefix)-$(env)')
                .addGlobalVar('bucket', '$(env)-$(bucket_prefix)-front')
                .addGlobalVar('cloudfront', '$(AWS_CLOUDFRONT_DISTRIBUTION_ID_FRONT)')
                .setDefaultTarget('install')
                .addTarget('pre-install')
                .addPredefinedTarget('install', 'yarn-install')
                .addPredefinedTarget('build', 'yarn-build')
                .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'public/'})
                .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
                .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
                .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'GATSBY', mode: 'terraform'})
                .addPredefinedTarget('start', 'yarn-start')
                .addPredefinedTarget('serve', 'yarn-serve')
                .addPredefinedTarget('test', 'yarn-test-jest', {coverage: true})
                .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
                .addPredefinedTarget('build-publish-image', 'docker-build', {tag: 'mytag', path: '.', buildArgs: {arg1: 'value1', arg2: 'value2'}})
                .addPredefinedTarget('deploy-publish-image', 'docker-push', {awsEcrLogin: true, awsProfile: true, awsEcrLogout: true, tag: '012345678912.dkr.ecr.eu-west-3.amazonaws.com/abcd:latest'})
                .addPredefinedTarget('build-code', 'yarn-build')
                .addMetaTarget('build', ['build-code', 'build-publish-image'])
                .addMetaTarget('deploy', ['deploy-publish-image'])
                .addMetaTarget('deploy-raw', ['deploy-code', 'invalidate-cache'])
            ,
            'sample-front-with-publish-image.mk'
        );
    })
})