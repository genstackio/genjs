import {BasePackage} from '@genjs/genjs-bundle-package';
import {BuildableBehaviour, CleanableBehaviour, InstallableBehaviour} from '@genjs/genjs';

export class AwsLambdaLayerPackage extends BasePackage {
    protected getBehaviours() {
        return [
            ...super.getBehaviours(),
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
        ]
    }
    protected getDefaultExtraOptions() {
        return {
            ...super.getDefaultExtraOptions(),
            phase: 'pre',
        };
    }
    protected buildMakefile(vars: any) {
        return super.buildMakefile(vars)
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            ;
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'aws_cli',
            'aws_lambda',
        ];
    }
}

export default AwsLambdaLayerPackage