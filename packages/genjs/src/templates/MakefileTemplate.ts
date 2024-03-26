import AbstractFileTemplate from '../AbstractFileTemplate';

export interface TargetConfigBase {
    name: string,
    steps?: string[],
    deps?: string[],
    description?: string,
    options?: any,
}

export interface ShellTargetConfig extends TargetConfigBase {
    script: string,
}

export interface MetaTargetConfig extends TargetConfigBase {
}

export interface SubTargetConfig extends TargetConfigBase {
    dir: string,
    sub: string,
    vars?: any,
}

export interface PredefinedTargetConfig extends TargetConfigBase {
    type: string,
}

export type TargetConfig = ShellTargetConfig | MetaTargetConfig | SubTargetConfig | PredefinedTargetConfig;

export type GlobalVarConfig = {
    name: string,
    defaultValue?: any,
    value?: any,
};

export type ExportedVarConfig = {
    name: string,
    value?: string
};

export type DefineConfig = {
    name: string,
    code: string,
};

export type MakefileTemplateConfig = {
    predefinedTargets?: {[key: string]: any},
    makefile?: boolean,
    targets?: {[name: string]: Omit<ShellTargetConfig, 'name'> | Omit<MetaTargetConfig, 'name'> | Omit<SubTargetConfig, 'name'> | Omit<PredefinedTargetConfig, 'name'>},
    globals?: {[name: string]: Omit<GlobalVarConfig, 'name'>},
    exports?: {[name: string]: Omit<ExportedVarConfig, 'name'>},
    defines?: {[name: string]: Omit<DefineConfig, 'name'>},
    relativeToRoot?: string,
    defaultTarget?: string,
    options?: {[key: string]: any},
};

export class MakefileTemplate extends AbstractFileTemplate {
    private targets: any[] = [];
    private readonly predefinedTargets: {[key: string]: any};
    private globalVars: any[] = [];
    private defines: any[] = [];
    private exportedVars: any[] = [];
    private customConfig: MakefileTemplateConfig;
    private customConsumed: boolean;
    private readonly relativeToRoot: string;
    private readonly options: any;
    private defaultTarget: string|undefined;
    constructor(config: MakefileTemplateConfig = {predefinedTargets: {}, targets: {}, globals: {}, exports: {}, defines: {}, relativeToRoot: '..', options: {}}) {
        super();
        this.predefinedTargets = config.predefinedTargets || {};
        this.customConsumed = false;
        this.customConfig = config;
        this.relativeToRoot = config.relativeToRoot || '..';
        this.options = config.options;
        config.defaultTarget && this.setDefaultTarget(config.defaultTarget);
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return 'Makefile.ejs';
    }
    isIgnored(): boolean {
        return false === this.customConfig.makefile;
    }
    addTargetFromConfig(config: TargetConfig): this {
        switch (true) {
            case (config as ShellTargetConfig).script !== undefined:
                const c0: ShellTargetConfig = <ShellTargetConfig>config;
                return this.addShellTarget(c0.name, c0.script, c0.deps, c0.options, c0.description);
            case (config as SubTargetConfig).sub !== undefined:
                const c1: SubTargetConfig = <SubTargetConfig>config;
                return this.addSubTarget(c1.name, c1.dir, c1.sub, c1.vars, c1.deps, c1.options, c1.description);
            case (config as PredefinedTargetConfig).type !== undefined:
                const c2: PredefinedTargetConfig = <PredefinedTargetConfig>config;
                return this.addPredefinedTarget(c2.name, c2.type, c2.options, c2.steps, c2.deps, c2.description);
            case (config as MetaTargetConfig).deps !== undefined && (!config.steps || !config.steps?.length):
                const c3: MetaTargetConfig = <MetaTargetConfig>config;
                return this.addMetaTarget(c3.name, c3.deps, c3.options, c3.description);
            default:
                return this.addTarget(config.name, config.steps, config.deps, config.options, config.description);
        }
    }
    addGlobalVarFromConfig(config: GlobalVarConfig): this {
        return this.addGlobalVar(config.name, config.defaultValue, config.value);
    }
    addExportedVarFromConfig(config: ExportedVarConfig): this {
        return this.addExportedVar(config.name, config.value);
    }
    addExportedVars(configs: (ExportedVarConfig|string|undefined|false)[]): this {
        configs.forEach(v => {
            if (!v) return;
            if ('string' === typeof v) this.addExportedVar(v as string);
            else this.addExportedVarFromConfig(v as ExportedVarConfig);
        });
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    addDefineFromConfig(config: DefineConfig): this {
        return this.addDefine(config.name, config.code);
    }
    getVars() {
        if (!this.customConsumed) {
            Object.entries(this.customConfig.targets || {}).forEach(([name, targetConfig]) => {
                // noinspection SuspiciousTypeOfGuard
                ('string' === typeof targetConfig) && (targetConfig = {steps: [targetConfig]});
                this.addTargetFromConfig({name, ...targetConfig});
            });
            Object.entries(this.customConfig.globals || {}).forEach(([name, globalVarConfig]) => {
                // noinspection SuspiciousTypeOfGuard
                ('string' === typeof globalVarConfig) && (globalVarConfig = {defaultValue: [globalVarConfig]});
                this.addGlobalVarFromConfig({name, ...globalVarConfig});
            });
            Object.entries(this.customConfig.exports || {}).forEach(([name, exportedVarConfig]) => {
                this.addExportedVarFromConfig({name, ...exportedVarConfig});
            });
            this.customConsumed = true;
        }
        const nameSorter = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
        const targetGroups = Object.entries(this.targets.reduce((acc, t) => {
            const groupName = this.buildTargetGroupName(t);
            if (!acc[groupName]) {
                acc[groupName] = {targets: {}};
            }
            acc[groupName].targets[t.name] = t;
            return acc;
        }, {})).map(([name, data]) => ({name, ...<any>data}));
        targetGroups.sort(nameSorter);
        targetGroups.forEach(g => {
            g.targets = Object.values(g.targets);
            g.targets.sort(nameSorter);
        });
        const globalVars = Object.values(this.globalVars.reduce((acc, v) => Object.assign(acc, {[v.name]: v}), {})).map((g: any) => ({name: g.name, type: (undefined !== g.defaultValue) ? '?=' : '=', value: g.value || g.defaultValue}));
        const ex = this.exportedVars;
        ex.sort((a, b) => (a && a.name) ? (a.name > b.name ? 1 : ((a.name < b.name) ? -1 : 0)) : 1)
        const exportedVars = Object.values(ex.reduce((acc, v) => Object.assign(acc, {[v.name]: v}), {})).map((g: any) => ({name: g.name, value: g.value}));
        const defines = Object.values(this.defines.reduce((acc, v) => Object.assign(acc, {[v.name]: v}), {})).map((d: any) => ({name: d.name, code: d.code}));
        return {
            globalVars,
            targetGroups,
            exportedVars,
            defines,
            defaultTarget: this.defaultTarget,
            nvmSupport: !!this.options?.nvm_support,
        }
    }
    addTarget(name, steps: string[] = [], dependencies: string[] = [], options: any = {}, description: string|undefined = undefined): this {
        return this.addPredefinedTarget(name, 'generic', options, steps, dependencies, description);
    }
    addNoopTarget(name, dependencies: string[] = [], options: any = {}, description: string|undefined = undefined): this {
        return this.addPredefinedTarget(name, 'generic', options, ['true'], dependencies, description);
    }
    addShellTarget(name, script, dependencies: string[] = [], options: any = {}, description: string|undefined = undefined): this {
        return this.addTarget(name, [`sh ${script}`], dependencies, options, description);
    }
    addMetaTarget(name, dependencies: string[] = [], options: any = {}, description: string|undefined = undefined): this {
        return this.addTarget(name, [], dependencies, options, description);
    }
    addSubTarget(name, dir: string, subName: string, extraVars: any = {}, dependencies: string[] = [], options: any = {}, description: string|undefined = undefined): this {
        return this.addTarget(name, [`${options.sourceEnvLocal ? `set -a && . ${dir}/.env.local && set +a && ` : ''}make -C ${dir}/ ${subName}${this.buildMakeVars(extraVars)}`], dependencies, options, description);
    }
    addGlobalVar(name: string, defaultValue: any = undefined, value: any = undefined): this {
        this.globalVars.push({name, defaultValue, value});
        return this;
    }
    addExportedVar(name: string, value: string|undefined = undefined): this {
        this.exportedVars.push({name, value});
        return this;
    }
    addPredefinedTarget(name: string, type?: string, options: any = {}, extraSteps: string[] = [], extraDependencies: string[] = [], description: string|undefined = undefined): this {
        const tName = `${(type || name).split(/-/g).map(t => `${t.slice(0, 1).toUpperCase()}${t.slice(1)}`).join('')}Target`;
        if (!this.predefinedTargets[tName]) throw new Error(`Unknown predefined target with name ${type || name}`);
        this.targets.push(new this.predefinedTargets[tName]({name, steps: extraSteps, dependencies: extraDependencies, options: {relativeToRoot: this.relativeToRoot, ...this.options, ...options}}, description));
        return this;
    }
    addDefine(name: string, code: string): this {
        this.defines.push({name, code});
        return this;
    }
    setDefaultTarget(name) {
        this.defaultTarget = name;
        return this;
    }
    buildTargetGroupName(target): string {
        return target.name.split('-').slice(0, 1);
    }
    buildMakeVars(vars: any) {
        const t = Object.entries(vars).reduce((acc, [k, v]) => {
            return `${acc || ''}${acc ? ' ' : ''}${k}=${v}`;
        }, '');
        return `${t ? ' ' : ''}${t || ''}`;
    }
}

export default MakefileTemplate