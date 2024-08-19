import {BasePackage} from "@genjs/genjs-bundle-package";

export default class Package extends BasePackage {
    protected getDefaultExtraOptions() {
        return {
            ...super.getDefaultExtraOptions(),
            phase: 'pre',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildDynamicFiles(vars, cfg)),
        };
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
        ];
    }
}
