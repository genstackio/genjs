import IPackage from './IPackage';
import StaticFileTemplate from './StaticFileTemplate';
import {populateData} from "./utils";
import {requireTechnologies} from '@ohoareau/technologies';
import detectTechnologies from '@ohoareau/technologies-detector';

export type BasePackageConfig = {
    name: string,
    description?: string,
    targetDir: string,
    packageType: string,
    sources?: string[],
    files?: {[key: string]: any},
    vars?: {[key: string]: any},
}

const fs = require('fs');

export abstract class AbstractPackage<C extends BasePackageConfig = BasePackageConfig> implements IPackage {
    public readonly packageType: string;
    public readonly name: string;
    public readonly description: string;
    public readonly sources: string[];
    public readonly vars: {[key: string]: any};
    public readonly files: {[key: string]: any};
    public readonly features: any;
    public readonly extraOptions: any;
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(config: C) {
        const {name, description, packageType, sources = [], files = {}, vars =  {}, targetDir, ...extra} = config;
        this.name = name;
        this.description = description || name;
        this.packageType = packageType;
        this.sources = sources;
        this.files = files;
        this.vars = vars;
        this.vars.targetDir = targetDir;
        [this.features, this.extraOptions] = Object.entries(<any>extra).reduce((acc, [k, v]) => {
            if ('boolean' === typeof v) acc[0][k] = v;
            else acc[1][k] = v;
            return acc;
        }, [{}, {}]);
        this.features = {...this.getDefaultFeatures(), ...this.features};
        this.extraOptions = {...this.getDefaultExtraOptions(), ...this.extraOptions};
    }
    protected getDefaultFeatures(): any {
        return {};
    }
    protected getDefaultExtraOptions(): any {
        return {};
    }
    public getDescription() {
        return this.description;
    }
    public getFeatures(): any {
        return this.features;
    }
    public getExtraOptions(): any {
        return this.extraOptions;
    }
    public getExtraOption(name: string, defaultValue: any = undefined): any {
        return ('undefined' === (typeof this.extraOptions[name])) ? defaultValue : this.extraOptions[name];
    }
    public hasFeature(name: string, defaultValue = false): boolean {
        if (undefined === this.features[name]) return defaultValue;
        return !!this.features[name];
    }
    public getPackageType(): string {
        return this.packageType;
    }
    public getName(): string {
        return this.name;
    }
    protected getTemplateRoot(): string {
        return '_no-template-root_';
    }
    protected async buildFiles(vars: any, cfg: any): Promise<any> {
        const files = Object.entries(await this.buildFilesFromTemplates(vars, cfg)).reduce((acc, [k, v]) => {
            acc[k] = ({renderFile}) => renderFile(cfg)(true === v ? `${k}.ejs` : v, vars);
            return acc;
        }, {});
        return Object.assign(files, await this.buildDynamicFiles(vars, cfg));
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {};
    }
    // noinspection JSUnusedLocalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {};
    }
    protected getTechnologies(): any {
        return [];
    }
    protected getPreRequisites(): any {
        return {};
    }
    protected getInstallProcedures(): any {
        return {};
    }
    protected getDefaultCommonVars(): any {
        return {
            deployable: false,
            name: this.name,
            version: '1.0.0',
            description: 'Package',
            dependencies: {},
        }
    }
    protected buildDefaultAutomaticVars(vars: any): any {
        return {
            author_email: vars.author_email || ((vars.author && 'object' === typeof vars.author) ? vars.author.email : 'Confidential'),
            author_name: vars.author_name || ((vars.author && 'object' === typeof vars.author) ? vars.author.name : (vars.author || 'Confidential')),
            author_full: vars.author_full || ((vars.author && 'object' === typeof vars.author) ? `${vars.author.name} <${vars.author.email}>` : (vars.author || 'Confidential')),
        };
    }
    protected buildVars(vars: any): any {
        const vv = Object.assign({}, this.getDefaultCommonVars(), vars);
        Object.assign(vv, this.buildDefaultAutomaticVars(vv));
        Object.assign(vv, this.buildDefaultVars(vv));
        Object.assign(vv, this.vars);
        return Object.assign(vv, vars);
    }
    // noinspection JSUnusedLocalSymbols
    protected buildDefaultVars(vars: any): any {
        return {};
    }
    // noinspection JSUnusedLocalSymbols
    protected buildSources(vars: any, cfg: any): any[] {
        return [];
    }
    async describe(): Promise<any> {
        return {
            ...requireTechnologies(this.detectTechnologies().concat(this.getTechnologies().filter(x => !!x))),
        };
    }
    detectTechnologies(): string[] {
        return detectTechnologies(this.vars.targetDir);
    }
    async hydrate(data: any): Promise<void> {
        populateData(this.vars, data);
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const pluginCfg = {templatePath: this.getTemplateRoot()};
        vars = this.buildVars(vars);
        const files = await this.buildFiles(vars, pluginCfg);
        Object.assign(files, (Object.entries(this.files).reduce((acc, [k, v]) => {
            acc[k] = 'string' === typeof v ? (() => v) : (('function' === typeof v) ? v : (({renderFile}) => renderFile(pluginCfg)((v as any).template, v)));
            return acc;
        }, {})));
        if (vars.write) {
            if (!vars.targetDir) throw new Error('No target directory specified');
            const root = vars.rootDir;
            await Promise.all(this.buildSources(vars, pluginCfg).map(async dir => {
                if (!fs.existsSync(`${root}/${dir}`)) return [];
                return Promise.all(fs.readdirSync(`${root}/${dir}`, {}).map(async f => {
                    f = `${f}`;
                    if ('.' === f || '..' === f) return;
                    files[f] = new StaticFileTemplate(`${root}/${dir}/${f}`, f);
                }));
            }));
        }
        return files;
    }
    hasVarsFeature(vars: any, feature: string, defaultValue: boolean = false): boolean {
        const k = `feature_${feature}`;
        return (!!vars && ('undefined' !== typeof vars[k])) ? vars[k] : defaultValue;
    }
    hasVarsCategoryFeature(vars: any, category: string, feature: string, defaultValue: boolean = false): boolean {
        return this.hasVarsFeature(vars, `${category}_${feature}`, defaultValue);
    }
}

// noinspection JSUnusedGlobalSymbols
export default AbstractPackage