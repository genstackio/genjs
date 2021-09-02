import {IPackage, MakefileTemplate} from "@genjs/genjs";

export function applyGithubScmMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage) {
    if ('github' !== vars.scm) return;

    t.addTarget('pr', ['hub pull-request -b $(b)']);
}

// noinspection JSUnusedGlobalSymbols
export default applyGithubScmMakefileHelper;