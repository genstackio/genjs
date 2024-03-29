import Package from './Package';
import {IGenerator, IPlugin, IPackage, PackageGroup} from '@genjs/genjs';
import {buildProjectsVars} from "./utils";
import registerMonorepoBundle from '@genjs/genjs-bundle-monorepo';
import registerScmBundle from '@genjs/genjs-bundle-scm';

export default class Plugin implements IPlugin {
    onPackageCreated(p: IPackage, eventType: string, ctx: {data: any, globalContext: any, group: PackageGroup}): void {
        if ('.' === p.getName()) return;
        ctx.globalContext.projects = ctx.globalContext.projects || {};
        const features = {
            startable: false,
            testable: false,
            loggable: false,
            deployable: false,
            preInstallable: false,
            migratable: false,
            ...p.getFeatures(),
        };
        const extraOptions = {
            ...p.getExtraOptions(),
        }
        ctx.globalContext.projects[p.getName()] = {
            name: p.getName(),
            description: p.getDescription(),
            fullDir: (ctx.group.getDir() === '.') ? p.getName() : `${ctx.group.getDir()}/${p.getName()}`,
            ...features,
            ...extraOptions,
        };
    }
    onMonorepoDockerImagesHydrate(p: IPackage, eventType: string, ctx: any): void {
        ctx.data.projects = {...(ctx.globalContext.projects || {}), ...(ctx.data.projects || {})};
        const {startableProjects} = buildProjectsVars({projects: ctx.data.projects});
        startableProjects.forEach((p, i) => {
            ctx.data.projects[p.name].startableOrder = i;
        })
    }
    onProjectHydrate(p: IPackage, eventType: string, ctx: any): void {
        if ('monorepo-docker-images' === p.getPackageType()) return;
        if (!ctx.globalContext.projects[p.getName()]) return;
        Object.entries(ctx.globalContext.projects[p.getName()]).forEach(([k, v]) => {
            if (!ctx.data || !ctx.data.projectData) return;
            if ('undefined' !== typeof ctx.data.projectData[k]) return;
            ctx.data.projectData[k] = v;
        }) ;
    }
    register(generator: IGenerator): void {
        registerMonorepoBundle(generator);
        registerScmBundle(generator);
        generator.registerPackageEventHook('*', 'created', this.onPackageCreated);
        generator.registerPackageEventHook('*', 'before_hydrate', this.onProjectHydrate);
        generator.registerPackageEventHook('monorepo-docker-images', 'before_hydrate', this.onMonorepoDockerImagesHydrate);
        generator.registerPackager('monorepo-docker-images', cfg => new Package(cfg));
    }
}
