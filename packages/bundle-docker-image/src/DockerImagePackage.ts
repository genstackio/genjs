import {BasePackage} from '@genjs/genjs-bundle-package';
import {
    BuildableBehaviour,
    DeployableBehaviour,
    GenerateEnvLocalableBehaviour,
    InstallableBehaviour,
    TestableBehaviour,
} from '@genjs/genjs';

export class DockerImagePackage extends BasePackage {
    protected getBehaviours() {
        return [
            ...super.getBehaviours(),
            new BuildableBehaviour(),
            new InstallableBehaviour(),
            new DeployableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new TestableBehaviour(),
        ]
    }
    protected getDefaultExtraOptions() {
        return {
            ...super.getDefaultExtraOptions(),
            phase: 'post',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            description: 'Docker image',
            image_tag: '$(image_tag)',
            image_region: "`echo $$REPOSITORY_URL_PREFIX | cut -d '.' -f 4`",
            image_domain: '$$REPOSITORY_URL_PREFIX',
        };
    }
    protected buildStaticFiles(vars: any, cfg: any) {
        return {
            ...super.buildStaticFiles(vars, cfg),
            ['code/.gitkeep']: '',
        };
    }
}

export default DockerImagePackage