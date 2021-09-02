import {IPackage, MakefileTemplate} from "@genjs/genjs";

export function applyMigrateMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage) {
    if (!p.hasFeature('migratable')) return;

    t
        .addPredefinedTarget('migrate', 'js-migrate')
    ;
}

// noinspection JSUnusedGlobalSymbols
export default applyMigrateMakefileHelper;