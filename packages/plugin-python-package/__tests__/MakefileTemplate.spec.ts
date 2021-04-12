import {MakefileTemplate} from '@genjs/genjs';
import path from 'path';
import * as commonTargets from '@genjs/genjs/lib/targets';
import * as pythonBundleTargets from '@genjs/genjs-bundle-python/lib/targets';

const expectRenderSameAsFile = (template: MakefileTemplate, file: string) => {
    expect(template.render()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../__fixtures__/templates/makefiles/${file}`), 'utf8').trim());
};

const predefinedTargets = {...commonTargets, ...pythonBundleTargets};

describe('render', () => {
    it('sample python package', () => {
        expectRenderSameAsFile(
            new MakefileTemplate({predefinedTargets})
                .addGlobalVar('env', 'dev')
                .addGlobalVar('pypi_repo', undefined, 'mypypirepo')
                .addMetaTarget('pre-install', ['create-venv'])
                .addPredefinedTarget('system-install', 'pip-install-build-utils')
                .addPredefinedTarget('create-venv', 'virtualenv-create')
                .addPredefinedTarget('clean-venv', 'virtualenv-create')
                .addPredefinedTarget('venv-deactivate', 'virtualenv-deactivate')
                .addPredefinedTarget('venv-activate', 'virtualenv-activate')
                .addTarget('build', ['source venv/bin/activate && python3 setup.py sdist bdist_wheel'], ['clean'])
                .addTarget('clean', ['rm -rf dist'])
                .addTarget('deploy', ['source venv/bin/activate && twine upload --repository $(pypi_repo) dist/*'])
                .addTarget('install', ['source venv/bin/activate && pip3 install -r requirements.txt'])
                .addTarget('install-test', ['source venv/bin/activate && pip3 install -r requirements.txt -i https://test.pypi.org/simple'])
                .addTarget('test', ['source venv/bin/activate && python -m unittest tests/*.py -v'])
                .addTarget('test-ci', ['source venv/bin/activate && python -m unittest tests/*.py -v'])
                .addTarget('test-cov', ['source venv/bin/activate && python -m unittest tests/*.py -v'])
                .setDefaultTarget('install')
            ,
            'sample-python-package.mk'
        );
    })
})