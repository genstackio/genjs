import {IPackage, MakefileTemplate} from "@genjs/genjs";

// noinspection JSUnusedLocalSymbols
export function applyLogMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage, opts: any = {}) {
    if (!p.hasFeature('loggable')) return;
    t.addPredefinedTarget('log', 'aws-logs-tail', {group: vars.log_group || `/aws/lambda/$(env)-${vars.name}`, follow: true});
}

// noinspection JSUnusedGlobalSymbols
export default applyLogMakefileHelper;