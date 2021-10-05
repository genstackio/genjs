import {CicdPackage} from '@genjs/genjs-bundle-cicd';

export default class Package extends CicdPackage {
    constructor(config: any) {
        super(config, __dirname);
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