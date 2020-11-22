import {AbstractPackage} from '@genjs/genjs';
import {existsSync} from "fs";

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    protected hasTemplate(name: string): boolean {
        return existsSync(`${this.getTemplateRoot()}/${name}.ejs`);
    }
    // noinspection JSUnusedLocalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            package_registry: 'registry.npmjs.org',
            package_registry_secret_var: 'CUSTOM_NPM_TOKEN',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        const c = {workflows: {}, ...(vars.github || {})};
        return Object.entries(c.workflows).reduce((acc, [k, v]) => {
            const fileName = `workflows/${k}.yml`;
            this.hasTemplate(fileName) && (acc[fileName] = true);
            return acc;
        }, {});
    }
    protected getTechnologies(): any {
        return ['git', 'github'];
    }
}