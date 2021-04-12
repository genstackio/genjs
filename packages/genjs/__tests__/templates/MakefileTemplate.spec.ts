import {MakefileTemplate} from '../../src';
import path from 'path';
import * as commonTargets from '../../src/targets';

const expectRenderSameAsFile = (template: MakefileTemplate, file: string) => {
    expect(template.render()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../../__fixtures__/templates/makefiles/${file}`), 'utf8').trim());
};

const predefinedTargets = {...commonTargets};

describe('render', () => {
    it('no targets', () => {
        expectRenderSameAsFile(new MakefileTemplate(), 'no-targets.mk');
    })
    it('no targets but custom config', () => {
        expectRenderSameAsFile(new MakefileTemplate({
            targets: {
                target1: {deps: ['target1-sub-a', 'target1-sub-b']},
                ['target1-sub-a']: {steps: ['echo "Hello from Target1SubA!"']},
                ['target1-sub-b']: {steps: ['echo "Hello from"', 'echo "Target1SubB!"']},
                ['build-custom']: {steps: ['custom-build']},
            },
            globals: {
                var1: {defaultValue: '12'},
                var2: {value: '13'}
            },
            defaultTarget: 'target1',
            predefinedTargets,
        }), 'no-targets-but-custom-config.mk');
    })
    it('one target named all', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addTarget('all', ['@true'])
            ,
            'one-target-named-all.mk'
        );
    })
    it('one target named all plus other targets', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addTarget('all', ['@true'])
                .addTarget('t1', ['@false'])
                .addTarget('t2', ['@true'])
            ,
            'one-target-named-all-plus-other-targets.mk'
        );
    })
    it('grouped targets', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addTarget('all', ['@true'])
                .addTarget('build', ['@true'])
                .addTarget('install-dummy', ['@true'])
                .addTarget('build-c', ['@true'])
                .addTarget('build-a', ['@true'])
                .addTarget('build-b', ['@true'])
            ,
            'grouped-targets.mk'
        );
    })
    it('grouped targets with overriden target', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({
                targets: {
                    ['build-b']: {steps: ['echo "Overriden!"']},
                },
                globals: {
                    var2: {value: '14'},
                },
                predefinedTargets,
            })
                .addGlobalVar('var2', undefined, '13')
                .addTarget('all', ['@true'])
                .addTarget('build', ['@true'])
                .addTarget('install-dummy', ['@true'])
                .addTarget('build-c', ['@true'])
                .addTarget('build-a', ['@true'])
                .addTarget('build-b', ['@true'])
            ,
            'grouped-targets-with-overriden-target.mk'
        );
    })
    it('sample with exports', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addGlobalVar('prefix', 'myprefix')
                .addExportedVar('a')
                .addExportedVar('B_C')
                .addTarget('install', ['echo "Hello world!"'])
                .setDefaultTarget('install')
            ,
            'sample-with-exports.mk'
        );
    })
})