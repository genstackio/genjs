import {IPackage, MakefileTemplate} from "@genjs/genjs";

export function applyStarterMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage & {hasStarters?: Function, starters?: any}) {
    if (!p.hasStarters || !p.hasStarters()) return;

    t
        .addGlobalVar('AWS_REGION', vars.aws_default_region || 'eu-west-3')
        .addGlobalVar('prefix', vars.project_prefix)
        .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
    ;

    let index = 0;

    if (1 < Object.entries(p.starters).length) {
        const startTargetNames: string[] = [];
        const startNames: string[] = [];
        Object.entries(p.starters).forEach(([n, v]: any) => {
            const scriptName = `${v.directory ? v.directory : ''}${v.directory ? '/' : ''}${v.name}.js`;
            t.addPredefinedTarget(`start-${n}`, 'nodemon', {sourceLocalEnvLocal: vars.sourceLocalEnvLocal, envs: v.envs, script: scriptName, port: p.getParameter('startPort', 4000) + index});
            startTargetNames.push(`start-${n}`);
            startNames.push(n);
            index++;
        });
        t.addTarget('start', [`npx concurrently -n ${startNames.join(',')} ${startTargetNames.map(n => `"make ${n}"`).join(' ')}`])
    } else {
        const [, v]: [any, any] = Object.entries(p.starters)[0];
        const scriptName = `${v.directory ? v.directory : ''}${v.directory ? '/' : ''}${v.name}.js`;
        t.addPredefinedTarget('start', 'nodemon', {envs: v.envs, script: scriptName, port: p.getParameter('startPort', 4000) + index});
        index++;
    }
}

// noinspection JSUnusedGlobalSymbols
export default applyStarterMakefileHelper;