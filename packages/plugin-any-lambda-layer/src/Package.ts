import {AwsLambdaLayerPackage} from '@genjs/genjs-bundle-aws-lambda-layer';
import {applyDeployMakefileHelper} from "@genjs/genjs-bundle-aws-lambda";

export default class Package extends AwsLambdaLayerPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    protected buildMakefile(vars: any) {
        const t = super.buildMakefile(vars)
            .addShellTarget('build', './bin/build', ['clean'])
            .addShellTarget('clean', './bin/clean')
            .addShellTarget('install', './bin/install')
        ;

        applyDeployMakefileHelper(t, vars, this);

        return t;
    }
}