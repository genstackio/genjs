import {AwsLambdaPackage} from '@genjs/genjs-bundle-aws-lambda';

export default class Package extends AwsLambdaPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            description: 'Java AWS Lambda',
        };
    }
}