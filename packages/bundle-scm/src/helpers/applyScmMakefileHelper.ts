import {IPackage, MakefileTemplate} from "@genjs/genjs";
import applyGithubScmMakefileHelper from "./applyGithubScmMakefileHelper";
import applyGenericGitScmMakefileHelper from "./applyGenericGitScmMakefileHelper";

export function applyScmMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage) {
    applyGenericGitScmMakefileHelper(t, vars, p);
    applyGithubScmMakefileHelper(t, vars, p);
}

// noinspection JSUnusedGlobalSymbols
export default applyScmMakefileHelper;