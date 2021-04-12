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
        };
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'circleci',
        ];
    }
}