import {IPackage, MakefileTemplate} from "@genjs/genjs";

export function applyRefreshMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage) {
    if (!p.hasFeature('refreshable')) return;

    t.addMetaTarget('refresh', ['install', 'build', 'deploy']);
}

// noinspection JSUnusedGlobalSymbols
export default applyRefreshMakefileHelper;