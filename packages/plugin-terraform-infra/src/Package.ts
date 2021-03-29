import {
    AbstractPackage,
    GitIgnoreTemplate,
    LicenseTemplate,
    MakefileTemplate,
    ReadmeTemplate,
    TerraformToVarsTemplate,
} from '@genjs/genjs';

export type environment = {
    name: string,
};

export type layer = {
    name: string,
    type: string,
};

export type model = {
    config?: any,
    environments: environment[],
    layers: layer[],
};

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            project_prefix: 'mycompany',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        const model = this.buildModel(vars, cfg);
        return {
            ...this.buildConfigFileIfNeeded(model, vars, cfg),
            ...this.buildEnvironmentsFiles(model, vars, cfg),
            ...this.buildLayersFiles(model, vars, cfg),
            ...this.buildModulesFiles(model, vars, cfg),
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars)
            .addNamedFragmentsFromTemplateDir(
                `${__dirname}/../templates/readme`,
                [
                    'introduction',
                    'directory-structure',
                    'useful-commands',
                ]
            )
        ;
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return GitIgnoreTemplate.create(vars)
            .addIgnore('*.log')
            .addIgnore('.env*')
            .addIgnore('.DS_Store')
            .addIgnore('.idea/')
            .addIgnore('.terraform/')
            .addIgnore('*.tfplan')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const t = new MakefileTemplate({relativeToRoot: this.relativeToRoot, makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('layer', '"all"')
            .addGlobalVar('layers', '$(shell AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) list-layers)')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addTarget('all')
            .addPredefinedTarget('apply', 'tflayer-apply')
            .addPredefinedTarget('destroy', 'tflayer-destroy')
            .addPredefinedTarget('get', 'tflayer-get')
            .addPredefinedTarget('init', 'tflayer-init')
            .addPredefinedTarget('init-full', 'tflayer-init-full')
            .addPredefinedTarget('init-full-upgrade', 'tflayer-init-full-upgrade')
            .addPredefinedTarget('init-upgrade', 'tflayer-init-upgrade')
            .addPredefinedTarget('list-layers', 'tflayer-list-layers')
            .addPredefinedTarget('plan', 'tflayer-plan')
            .addPredefinedTarget('clean-dirs', 'tflayer-clean-dirs')
            .addPredefinedTarget('refresh', 'tflayer-refresh')
            .addPredefinedTarget('sync', 'tflayer-sync')
            .addPredefinedTarget('sync-full', 'tflayer-sync-full')
            .addPredefinedTarget('update', 'tflayer-update')
            .addPredefinedTarget('generate', 'tfgen')
            .addPredefinedTarget('output', 'tflayer-output')
            .addPredefinedTarget('output-json', 'tflayer-output-json')
            .addPredefinedTarget('outputs', 'outputs')
            .addMetaTarget('provision', ['init', 'sync'])
            .addMetaTarget('provision-full', ['init-full', 'sync-full'])
            .addExportedVars([
                'CI',
                'TF_LOG', 'TF_LOG_PATH', 'TF_INPUT', 'TF_CLI_ARGS', 'TF_DATA_DIR', 'TF_WORKSPACE', 'TF_IN_AUTOMATION',
                'TF_REGISTRY_DISCOVERY_RETRY', 'TF_REGISTRY_CLIENT_TIMEOUT', 'TF_CLI_CONFIG_FILE', 'TF_IGNORE',
                'TF_PLUGIN_CACHE_DIR',
            ])
        ;
        if (vars.disable_delete_terraform_lock_file) {
            t.addPredefinedTarget('lock-providers', 'tflayer-providers-lock');
        } else {
            t.addPredefinedTarget('delete-provider-lock-file', 'tflayer-providers-lock-delete');
            t.addPredefinedTarget('lock-providers-base', 'tflayer-providers-lock');
            t.addMetaTarget('lock-providers', ['delete-provider-lock-file', 'lock-providers-base']);
        }
        return t;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
    protected buildEnvironmentsFiles(model: model, vars: any, cfg: any): {[name: string]: any} {
        if (!this.hasVarsCategoryFeature(vars, 'infra', 'environments')) return {
            ['environments/.gitkeep']: () => '',
        };
        return model.environments.reduce((acc, e) =>
            Object.assign(acc, this.buildEnvironmentFiles(e, model, vars, cfg))
        , {});
    }
    protected buildLayersFiles(model: model, vars: any, cfg: any): {[name: string]: any} {
        if (!(model.layers || []).find(l => !!l.type)) return {
            ['layers/.gitkeep']: () => '',
        };
        return model.layers.reduce((acc, l) =>
            Object.assign(acc, this.buildLayerFiles(l, model, vars, cfg))
        , {});
    }
    protected buildModulesFiles(model: model, vars: any, cfg: any): {[name: string]: any} {
        if (!this.hasVarsCategoryFeature(vars, 'infra', 'modules')) return {
            ['modules/.gitkeep']: () => '',
        };
        return model.layers.reduce((acc, l) =>
            Object.assign(acc, this.buildModuleFilesFromLayer(l, model, vars, cfg))
        , {});
    }
    protected buildEnvironmentFiles(environment: environment, model: model, vars: any, cfg: any): any {
        if (!this.hasVarsCategoryFeature(vars, 'infra', `environment_${environment.name}`, true)) {
            return {}
        }
        return {};
    }
    protected buildLayerFiles(layer: layer, model: model, vars: any, cfg: any): any {
        if (!layer || !layer.type) return {};
        return {
            [`layers/${layer.name}.tmpl.tf`]: this.buildLayerTemplateFile(layer, model, vars, cfg),
        };
    }
    protected buildLayerTemplateFile(layer: layer, model: model, vars: any, cfg: any): Function {
        let layerType: Function = () => ({});
        try {
            layerType = require(`${__dirname}/layer-types/${layer.type}`).default;
        } catch (e) {
            throw new Error(`Unable to load layer type '${layer.type}'`);
        }
        const def = layerType(layer, vars, cfg, model);
        const components = [...(layer['components'] || []), ...(def['components'] || [])];
        const x = components.reduce((acc, c) => {
            const {type, ...componentDef} = c;
            let componentType: Function = () => ({});
            try {
                componentType = require(`${__dirname}/layer-components/${type}`).default;
            } catch (e) {
                throw new Error(`Unable to load layer component type '${type}' for layer ${layer.name} of type '${layer.type}'`);
            }
            const d = {providers: [], remoteStates: {}, modules: {}, outputs: {}, ...componentType(componentDef)};
            acc.providers = [...acc.providers, ...d.providers];
            acc.remoteStates = {...acc.remoteStates, ...d.remoteStates};
            acc.modules = {...acc.modules, ...d.modules};
            acc.outputs = {...acc.outputs, ...d.outputs};
            return acc;
        }, {modules: [], outputs: [], providers: [], remoteStates: []})
        const definition = {
            ...def,
            ...x,
            providers: [...(def.providers || []), ...(x.providers || [])],
            remoteStates: Object.entries({...(def.remoteStates || {}), ...(x.remoteStates || {})}).reduce((acc, [k, v]) => {
                acc.push({name: k, ...(v as any)});
                return acc;
            }, <any[]>[]),
            modules: Object.entries({...(def.modules || {}), ...(x.modules || {})}).reduce((acc, [k, v]) => {
                acc.push({name: k, ...(v as any)});
                return acc;
            }, <any[]>[]),
            outputs: Object.entries({...(def.outputs || {}), ...(x.outputs || {})}).reduce((acc, [k, v]) => {
                acc.push({name: k, ...(v as any)});
                return acc;
            }, <any[]>[]),
        };
        return ({renderFile}) => renderFile(cfg)('layer.tmpl.tf.ejs', {...vars, ...definition});
    }
    protected buildModuleFilesFromLayer(layer: layer, model: model, vars: any, cfg: any): any {
        if (!this.hasVarsCategoryFeature(vars, 'infra', `module_${layer.name}`, true)) {
            return {}
        }
        return {
            [`modules/${layer.name}/main.tf`]: ({renderFile}) => renderFile(cfg)(`modules/${layer.name}/main.tf.ejs`, vars),
            [`modules/${layer.name}/outputs.tf`]: ({renderFile}) => renderFile(cfg)(`modules/${layer.name}/outputs.tf.ejs`, vars),
            [`modules/${layer.name}/variables.tf`]: ({renderFile}) => renderFile(cfg)(`modules/${layer.name}/variables.tf.ejs`, vars),
        };
    }
    protected buildConfigFileIfNeeded(model: model, vars: any, cfg: any): {[name: string]: any} {
        return model.config ? {
            ['config.json']: JSON.stringify(model.config, null, 4),
        } : {};
    }
    protected buildModel(vars: any, cfg: any): model {
        const config = {
            common: {},
            layers: {},
            environments: {},
        };
        if (vars.common) {
            config.common = vars.common || {};
        }
        if (vars.environments) {
            config.environments = Object.entries(vars.environments).reduce((acc, [k, v]) => Object.assign(acc, {[k]: (<any>v).vars || {}}), {});
        }
        if (vars.layers) {
            config.layers = Object.entries(vars.layers).reduce((acc, [k, v]) => Object.assign(acc, {[k]: v || {}}), {});
        }
        return {
            environments: Object.entries(vars.environments || {}).reduce((acc, [k, v]) => [...acc, {name: k, ...<any>v}], <environment[]>[]),
            layers: Object.entries(vars.layers || {}).reduce((acc, [k, v]) => [...acc, {name: k, type: undefined, ...<any>v}], <layer[]>[]),
            config: (0 < Object.keys(config.environments).length) ? config : undefined,
        };
    }
    protected getTechnologies(): any {
        return [
            'make',
            'aws_cli',
            'markdown',
            'git',
            'jest',
            'prettier',
            'json',
            'terraform',
            'terraform_cloud',
            'tfenv',
        ];
    }
}