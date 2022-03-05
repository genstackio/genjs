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
    applyDeployMakefileHelper,
    applyMigrateMakefileHelper,
    applyStarterMakefileHelper
} from "@genjs/genjs-bundle-aws-lambda";
import {applyRefreshMakefileHelper} from "@genjs/genjs-bundle-package";
import MicroserviceType from "./MicroserviceType";

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
        (!deduplicateKey || !this.events[event].find(x => x[2])) && this.events[event].push([listener, priority, deduplicateKey]);
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
        if (this.hasFeature('loggable')) {
            t.addPredefinedTarget('log', 'aws-logs-tail', {group: vars.log_group || `/aws/lambda/$(env)-${vars.name}`, follow: true});
        }
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
    protected buildFinalizedModel(name: string, baseModel: any, enrichments: any) {
        let m = {...baseModel};
        m = this.buildFinalizedModelReferences(m, enrichments);
        m = this.buildFinalizedModelDefaultValues(m, enrichments);
        m = this.buildFinalizedModelFields(m, enrichments);
        m = this.buildFinalizedModelIndexes(m, enrichments);
        m = this.buildFinalizedModelPrivateFields(m, enrichments);
        m = this.buildFinalizedModelRefAttributeFields(m, enrichments);
        m = this.buildFinalizedModelReferenceFields(m, enrichments);
        m = this.buildFinalizedModelRequiredFields(m, enrichments);
        m = this.buildFinalizedModelRequires(m, enrichments);
        m = this.buildFinalizedModelAuthorizers(m, enrichments);
        m = this.buildFinalizedModelMutators(m, enrichments);
        m = this.buildFinalizedModelPretransformers(m, enrichments);
        m = this.buildFinalizedModelConverters(m, enrichments);
        m = this.buildFinalizedModelUpdateValues(m, enrichments);
        m = this.buildFinalizedModelValidators(m, enrichments);
        m = this.buildFinalizedModelValues(m, enrichments);
        m = this.buildFinalizedModelDynamics(m, enrichments);
        m = this.buildFinalizedModelStatFields(m, enrichments);
        m = this.buildFinalizedModelTransformers(m, enrichments);
        m = this.buildFinalizedModelCascadeValues(m, enrichments);
        m = this.buildFinalizedModelOwnedReferenceListFields(m, enrichments);
        m = this.buildFinalizedModelUpdateDefaultValues(m, enrichments);
        m = this.buildFinalizedModelAutoTransitionTo(m, enrichments);
        m = this.buildFinalizedModelMultiRefAttributeTargetFields(m, enrichments);
        m = this.sortObject(m);
        return m;
    }
    protected sortObject(o: any) {
        const keys = Object.keys(o);
        keys.sort();
        return keys.reduce((acc: any, k: string) => Object.assign(acc, {[k]: o[k]}), {});
    }
    protected cleanObjectKeyIfEmpty(o: any, key: string, mode: string = 'default') {
        if ('undefined' === typeof o[key]) return o;
        if (!o[key] || !Object.keys(o[key]).length) delete o[key];
        switch (mode) {
            case 'object':
                if (0 === Object.entries(o[key] || {}).reduce((acc: number, [_, v]: [string, any]) => {
                    return acc + Object.keys(v).length;
                }, 0)) {
                    delete o[key];
                }
                break;
            case 'array':
                if (0 === Object.entries(o[key] || {}).reduce((acc: number, [_, v]: [string, any]) => {
                    return acc + v.length;
                }, 0)) {
                    delete o[key];
                }
                break;
            default:
                break;
        }
        return o;
    }
    protected buildFinalizedModelDefaultValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'defaultValues');
        m.defaultValues && (m.defaultValues = this.sortObject(m.defaultValues));
        return m;
    }
    protected buildFinalizedModelFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'fields');
        m.fields && (m.fields = this.sortObject(m.fields));
        return m;
    }
    protected buildFinalizedModelPrivateFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'privateFields');
        m.privateFields && (m.privateFields = this.sortObject(m.privateFields));
        return m;
    }
    protected buildFinalizedModelIndexes(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'indexes', 'array');
        m.indexes && (m.indexes = this.sortObject(m.indexes));
        return m;
    }
    protected buildFinalizedModelRefAttributeFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'refAttributeFields', 'array');
        m.refAttributeFields && (m.refAttributeFields = this.sortObject(m.refAttributeFields));
        return m;
    }
    protected buildFinalizedModelReferenceFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'referenceFields');
        m.referenceFields && (m.referenceFields = this.sortObject(m.referenceFields));
        return m;
    }
    protected buildFinalizedModelRequiredFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'requiredFields');
        m.requiredFields && (m.requiredFields = this.sortObject(m.requiredFields));
        return m;
    }
    protected buildFinalizedModelUpdateValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'updateValues');
        m.updateValues && (m.updateValues = this.sortObject(m.updateValues));
        return m;
    }
    protected buildFinalizedModelValidators(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'validators', 'array');
        m.validators && (m.validators = this.sortObject(m.validators));
        return m;
    }
    protected buildFinalizedModelValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'values');
        m.values && (m.values = this.sortObject(m.values));
        return m;
    }
    protected buildFinalizedModelDynamics(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'dynamics');
        m.dynamics && (m.dynamics = this.sortObject(m.dynamics));
        return m;
    }
    protected buildFinalizedModelStatFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'statFields');
        m.statFields && (m.statFields = this.sortObject(m.statFields));
        return m;
    }
    protected buildFinalizedModelTransformers(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'transformers', 'array');
        m.transformers && (m.transformers = this.sortObject(m.transformers));
        return m;
    }
    protected buildFinalizedModelCascadeValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'cascadeValues');
        m.cascadeValues && (m.cascadeValues = this.sortObject(m.cascadeValues));
        return m;
    }
    protected buildFinalizedModelOwnedReferenceListFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'ownedReferenceListFields');
        m.ownedReferenceListFields && (m.ownedReferenceListFields = this.sortObject(m.ownedReferenceListFields));
        return m;
    }
    protected buildFinalizedModelUpdateDefaultValues(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'updateDefaultValues');
        m.updateDefaultValues && (m.updateDefaultValues = this.sortObject(m.updateDefaultValues));
        return m;
    }
    protected buildFinalizedModelAutoTransitionTo(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'autoTransitionTo');
        m.autoTransitionTo && (m.autoTransitionTo = this.sortObject(m.autoTransitionTo));
        return m;
    }
    protected buildFinalizedModelMultiRefAttributeTargetFields(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'multiRefAttributeTargetFields', 'array');
        m.multiRefAttributeTargetFields && (m.multiRefAttributeTargetFields = this.sortObject(m.multiRefAttributeTargetFields));
        return m;
    }
    protected buildFinalizedModelConverters(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'converters', 'array');
        m.converters && (m.converters = this.sortObject(m.converters));
        return m;
    }
    protected buildFinalizedModelRequires(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'requires', 'array');
        m.requires && (m.requires = this.sortObject(m.requires));
        return m;
    }
    protected buildFinalizedModelMutators(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'mutators', 'array');
        m.mutators && (m.mutators = this.sortObject(m.mutators));
        return m;
    }
    protected buildFinalizedModelPretransformers(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'pretransformers', 'array');
        m.pretransformers && (m.pretransformers = this.sortObject(m.pretransformers));
        return m;
    }
    protected buildFinalizedModelAuthorizers(m: any, enrichments: any) {
        m = this.cleanObjectKeyIfEmpty(m, 'authorizers', 'array');
        m.authorizers && (m.authorizers = this.sortObject(m.authorizers));
        return m;
    }
    protected buildFinalizedModelReferences(m: any, enrichments: any) {
        if (!enrichments?.reference) return m;
        m.prefetchs = enrichments.reference.reduce((acc: any, ref: any) => {
            acc['update'] = ref.fields.reduce((acc2: any, field: string) => {
                acc2[field] = true;
                return acc2;
            }, {...(acc['update'] || {})});
            return acc;
        }, {...(m.prefetchs || {})});
        this.cleanObjectKeyIfEmpty(m, 'prefetchs', 'object');
        m.prefetchs && (m.prefetchs = this.sortObject(m.prefetchs));
        return m;
    }
    protected async finalizeModels() {
        this.finalizedModels = Object.entries(this.microservices).reduce((acc: any, [name, m]: [string, Microservice]) => {
            return Object.entries(m.types).reduce((acc2: any, [name2, m2]: [string, MicroserviceType]) => {
                const fullName = `${name}_${name2}`;
                acc2[fullName] = this.buildFinalizedModel(fullName, m2.model, this.modelEnrichments[fullName] || undefined);
                return acc2;
            }, acc);
        }, {});
    }
    protected async prepareGenerate(vars?: any): Promise<void> {
        await this.finalizeModels();
    }
    async generate(vars?: any): Promise<{ [p: string]: Function }> {
        await this.prepareGenerate(vars);
        return super.generate(vars);
    }
}