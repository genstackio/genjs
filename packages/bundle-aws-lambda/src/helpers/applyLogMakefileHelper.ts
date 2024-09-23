import {IPackage, MakefileTemplate} from "@genjs/genjs";

// noinspection JSUnusedLocalSymbols
export function applyLogMakefileHelper(t: MakefileTemplate, vars: any, p: IPackage, opts: any = {}) {
    if (!p.hasFeature('loggable')) return;
    if (vars.target_aws_regions?.length) {
        vars.target_aws_regions.forEach(r => {
            t.addPredefinedTarget(`log-${r}`, 'aws-logs-tail', {awsRegion: r, group: vars.log_group || `/aws/lambda/$(env)-${vars.name}`, follow: true});
        });
        t.addTarget('log', [
            vars.target_aws_regions.map(r => `$(MAKE) log-${r} env=$(env)`).join(';'),
        ]);
    } else {
        t.addPredefinedTarget('log', 'aws-logs-tail', {group: vars.log_group || `/aws/lambda/$(env)-${vars.name}`, follow: true});
    }
}

// noinspection JSUnusedGlobalSymbols
export default applyLogMakefileHelper;
