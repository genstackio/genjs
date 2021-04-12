import {CicdPackage} from '@genjs/genjs-bundle-cicd';

export default class Package extends CicdPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    // noinspection JSUnusedLocalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            package_registry: 'registry.npmjs.org',
            package_registry_secret_var: 'CUSTOM_NPM_TOKEN',
            github_workflow_job_os: 'ubuntu-18.04'
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any) {
        const c = {workflows: {}, ...(vars.github || {})};
        return Object.entries(c.workflows).reduce((acc, [k, v]) => {
            const fileName = `workflows/${k}.yml`;
            this.hasTemplate(fileName) && (acc[fileName] = true);
            return acc;
        }, super.buildFilesFromTemplates(vars, cfg));
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'github',
        ];
    }
}