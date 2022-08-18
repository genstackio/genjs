import Handler, {HandlerConfig} from './Handler';
import Starter, {StarterConfig} from './Starter';
import Microservice, {MicroserviceConfig} from './Microservice';
import {
    AbstractPackage,
    BasePackageConfig,
    GitIgnoreTemplate,
    LicenseTemplate,
    MakefileTemplate,
    ReadmeTemplate,
    PackageExcludesTemplate,
    TerraformToVarsTemplate,
    StartableBehaviour,
    BuildableBehaviour,
    CleanableBehaviour,
    InstallableBehaviour,
    MigratableBehaviour,
    GenerateEnvLocalableBehaviour,
    TestableBehaviour,
    LoggableBehaviour,
} from '@genjs/genjs';
import MicroserviceConfigEnhancer from "./configEnhancers/MicroserviceConfigEnhancer";
import {
    applyDebugMakefileHelper,
    applyDeployMakefileHelper, applyLogMakefileHelper,
    applyMigrateMakefileHelper,
    applyStarterMakefileHelper
} from "@genjs/genjs-bundle-aws-lambda";
import {applyRefreshMakefileHelper} from "@genjs/genjs-bundle-package";
import MicroserviceType from "./MicroserviceType";
import {ModelEnhancer} from "./ModelEnhancer";
import {SchemaGraphqlTemplate} from "./templates/SchemaGraphqlTemplate";

export type PackageConfig = BasePackageConfig & {
    events?: {[key: string]: any[]},
    externalEvents?: {[key: string]: any[]},
    handlers?: {[key: string]: HandlerConfig},
    starters?: {[key: string]: StarterConfig},
    microservices?: {[key: string]: MicroserviceConfig},
};

export default class Package extends AbstractPackage<PackageConfig> {
    public readonly microservices: {[key: string]: Microservice} = {};
    public readonly handlers: {[key: string]: Handler} = {};
    public readonly starters: {[key: string]: Starter} = {};
    public readonly events: {[key: string]: any[]} = {};
    public readonly externalEvents: {[key: string]: any[]} = {};
    public readonly modelEnrichments: {[key: string]: any[]} = {};
    public finalizedModels: {[key: string]: any} = {};
    constructor(config: PackageConfig) {
        super(config);
        const {events = {}, externalEvents = {}, handlers = {}, starters = {}, microservices = {}} = config;
        this.events = events || {};
        this.externalEvents = externalEvents || {};
        const configEnhancer = new MicroserviceConfigEnhancer(this.getAsset.bind(this))
        Object.entries(microservices).forEach(
            ([name, c]: [string, any]) => {
                c = configEnhancer.enrich({...((null === c || undefined === c || !c) ? {} : (('string' === typeof c) ? {type: c} : c))});
                this.microservices[name] = new Microservice(this, {name, ...c});
            }
        );
        const opNames = Object.entries(this.microservices).reduce((acc, [n, m]) =>
                Object.entries(m.types).reduce((acc2, [n2, t]) =>
                        Object.keys(t.operations).reduce((acc3, n3) => {
                            acc3.push(`${n}_${n2}_${n3}`);
                            return acc3;
                        }, acc2)
                    , acc)
            , <string[]>[]);
        Object.keys(handlers).reduce((acc, h) => {
            acc.push(h);
            return acc;
        }, opNames);
        opNames.sort();
        Object.entries(handlers).forEach(
            ([name, c]: [string, any]) => {
                this.handlers[name] = new Handler({name, ...c, directory: name === 'handler' ? undefined : 'handlers', vars: {...(c.vars || {}), operations: opNames, operationDirectory: name === 'handler' ? 'handlers' : undefined}});
                if (!!c.starter) {
                    this.starters[name] = new Starter({name, ...c, envs: c.starter.envs, directory: name === 'handler' ? undefined : 'starters', vars: {...(c.vars || {}), operations: opNames, operationDirectory: name === 'handler' ? 'handlers' : '../handlers'}});
                }
            }
        );
        Object.entries(starters).forEach(
            ([name, c]: [string, any]) =>
                this.starters[name] = new Starter({name, ...c, directory: name === 'starter' ? undefined : 'starters', vars: {...(c.vars || {}), operations: opNames, operationDirectory: name === 'starter' ? 'handlers' : undefined}})
        );
        if (!this.hasStarters()) {
            this.features['startable'] = false;
        }
    }
    registerEventListener(event, listener, priority = 0, deduplicateKey: string|undefined = undefined) {
        this.events[event] = this.events[event] || [];
        (!deduplicateKey || !this.events[event].find(x => x[2] === deduplicateKey)) && this.events[event].push([listener, priority, deduplicateKey]);
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    registerExternalEventListener(event, listener) {
        this.externalEvents[event] = this.externalEvents[event] || [];
        this.externalEvents[event].push(listener);
        return this;
    }
    getEventListeners(event) {
        return this.events[event] || [];
    }
    getSortedEventListeners(event) {
        const x = [...this.getEventListeners(event)];
        x.sort((a, b) => a[1] < b[1] ? 1 : (a[1] > b[1] ? -1 : 0));
        return x.map(x => x[0]);
    }
    // noinspection JSUnusedGlobalSymbols
    getExternalEventListeners(event) {
        return this.externalEvents[event] || [];
    }
    hasStarters(): boolean {
        return 0 < Object.keys(this.starters).length;
    }
    addModelEnrichment(name: string, enrichment: any) {
        return this.addModelEnrichments(name, [enrichment]);
    }
    addModelEnrichments(name: string, enrichments: any[]) {
        this.modelEnrichments[name] = enrichments.reduce((acc0: any, enrichment: any) => {
            return Object.entries(enrichment).reduce((acc: any, [type, value]: [string, any]) => {
                acc[type] = acc[type] || [];
                acc[type].push(value);
                return acc;
            }, acc0);
        }, this.modelEnrichments[name] || {})
        return this;
    }
    protected getBehaviours() {
        return [
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new TestableBehaviour(),
            new StartableBehaviour(),
            new MigratableBehaviour(),
            new LoggableBehaviour(),
        ];
    }
    protected getDefaultExtraOptions(): any {
        return {
            phase: 'pre',
        };
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    protected buildVars(vars: any): any {
        const staticVars = require('../vars.json');
        vars = {...staticVars, ...super.buildVars(vars)};
        vars.scripts = {
            ...staticVars.scripts,
            ...(this.hasFeature('migratable') ? {migrate: 'echo "migrate script not yet implemented in package.json"'}: {}),
            ...(vars.scripts || {}),
        };
        vars.dependencies = {
            ...staticVars.dependencies,
            ...(vars.dependencies || {}),
        };
        vars.devDependencies = {
            ...staticVars.devDependencies,
            ...(vars.devDependencies || {}),
            ...(this.hasStarters() ? {nodemon: '^2.0.4'} : {}),
        };
        return vars;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        const files = (await Promise.all([...Object.values(this.handlers), ...Object.values(this.starters)].map(async h => h.generate(vars)))).reduce((acc, f) => ({...acc, ...f}), {
            ['package.json']: () => JSON.stringify({
                name: vars.name,
                license: vars.license,
                dependencies: vars.dependencies,
                scripts: vars.scripts,
                devDependencies: vars.devDependencies,
                version: vars.version,
                description: vars.description,
                author: (vars.author && ('object' === typeof vars.author)) ? vars.author : {name: vars.author_name, email: vars.author_email},
                private: true,
            }, null, 4),
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['package-excludes.lst']: this.buildPackageExcludes(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
            ...(vars.generate_graphql_schema ? {'schema.graphql': this.buildSchemaGraphqlFile(vars)} : {}),
        });
        const objects: any = (<any[]>[]).concat(
            Object.values(this.microservices),
            Object.values(this.handlers),
            Object.values(this.starters)
        );
        <Promise<any>>(await Promise.all(objects.map(async o => (<any>o).generate(vars)))).reduce(
            (acc, r) => Object.assign(acc, r),
            files
        );
        if (this.events && !!Object.keys(this.events).length) {
            files['models/events.js'] = ({jsStringify}) => `module.exports = ${jsStringify(this.events, 100)};`
        }
        if (this.externalEvents && !!Object.keys(this.externalEvents).length) {
            files['models/externalEvents.js'] = ({jsStringify}) => `module.exports = ${jsStringify(this.externalEvents, 100)};`
        }

        return files;
    }
    protected buildSchemaGraphqlFile(vars: any) {
        return new SchemaGraphqlTemplate(vars)
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars);
    }
    protected buildPackageExcludes(vars: any): PackageExcludesTemplate {
        return PackageExcludesTemplate.create(vars);
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return GitIgnoreTemplate.create(vars)
            .addIgnore('/coverage/')
            .addIgnore('/node_modules/')
            .addIgnore('/.idea/')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const t = new MakefileTemplate({options: {npmClient: vars.npm_client}, predefinedTargets: this.predefinedTargets, relativeToRoot: this.relativeToRoot, makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('env', 'dev')
            .setDefaultTarget('install')
            .addPredefinedTarget('install', 'js-install')
            .addPredefinedTarget('build', 'js-build')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {mode: vars.env_mode || 'terraform'})
            .addMetaTarget('clean', ['clean-modules', 'clean-coverage'], {}, 'Remove all generated directories')
            .addPredefinedTarget('clean-modules', 'clean-node-modules')
            .addPredefinedTarget('clean-coverage', 'clean-coverage')
            .addPredefinedTarget('test', 'js-test', {ci: true, coverage: true})
            .addPredefinedTarget('test-dev', 'js-test', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'js-test', {local: true})
            .addPredefinedTarget('test-ci', 'js-test', {ci: true})
            .addExportedVar('CI')
        ;
        applyDebugMakefileHelper(t, vars, this);
        applyLogMakefileHelper(t, vars, this);
        applyStarterMakefileHelper(t, vars, this);
        applyDeployMakefileHelper(t, vars, this, {predefinedTarget: 'js-deploy'});
        applyMigrateMakefileHelper(t, vars, this);
        applyRefreshMakefileHelper(t, vars, this);

        return t;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
    protected getTechnologies(): any {
        return [
            'microlib',
            'make',
            'aws_cli',
            'aws_lambda',
            'node',
            'es6',
            'yarn',
            'nvm',
            'npm',
            'markdown',
            'git',
            'jest',
            'prettier',
            'json',
            this.vars.publish_image && 'docker',
            this.hasStarters() && 'nodemon',
        ];
    }
    protected async finalizeModels(vars?: any) {
        const me = new ModelEnhancer();
        this.finalizedModels = Object.entries(this.microservices).reduce((acc: any, [name, m]: [string, Microservice]) => {
            return Object.entries(m.types).reduce((acc2: any, [name2, m2]: [string, MicroserviceType]) => {
                const fullName = `${name}_${name2}`;
                acc2[fullName] = me.enhance(fullName, m2.model, this.modelEnrichments[fullName] || undefined, vars);
                return acc2;
            }, acc);
        }, {});
    }
    protected async prepareGenerate(vars?: any): Promise<void> {
        await this.finalizeModels(vars);
    }
    async generate(vars?: any): Promise<{ [p: string]: Function }> {
        await this.prepareGenerate(vars);
        return super.generate(vars);
    }
}