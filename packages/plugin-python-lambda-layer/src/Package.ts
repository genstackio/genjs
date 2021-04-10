import {AwsLambdaLayerPackage} from '@genjs/genjs-bundle-aws-lambda-layer';

export default class Package extends AwsLambdaLayerPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            description: 'Python AWS Lambda Layer',
            url: 'https://github.com',
            pypi_repo: 'pypi',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any) {
        return {
            ...super.buildFilesFromTemplates(vars, cfg),
            ['requirements.txt']: true,
            ['setup.py']: true,
            ['Makefile']: true,
            ['tests/__init__.py']: true,
        };
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addIgnore('/venv/')
            .addIgnore('/.idea/')
            .addIgnore('__pycache__/')
        ;
    }
}