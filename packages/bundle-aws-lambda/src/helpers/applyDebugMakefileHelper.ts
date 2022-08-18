import {IPackage, MakefileTemplate} from "@genjs/genjs";

// noinspection JSUnusedLocalSymbols
export function applyDebugMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage & {hasStarters?: Function, starters?: any}) {
    t.addGlobalVar('DEBUG', vars.debug_pattern || '');
}
// noinspection JSUnusedGlobalSymbols
export default applyDebugMakefileHelper;