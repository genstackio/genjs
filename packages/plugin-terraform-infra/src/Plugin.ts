import Package from './Package';
import {IGenerator, IPackage, IPlugin, PackageGroup} from '@genjs/genjs';
import registerTerraformBundle from '@genjs/genjs-bundle-terraform';

export default class Plugin implements IPlugin {
    onPackageCreated(p: IPackage, eventType: string, ctx: {data: any, globalContext: any, group: PackageGroup}): void {
        ctx.globalContext.layers = ((ctx.data.vars || {}).layers) || {};
    }
    onProjectHydrate(p: IPackage, eventType: string, ctx: any): void {
        if ('terraform-infra' === p.getPackageType()) return;
        ctx.data.projectData = ctx.data.projectData || {};
        ctx.data.projectData.templateVars = ctx.data.projectData.templateVars || {};
        ctx.data.projectData.templateVars['layers'] = ctx.globalContext.layers || {};
    }
    register(generator: IGenerator): void {
        registerTerraformBundle(generator);
        generator.registerPackageEventHook('terraform-infra', 'created', this.onPackageCreated);
        generator.registerPackageEventHook('*', 'before_hydrate', this.onProjectHydrate);
        generator.registerPackager('terraform-infra', cfg => new Package(cfg));
    }
}
