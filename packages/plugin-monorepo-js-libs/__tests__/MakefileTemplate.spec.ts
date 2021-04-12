import {MakefileTemplate} from '@genjs/genjs';
import path from 'path';
import * as commonTargets from '@genjs/genjs/lib/targets';
import * as javascriptBundleTargets from '@genjs/genjs-bundle-javascript/lib/targets';
import * as typescriptBundleTargets from '@genjs/genjs-bundle-typescript/lib/targets';
import * as awsBundleTargets from '@genjs/genjs-bundle-aws/lib/targets';

const expectRenderSameAsFile = (template: MakefileTemplate, file: string) => {
    expect(template.render()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../__fixtures__/templates/makefiles/${file}`), 'utf8').trim());
};

const predefinedTargets = {...commonTargets, ...javascriptBundleTargets, ...typescriptBundleTargets, ...awsBundleTargets};

describe('render', () => {
    it('sample packages', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addTarget('fixture-gen', ['cd packages/$(p) && yarn --silent gen -c __fixtures__/$(f).js -t ../../generated/$(f)'])
                .addPredefinedTarget('install-root', 'yarn-install')
                .addPredefinedTarget('install-packages', 'yarn-lerna-bootstrap')
                .addPredefinedTarget('build', 'yarn-lerna-run-build')
                .addPredefinedTarget('package-build', 'yarn-build', {dir: 'packages/$(p)'})
                .addPredefinedTarget('package-test', 'yarn-test-jest', {dir: 'packages/$(p)', local: true, coverage: true}, [], ['package-build'])
                .addPredefinedTarget('test-only', 'yarn-test-jest', {local: true, parallel: false, coverage: true})
                .addPredefinedTarget('test-local', 'yarn-test-jest', {local: true, coverage: true})
                .addPredefinedTarget('package-clear-test', 'yarn-jest-clear-cache', {dir: 'packages/$(p)'})
                .addPredefinedTarget('package-install', 'yarn-lerna-bootstrap', {scope: '@ohoareau/$(p)'})
                .addPredefinedTarget('changed', 'yarn-lerna-changed')
                .addPredefinedTarget('publish', 'yarn-lerna-publish')
                .addPredefinedTarget('clean-buildinfo', 'clean-ts-build-info', {on: 'packages'})
                .addPredefinedTarget('clean-coverage', 'clean-coverage', {on: 'packages'})
                .addPredefinedTarget('clean-lib', 'clean-lib', {on: 'packages'})
                .addPredefinedTarget('clean-modules', 'clean-node-modules', {on: 'packages'})
                .addMetaTarget('test', ['build', 'test-only'])
                .addMetaTarget('install', ['install-root', 'install-packages', 'build'])
                .addMetaTarget('clean', ['clean-lib', 'clean-modules', 'clean-coverage', 'clean-buildinfo'])
                .setDefaultTarget('install')
            ,
            'sample-packages.mk'
        );
    })
    it('sample libs-js', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addGlobalVar('prefix',  'myprefix')
                .addGlobalVar('bucket_prefix', '$(prefix)-myproject')
                .addGlobalVar('env', 'dev')
                .addGlobalVar('AWS_PROFILE', '$(prefix)-$(env)')
                .addGlobalVar('bucket', '$(env)-$(bucket_prefix)-storybook')
                .addGlobalVar('cloudfront', '$(AWS_CLOUDFRONT_DISTRIBUTION_ID_STORYBOOK)')
                .addMetaTarget('deploy', ['deploy-storybooks', 'invalidate-cache'])
                .addTarget('new', ['yarn --silent yo ./packages/generator-package 2>/dev/null'])
                .addPredefinedTarget('generate', 'yarn-genjs')
                .addPredefinedTarget('deploy-storybooks', 'yarn-deploy-storybooks')
                .addPredefinedTarget('package-build-storybook', 'yarn-build-storybook', {dir: 'packages/$(p)'})
                .addPredefinedTarget('package-generate-svg-components', 'yarn-generate-svg-components', {dir: 'packages/$(p)'})
                .addPredefinedTarget('package-storybook', 'yarn-story', {dir: 'packages/$(p)'})
                .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
                .addPredefinedTarget('install-root', 'yarn-install')
                .addPredefinedTarget('install-packages', 'yarn-lerna-bootstrap')
                .addPredefinedTarget('build', 'yarn-lerna-run-build')
                .addPredefinedTarget('package-build', 'yarn-build', {dir: 'packages/$(p)'})
                .addPredefinedTarget('package-test', 'yarn-test-jest', {dir: 'packages/$(p)', local: true, coverage: true}, [], ['package-build'])
                .addPredefinedTarget('test-only', 'yarn-test-jest', {local: true, parallel: false, coverage: true})
                .addPredefinedTarget('test-local', 'yarn-test-jest', {local: true, coverage: true})
                .addPredefinedTarget('package-clear-test', 'yarn-jest-clear-cache', {dir: 'packages/$(p)'})
                .addPredefinedTarget('package-install', 'yarn-lerna-bootstrap', {scope: '@ohoareau/$(p)'})
                .addPredefinedTarget('changed', 'yarn-lerna-changed')
                .addPredefinedTarget('publish', 'yarn-lerna-publish')
                .addPredefinedTarget('clean-buildinfo', 'clean-ts-build-info', {on: 'packages'})
                .addPredefinedTarget('clean-coverage', 'clean-coverage', {on: 'packages'})
                .addPredefinedTarget('clean-lib', 'clean-lib', {on: 'packages'})
                .addPredefinedTarget('clean-modules', 'clean-node-modules', {on: 'packages'})
                .addMetaTarget('test', ['build', 'test-only'])
                .addMetaTarget('install', ['install-root', 'install-packages', 'build'])
                .addMetaTarget('clean', ['clean-lib', 'clean-modules', 'clean-coverage', 'clean-buildinfo'])
                .setDefaultTarget('install')
            ,
            'sample-libs-js.mk'
        );
    })
})