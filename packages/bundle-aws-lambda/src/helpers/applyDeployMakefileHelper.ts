import {IPackage, MakefileTemplate} from "@genjs/genjs";

// noinspection JSUnusedLocalSymbols
export function applyDeployMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage, opts: any = {}) {
    const mode = vars.deploy_target || opts.deploy_target || (vars.deployable ? 'deployable' : undefined);

    if (!mode) return;

    switch (mode) {
        case 's3':
            t
                .addGlobalVar('AWS_REGION', vars.aws_default_region || 'eu-west-3')
                .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
                .addGlobalVar('target_s3_bucket', vars.s3_bucket || 'please-set-target-s3-bucket-here.zip')
                .addGlobalVar('target_s3_key', vars.s3_key || 'please-set-target-s3-key-here')
                .addGlobalVar('target_lambda_name', vars.lambda_name || 'please-set-target-lambda-name-here')
                .addGlobalVar('source_package_file', vars.package_file || 'build/package.zip')
                .addMetaTarget('deploy', ['deploy-package', 'update-lambda-code'])
                .addTarget('deploy-package', [
                    'AWS_PROFILE=$(AWS_PROFILE) aws s3 cp $(source_package_file) s3://$(target_s3_bucket)/$(target_s3_key)',
                ])
                .addTarget('update-lambda-code', [
                    'AWS_DEFAULT_REGION=$(AWS_DEFAULT_REGION) AWS_PROFILE=$(AWS_PROFILE) aws lambda update-function-code --function-name $(target_lambda_name) --s3-bucket $(target_s3_bucket) --s3-key $(target_s3_key)',
                ])
            ;
            break;
        case 'custom':
            t.addTarget('deploy', vars.target_custom_command ? [vars.target_custom_command] : undefined);
            break;
        case 'deployable':
            if (vars.deployable) {
                if (opts.predefinedTarget) {
                    vars.deployable && t.addPredefinedTarget('deploy', opts.predefinedTarget);
                } else {
                    t.addTarget('deploy');
                }
            }
            break;
        default:
            break;
    }
}

// noinspection JSUnusedGlobalSymbols
export default applyDeployMakefileHelper;