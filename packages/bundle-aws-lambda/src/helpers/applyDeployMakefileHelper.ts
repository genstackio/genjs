import {IPackage, MakefileTemplate} from "@genjs/genjs";

// noinspection JSUnusedLocalSymbols
export function applyDeployMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage, opts: any = {}) {
    const mode = vars.deploy_target || opts.deploy_target || (vars.deployable ? 'deployable' : undefined);

    if (!mode) return;

    switch (mode) {
        case 's3':
            const assets = !!vars.deploy_assets_support
            const cdn = !!vars.cdn_support
            t
                .addGlobalVar('AWS_DEFAULT_REGION', vars.aws_default_region || 'eu-west-3')
                .addGlobalVar('AWS_REGION', vars.aws_region || '$(AWS_DEFAULT_REGION)')
                .addGlobalVar('prefix', vars.project_prefix)
                .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
                .addGlobalVar('target_s3_bucket', vars.s3_bucket || `$(env)-${vars.project_prefix}-platform-${vars.project_name}`)
                .addGlobalVar('target_s3_key', vars.s3_key || `$(env)-${vars.name}.zip`)
                .addGlobalVar('target_lambda_name', vars.lambda_name || `$(env)-${vars.name}`)
                .addGlobalVar('source_package_file', vars.package_file || 'build/package.zip')
                .addMetaTarget('deploy', ['deploy-package', assets && 'deploy-assets', 'update-lambda-code', cdn && 'invalidate-cache'].filter(x => !!x) as string[])
                .addTarget('deploy-package', [
                    `AWS_EC2_METADATA_DISABLED=true AWS_PROFILE=$(AWS_PROFILE) aws s3 cp $(source_package_file) s3://$(target_s3_bucket)/$(target_s3_key)${vars.s3_cache_control ? ` --cache-control '${vars.s3_cache_control}'` : ''}`,
                ])
                .addTarget('update-lambda-code', [
                    `$(foreach f,$(target_lambda_name), echo "\\n----- \\033[36m$(f)\\033[0m --------------------------"; echo; ${vars.target_aws_regions?.length ? vars.target_aws_regions.map(buildDeployOne).join(';') : buildDeployOne('')};)`,
                ])
                .addTarget(
                    'update-lambda-code-of',
                    vars.target_aws_regions?.length ?
                        vars.target_aws_regions.map(r =>
                            `AWS_EC2_METADATA_DISABLED=true AWS_DEFAULT_REGION=$(AWS_DEFAULT_REGION) AWS_REGION=${r} AWS_PROFILE=$(AWS_PROFILE) aws lambda update-function-code --function-name $(f) --s3-bucket $(target_s3_bucket)-${r} --s3-key $(target_s3_key)`,
                        )
                        : [
                            'AWS_EC2_METADATA_DISABLED=true AWS_DEFAULT_REGION=$(AWS_DEFAULT_REGION) AWS_PROFILE=$(AWS_PROFILE) aws lambda update-function-code --function-name $(f) --s3-bucket $(target_s3_bucket) --s3-key $(target_s3_key)',
                        ],
                )
            ;
            if (assets) {
                t
                    .addGlobalVar('source_assets_dir', vars.assets_source_dir || './build/public/')
                    .addGlobalVar('target_assets_s3_bucket', vars.assets_s3_bucket || 'please-set-target-assets-s3-bucket-here')
                    .addGlobalVar('target_assets_s3_key', vars.assets_s3_key || '')
                    .addPredefinedTarget('deploy-assets', 'aws-s3-sync', {source: '$(source_assets_dir)', cacheControl: '$(assets_cache_control)', targetDir: '$(target_assets_s3_bucket)/${target_assets_s3_key)'})
                ;
            }
            if (cdn) {
                t
                    .addPredefinedTarget('invalidate-cache-of', 'aws-cloudfront-create-invalidation')
                    .addTarget('invalidate-cache', [
                        '$(foreach f,$(cloudfront), echo "\\n----- \\033[36m$(f)\\033[0m --------------------------"; echo; AWS_DEFAULT_REGION=$(AWS_DEFAULT_REGION) AWS_PROFILE=$(AWS_PROFILE) make invalidate-cache-of cloudfront=$(f);)',
                    ])
                ;
            }
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

function buildDeployOne(x: string) {
    return `AWS_EC2_METADATA_DISABLED=true AWS_PAGER= AWS_DEFAULT_REGION=$(AWS_DEFAULT_REGION)${x ? ` AWS_REGION=${x}` : ''} AWS_PROFILE=$(AWS_PROFILE) aws lambda update-function-code --function-name $(f) --s3-bucket $(target_s3_bucket)${x ? `-${x}` : ''} --s3-key $(target_s3_key) --output yaml`;
}
// noinspection JSUnusedGlobalSymbols
export default applyDeployMakefileHelper;
