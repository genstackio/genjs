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
            buildStartTarget(t, p, `start-${n}`, v, {sourceLocalEnvLocal: vars.sourceLocalEnvLocal}, index);
            startTargetNames.push(`start-${n}`);
            startNames.push(n);
            index++;
        });
        t.addTarget('start', [`npx concurrently -n ${startNames.join(',')} ${startTargetNames.map(n => `"make ${n}"`).join(' ')}`])
    } else {
        const [, v]: [any, any] = Object.entries(p.starters)[0];
        buildStartTarget(t, p, 'start', v, {sourceLocalEnvLocal: vars.sourceLocalEnvLocal});
        index++;
    }
}

function buildStartTarget(t: MakefileTemplate, p: IPackage, name: string, v: any, opts: any = {}, index: number = 0) {
    const port = p.getParameter('startPort', 4000) + index;
    const targetOpts = {...opts, envs: v.envs, port};
    switch (v.runner || v.type) {
        case 'air':
            t.addTarget(name, [
                'air'
            ], {...targetOpts, envs: {AWS_PROFILE: '$(AWS_PROFILE)', AWS_REGION: '$(AWS_DEFAULT_REGION)', AWS_SDK_LOAD_CONFIG: '1', PORT: port, ...targetOpts.envs}});
            break;
        default:
        case 'nodemon':
            const script = `${v.directory ? v.directory : ''}${v.directory ? '/' : ''}${v.name}.js`;
            t.addPredefinedTarget(name, 'nodemon', {...targetOpts, script});
            break;
    }

}
// noinspection JSUnusedGlobalSymbols
export default applyStarterMakefileHelper;