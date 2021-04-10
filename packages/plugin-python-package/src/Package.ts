import {PythonPackage} from '@genjs/genjs-bundle-python';

export default class Package extends PythonPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addIgnore('/venv/')
            .addIgnore('/.idea/')
            .addIgnore('__pycache__/')
        ;
    }
    protected buildMakefile(vars: any) {
        return super.buildMakefile(vars)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('pypi_repo', undefined, vars.pypi_repo)
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
        ;
    }
}