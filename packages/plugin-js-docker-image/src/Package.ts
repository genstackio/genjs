import {DockerImagePackage} from '@genjs/genjs-bundle-docker-image';

export default class Package extends DockerImagePackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            description: 'JS Docker image',
            image_tag: '$(image_tag)',
            image_region: "`echo $$REPOSITORY_URL_PREFIX | cut -d '.' -f 4`",
            image_domain: '$$REPOSITORY_URL_PREFIX',
        };
    }
    protected buildMakefile(vars: any) {
        return super.buildMakefile(vars)
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addGlobalVar('AWS_DEFAULT_REGION', '$(shell set -a && . ./.env.local && set +a && echo $$REPOSITORY_REGION)')
            .addGlobalVar('ecr_url', '$(shell set -a && . ./.env.local && set +a && echo $$REPOSITORY_URL_PREFIX)')
            .addGlobalVar('image_name', '$(env)-$(subst _,-,$(patsubst %_image,%,$(shell basename `pwd`)))')
            .addGlobalVar('image_tag', '$(ecr_url)/$(image_name):latest')
            .addPredefinedTarget('install-code', 'js-install-prod', {dir: 'code'})
            .addPredefinedTarget('build-code', 'js-build', {dir: 'code'})
            .addPredefinedTarget('build-image', 'docker-build', {sourceLocalEnvLocal: true, awsProfile: true, awsEcrLogin: true, tag: vars.image_tag, region: vars.image_region, domain: vars.image_domain, path: vars.image_dir || '.', buildArgs: vars.image_buildArgs || {}})
            .addMetaTarget('build', ['build-code', 'build-image'])
            .addMetaTarget('install', ['install-code'])
            .addPredefinedTarget('push', 'docker-push', {sourceLocalEnvLocal: true, awsProfile: true, awsEcrLogin: true, tag: vars.image_tag, region: vars.image_region, domain: vars.image_domain})
            .addMetaTarget('deploy', ['push'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local')
        ;
    }
}