import Package from './Package';
import {IGenerator, IPackage, IPlugin, PackageGroup} from '@genjs/genjs';
import registerCicdBundle from '@genjs/genjs-bundle-cicd';

export default class Plugin implements IPlugin {
    onPackageCreated(p: IPackage, eventType: string, ctx: {data: any, globalContext: any, group: PackageGroup}): void {
        if ('.' === p.getName()) return;
        if ('.github' === p.getName()) return;
        ctx.globalContext.projectsWorkflows = ctx.globalContext.projectsWorkflows || {};
        ctx.globalContext.projectsWorkflows[p.getName()] = {
            project: p.getName(),
            projectPath: (ctx.group.getDir() === '.') ? p.getName() : `${ctx.group.getDir()}/${p.getName()}`,
            ...((p.hasFeature('generateEnvLocalable') || p['vars']?.sourceLocalEnvLocal) ? {needRoot: true} : {}),
        };
    }
    onCicdGithubHydrate(p: IPackage, eventType: string, ctx: any): void {
        ctx.data.projectsWorkflows = {...(ctx.globalContext.projectsWorkflows || {}), ...(ctx.data.projectsWorkflows || {})};
    }
    onProjectHydrate(p: IPackage, eventType: string, ctx: any): void {
        if ('cicd-github' === p.getPackageType()) return;
        if ('.' === p.getName()) return;
        if ('.github' === p.getName()) return;
        if (!ctx.globalContext.projectsWorkflows[p.getName()]) return;
    }
    register(generator: IGenerator): void {
        registerCicdBundle(generator);
        generator.registerPackageEventHook('*', 'created', this.onPackageCreated);
        generator.registerPackageEventHook('*', 'before_hydrate', this.onProjectHydrate);
        generator.registerPackageEventHook('cicd-github', 'before_hydrate', this.onCicdGithubHydrate);
        generator.registerPackager('cicd-github', cfg => new Package(cfg));
    }
}
