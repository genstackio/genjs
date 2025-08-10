import IPackage from './IPackage';
import StaticFileTemplate from './StaticFileTemplate';
import {populateData} from "./utils";
import {requireTechnologies} from '@ohoareau/technologies';
import detectTechnologies from '@ohoareau/technologies-detector';
import IBehaviour from "./IBehaviour";
import IInitializer from "./IInitializer";
import IFinisher from "./IFinisher";

export type BasePackageConfig = {
    name: string,
    description?: string,
    targetDir: string,
    packageType: string,
    sources?: string[],
    files?: {[key: string]: any},
    vars?: {[key: string]: any},
    enabled_features?: string[],
    disabled_features?: string[],
    getAsset?: (type: string, name: string) => any,
    predefinedTargets?: {[key: string]: any}
}

const fs = require('fs');

export abstract class AbstractPackage<C extends BasePackageConfig = BasePackageConfig> implements IPackage {
    public readonly predefinedTargets: {[key: string]: any};
    public readonly packageType: string;
    public readonly name: string;
    public readonly description: string;
    public readonly sources: string[];
    public readonly vars: {[key: string]: any};
    public readonly files: {[key: string]: any};
    public readonly features: any;
    public readonly extraOptions: any;
    public readonly assetFetcher: (type: string, name: string) => any;
    public readonly relativeToRoot: string;
    public readonly absoluteTargetDir: string;
    public dir: string|undefined;
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(config: C, dir: string|undefined = undefined) {
        const {predefinedTargets = {}, getAsset, name, description, packageType, sources = [], files = {}, vars =  {}, enabled_features = [], disabled_features = [], targetDir, ...extra} = config;
        this.predefinedTargets = predefinedTargets;
        this.dir = dir;
        this.assetFetcher = getAsset || ((type: string, name: string) => {
            throw new Error(`Unknown asset '${name}' of type '${type}'`);
        });
        this.name = name;
        this.description = description || name;
        this.packageType = packageType;
        this.sources = sources;
        this.files = files;
        this.absoluteTargetDir = (!targetDir || ('.' === targetDir)) ? process.cwd() : require('path').resolve(targetDir);
        this.relativeToRoot = (!targetDir || ('.' === targetDir)) ? '.' : [...Array((targetDir || '').split('/').length).keys()].map(() => '..').join('/');
        this.vars = {targetDir, relativeToRoot: this.relativeToRoot};
        const [xFeatures, xExtraOptions] = Object.entries(<any>extra).reduce((acc, [k, v]) => {
            if ('boolean' === typeof v) acc[0][k] = v;
            else acc[1][k] = v;
            return acc;
        }, [{}, {}]);
        this.features = {...this.getDefaultFeatures()};
        this.extraOptions = {...this.getDefaultExtraOptions()};
        const {vars: bbVars = {}, features: bbFeatures = {}, extraOptions: bbExtraOptions = {}} = this.getBehaviours().reduce((acc, b) => {
            const {vars: bVars = {}, features: bFeatures = {}, extraOptions: bExtraOptions = {}} = b.build(this);
            Object.assign(acc.vars, bVars);
            Object.assign(acc.features, bFeatures);
            Object.assign(acc.extraOptions, bExtraOptions);
            return acc;
        }, <any>{vars: {}, features: {}, extraOptions: {}});
        Object.assign(this.vars, bbVars, vars);
        Object.assign(this.features, bbFeatures, xFeatures);
        enabled_features.forEach(f => this.features[f] = true);
        disabled_features.forEach(f => this.features[f] = false);
        Object.assign(this.extraOptions, bbExtraOptions, xExtraOptions);
    }
    protected cleanObject(o: undefined|Record<string, unknown>) {
        if (!o) return o;
        return Object.entries(o).filter(([_, b]) => null !== b && undefined !== b).reduce((acc, [a, b]) => Object.assign(acc, {[a]: b}), {} as Record<string, string>);
    }
    public getCustomPluginsByType<T extends object = any>(type: string, defaultValue: T = {} as T): T {
        const customPaths = [
            `${this.absoluteTargetDir}/.genjs/${type}`,
            `${this.absoluteTargetDir}/.genjs/${type.toLowerCase()}`,
            `${this.absoluteTargetDir}/${type}`,
            `${this.absoluteTargetDir}/${type.toLowerCase()}`,
        ];
        const customPath = customPaths.find(d => fs.existsSync(d) || fs.existsSync(`${d}.js`));
        if (!customPath) return defaultValue;
        const value = require(customPath);
        if (!value || ('object' !== typeof value)) return defaultValue;
        return value;
    }
    public getAsset(type: string, name: string) {
        return this.assetFetcher(type, name);
    }
    protected getBehaviours(): IBehaviour[] {
        return [];
    }
    protected getDefaultFeatures(): any {
        return {};
    }
    protected getDefaultExtraOptions(): any {
        return {};
    }
    public getParameter(name: string, defaultValue: any = undefined): any {
        if ('undefined' !== typeof this[name]) return this[name];
        if ('undefined' !== typeof this.vars[name]) return this.vars[name];
        return defaultValue;
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
        return this.dir ? `${this.dir}/../templates` : '_no-template-root_';
    }
    protected async buildFiles(vars: any, cfg: any): Promise<any> {
        const files = Object.entries(await this.buildFilesFromTemplates(vars, cfg)).reduce((acc, [k, v]) => {
            const realK = '?' === k.slice(-1) ? k.slice(0, -1) : k;
            const extraVars = {};
            if (Array.isArray(v)) {
                Object.assign(extraVars, v[1] || {});
                v = v[0] || true;
            }
            acc[k] = ({renderFile}) => renderFile(cfg)(true === v ? `${realK}.ejs` : v, {...vars, ...extraVars});
            return acc;
        }, {});
        Object.assign(files, Object.entries(await this.buildStaticFiles(vars, cfg)).reduce((acc, [k, v]) => {
            const realK = '?' === k.slice(-1) ? k.slice(0, -1) : k;
            acc[k] = (true === v) ? ({copy}) => copy(`${this.getTemplateRoot()}/${realK}`, realK) : v;
            return acc;
        }, {}));
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
    // noinspection JSUnusedLocalSymbols
    protected async buildStaticFiles(vars: any, cfg: any): Promise<any> {
        return {};
    }
    protected getTechnologies(): any {
        return [];
    }
    // noinspection JSUnusedGlobalSymbols
    protected getPreRequisites(): any {
        return {};
    }
    // noinspection JSUnusedGlobalSymbols
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
    protected buildDefaultBehavioursVars(vars: any): any {
        return this.getBehaviours().reduce((acc, b) => {
            return Object.assign(acc, b.buildDynamicVars(this, vars));
        }, {});
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
    protected buildInitializers(dir: string, vars: any = {}): IInitializer[] {
        return [];
    }
    protected buildFinishers(dir: string, vars: any = {}): IFinisher[] {
        return [];
    }
    detectTechnologies(): string[] {
        return detectTechnologies(this.vars.targetDir);
    }
    async hydrate(data: any): Promise<void> {
        populateData(this.vars, data);
        data && data.projectData && populateData(this.vars, data.projectData);
        Object.entries(this.buildDefaultBehavioursVars(this.vars)).forEach(([k, v]) => {
            if ('undefined' !== typeof this.vars[k]) return;
            this.vars[k] = v;
        });
    }
    async initialize(dir: string, vars: any = {}): Promise<void> {
        await this.buildInitializers(dir, vars).reduce(async (acc, initializer) => {
            await acc;
            return initializer.execute(dir, vars);
        }, Promise.resolve());
    }
    async finish(dir: string, vars: any = {}): Promise<void> {
        await this.buildFinishers(dir, vars).reduce(async (acc, finisher) => {
            await acc;
            return finisher.execute(dir, vars);
        }, Promise.resolve());
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
    // noinspection JSUnusedGlobalSymbols
    hasVarsCategoryFeature(vars: any, category: string, feature: string, defaultValue: boolean = false): boolean {
        return this.hasVarsFeature(vars, `${category}_${feature}`, defaultValue);
    }
}

// noinspection JSUnusedGlobalSymbols
export default AbstractPackage
