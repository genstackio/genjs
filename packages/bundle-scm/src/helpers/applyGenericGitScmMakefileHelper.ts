import {IPackage, MakefileTemplate} from "@genjs/genjs";

export function applyGenericGitScmMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage) {
    if ('git' !== vars.scm) return;
}

// noinspection JSUnusedGlobalSymbols
export default applyGenericGitScmMakefileHelper;