import Service from './Service';
import Handler from './Handler';
import SchemaParser from './SchemaParser';
import Microservice from './Microservice';
import stringifyObject from 'stringify-object';
import {TestFileConfig} from './TestFile';
import MicroserviceTypeOperation, {MicroserviceTypeOperationConfig} from './MicroserviceTypeOperation';
import MicroserviceTypeOperationConfigEnhancer from "./configEnhancers/MicroserviceTypeOperationConfigEnhancer";
import MicroserviceTypeFunctionConfigEnhancer from "./configEnhancers/MicroserviceTypeFunctionConfigEnhancer";
import MicroserviceTypeConfigEnhancer from "./configEnhancers/MicroserviceTypeConfigEnhancer";

export type MicroserviceTypeConfig = {
    type?: string|undefined,
    microservice: Microservice,
    name: string,
    attributes: {[key: string]: any},
    indexes: {[key: string]: any},
    handlers?: any,
    operations?: {[key: string]: MicroserviceTypeOperationConfig},
    functions?: {[key: string]: {args?: any, code?: string}},
    middlewares?: string[],
    backends?: string[] | {type: string, name: string}[],
    test?: TestFileConfig,
    authorizations?: any,
};

export default class MicroserviceType {
    public readonly name: string;
    public readonly operations: {[key: string]: MicroserviceTypeOperation} = {};
    public readonly functions: {[key: string]: {args?: any, code?: string}} = {};
    public readonly model: any;
    public readonly hooks: {[key: string]: any[]} = {};
    public readonly handlers: {[key: string]: Handler} = {};
    public readonly backends: {[key: string]: any};
    public readonly defaultBackendName: string;
    public readonly microservice: Microservice;
    private readonly rawAttributes;
    private readonly rawOperations;
    public readonly test: TestFileConfig|undefined;
    constructor(microservice: Microservice, c: MicroserviceTypeConfig) {
        this.microservice = microservice;
        const configEnhancer = new MicroserviceTypeConfigEnhancer(this.microservice.package.getAsset.bind(this.microservice.package));
        const cfg = c.type ? configEnhancer.enhance(c, c.type) : c;
        let {name, attributes = {}, indexes = {}, operations = {}, functions = {}, middlewares = [], backends = [], handlers = {}, test = undefined, authorizations = undefined, defaultBackendName = undefined} = cfg;
        this.name = `${microservice.name}_${name}`;
        this.rawAttributes = attributes;
        const operationConfigEnhancer = new MicroserviceTypeOperationConfigEnhancer(this.microservice.package.getAsset.bind(this.microservice.package))
        operations = Object.entries(operations).reduce((acc, [k, v]) => {
            let c;
            try {
                c = operationConfigEnhancer.enrich({...((null === v || undefined === v || !v) ? {} : (('string' === typeof v) ? {type: v} : v as any))});
            } catch (e: any) {
                throw new Error(`Unable to prepare operation '${k}' for microservice type ${this.name}: ${e.message}`);
            }
            if (c.wrap) {
                if ('string' === typeof c.wrap) {
                    c.backend = {name: 'raw', value: c.wrap};
                } else if (Array.isArray(c.wrap)) {
                    c.backend = {name: 'this', method: c.as || c.wrap[0], args: c.wrap.slice(1)};
                } else {
                    throw new Error(`Unknown wrap format for microservice '${microservice.name}' type '${name}' and operation '${k}': ${c.wrap}`);
                }
            }
            acc[k] = c;
            return acc;
        }, {});
        this.rawOperations = operations;
        const functionConfigEnhancer = new MicroserviceTypeFunctionConfigEnhancer(this.microservice.package.getAsset.bind(this.microservice.package))
        this.functions = Object.entries(functions).reduce((acc, [k, v]) => {
            try {
                acc[k] = functionConfigEnhancer.enrich(v as any);
                acc[k]['type'] && (acc[k] = functionConfigEnhancer.enhance(acc[k], acc[k]['type']));
            } catch (e: any) {
                throw new Error(`Unable to prepare function '${k}' for microservice type ${this.name}: ${e.message}`);
            }
            return acc;
        }, {});
        this.model = new SchemaParser({fieldTypes: microservice.package.getCustomPluginsByType('fieldTypes')}).parse(
            {name: this.name, attributes, operations, indexes}
            );
        this.backends = (<any>backends).reduce((acc, b) => {
            if ('string' === typeof b) b = {type: 'backend', name: b};
            return Object.assign(acc, {[b.name]: b});
        }, {});
        defaultBackendName = defaultBackendName || [...backends].shift();
        this.defaultBackendName = !defaultBackendName ? undefined : (('string' == typeof defaultBackendName) ? defaultBackendName : defaultBackendName.name);
        this.defaultBackendName && ('@' === this.defaultBackendName.substr(0, 1)) && (this.defaultBackendName = this.defaultBackendName.substr(1));
        this.buildMicroserviceTypeLevelStuff();
        Object.entries(operations).forEach(
            ([name, c]: [string, any]) =>
                this.operations[name] = new MicroserviceTypeOperation(
                    this,
                    {
                        name,
                        ...c,
                        middlewares: [...middlewares, ...(c.middlewares || [])],
                        backend: c.backend || this.defaultBackendName,
                        config: {
                            ...(c.config || {}),
                            authorization: c.config.authorization || (authorizations ? this.findAuthorizationFor(name, authorizations) : undefined) || undefined,
                        }
                    }
                )
        );
        const opNames = Object.keys(this.operations);
        opNames.sort();
        Object.entries(handlers).forEach(
            ([name, c]: [string, any]) =>
                this.handlers[name] = new Handler({name: `${this.name}${'handler' === name ? '' : `_${name}`}`, ...c, directory: 'handlers', vars: {...(c.vars || {}), operations: opNames, prefix: this.name}})
        );
        this.test = test;
    }
    buildMicroserviceTypeLevelStuff() {
        this.registerReferences();
        this.registerStats();
    }
    registerReferences() {
        const references = Object.entries(this.model.referenceFields || {}).reduce((acc: any, [_, v]: [string, any]) => {
            acc[v.reference] = true;
            return acc;
        }, {});

        // referenceFields
        Object.entries(this.model.referenceFields || {}).forEach(([k, v]: [string, any]) => {
            this.enrichTypeModel(
                {
                    reference: {type: `${this.name}`, fields: v.fetchedFields || [], ...((v.fieldTargets && Object.keys(v.fieldTargets).length) ? {fieldTargets: v.fieldTargets} : {}), idField: v.targetIdField || v.idField, join: k},
                },
                `${(<any>v).reference.replace(/\./g, '_')}${/\./.test((<any>v).reference) ? '' : `_${this.microservice.name}`}`,
            );
        });

        Object.keys(references).forEach((r: any) => {
            const prefix = `${r.replace(/\./g, '_')}${/\./.test(r) ? '' : `_${this.microservice.name}`}`;
            this.shortRegisterHook(`${prefix}_update`, '@update-references', undefined, -100, `${prefix}_update_update-references`);
            this.shortRegisterHook(`${prefix}_delete`, '@delete-references', undefined, -100, `${prefix}_update_delete-references`);
        });
    }
    registerStats() {
        const tracks = Object.entries(this.model.statFields || {}).reduce((acc: any, [_, v]: [string, any]) => {
            return (v.track || []).reduce((acc2: any, t: any) => {
                acc2[t.on] = true;
                return acc2;
            }, acc)
        }, {});

        Object.entries(this.model.statFields || {}).forEach(([k, {track = [], type: mode, ...v}]: [string, any]) => {
            (track || []).forEach(({on, ...vv}: any) => {
                this.enrichTypeModel(
                    {
                        stat: {type: this.name, operation: on.split(/_/g).slice(-1).join(''), mode, ...v, ...vv, targetField: k},
                    },
                    on.split(/_/g).slice(0, 2).join('_'),
                );
            })
        });

        Object.keys(tracks).forEach((t: any) => {
            this.shortRegisterHook(t, '@update-stats', undefined, -120, `${t}_update-stats`);
        });
    }
    shortRegisterHook(on: string, type: string, config: any = {}, priority: number|undefined = undefined, deduplicated: boolean|string|undefined = undefined) {
        this.microservice.package.registerEventListener(
            on,
            {type, config},
            priority,
            deduplicated ? (deduplicated === true ? on : deduplicated) : undefined
        );
    }
    enrichTypeModel(enrichment: any, typeName: string|undefined = undefined) {
        this.microservice.package.addModelEnrichment(typeName || this.name, enrichment);
        return this;
    }

    registerHook(operation, type, hook) {
        this.hooks[operation] = this.hooks[operation] || {};
        this.hooks[operation][type] = this.hooks[operation][type] || [];
        this.hooks[operation][type].push('string' === typeof hook ? {type: hook} : hook);
        return this;
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const finalizedModel = this.microservice.package.finalizedModels[this.name] || {};
        vars = {...vars, model: finalizedModel};
        const service = new Service({vars, rootDir: vars.rootDir, name: `crud/${this.name}`, ...this.buildServiceConfig({attributes: this.rawAttributes, operations: this.rawOperations, functions: this.functions, test: this.test})});
        return (await Promise.all(Object.values(this.operations).map(
            async o => o.generate(vars)))).reduce((acc, r) =>
            Object.assign(acc, r),
            {
                ...(await Promise.all(Object.values(this.handlers).map(async h => h.generate(vars)))).reduce((acc, ff) => Object.assign(acc, ff), {}),
                ...(await service.generate({
                    ...vars,
                    params: {m: this.name},
                    initializations: [
                        `const model = require('../../models/${this.name}');`,
                    ],
                })),
                [`models/${this.name}.js`]: ({jsStringify}) => `module.exports = ${jsStringify(finalizedModel, 70)};`,
            }
        );
    }
    buildBackendsVariables() {
        const backends = Object.entries(this.backends);
        backends.sort((a, b) => a[0] < b[0] ? -1 : (a[0] === b[0] ? 0 : -1));
        return backends.reduce((acc, [n, {type, name, realName, ...c}]) => {
            realName = realName || n;
            n = '@' === n.substr(0, 1) ? n.substr(1) : n;
            if ('backend' === type) {
                if ('@' === realName.substr(0, 1)) {
                    const nn = realName.substr(1);
                    acc[n] = {code: `require('@ohoareau/microlib/lib/backends/${nn}').default(model${(c && !!Object.keys(c).length) ? `, ${stringifyObject(c, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true})}` : ''})`};
                } else {
                    acc[n] = {code: `require('../../backends/${realName}')(model${(c && !!Object.keys(c).length) ? `, ${stringifyObject(c, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true})}` : ''})`};
                }
            } else {
                if ('@' === realName.substr(0, 1)) {
                    const nn = realName.substr(1);
                    acc[n] = {code: `require('@ohoareau/microlib/lib/${type}s/${nn}').default`};
                } else {
                    acc[n] = {code: `require('../../${type}s/${realName}')`};
                }
            }
            return acc;
        }, {});
    }
    buildServiceConfig({attributes, operations, functions, test = {}}) {
        functions = Object.entries(functions).reduce((acc, [k, v]) => {
            acc[k] = this.buildServiceFunctionConfig({attributes, name: k, ...<any>v});
            return acc;
        }, {});
        const methods = Object.entries(operations).reduce((acc, [k, v]) => {
            acc[k] = this.buildServiceMethodConfig({attributes, name: k, ...<any>v});
            return acc;
        }, {});
        return {
            variables: {
                model: {code: undefined},
                ...(!!Object.values(methods).find(m => !!(<any>m)['neededUtils'].length) ? {helpers: {code: `require('@ohoareau/microlib').helpers(model, __dirname)`}} : {}),
                ...this.buildBackendsVariables(),
            },
            methods: {...functions, ...methods},
            test: {
                ...test,
                mocks: [...(test['mocks'] || []), ...Object.entries(this.backends).map(([n, {realName, type}]) => {
                    n = realName || n;
                    if ('@' === n.substr(0, 1)) {
                        return `@ohoareau/microlib/lib/${type}s/${n.substr(1)}`;
                    } else {
                        return `../../${type}s/${n}`;
                    }
                })],
                groups: {...(test['groups'] || {}), [this.name]: {
                        name: this.name,
                        tests: [],
                        ...((test['groups'] || {})[this.name] || {}),
                    },
                }
            }
        };
    }
    buildServiceMethodConfig({backend, as, name, vars = {}}) {
        const operationName = `${this.name}_${name}`;
        const listeners = this.microservice.package.getSortedEventListeners(operationName);
        let backendDef = backend || this.defaultBackendName;
        if (backendDef) {
            if ('string' === typeof backendDef) {
                backendDef = {name: backendDef};
            }
            backendDef = {method: as || name, args: ['query'], ...backendDef};
            (backendDef.name && ('@' === backendDef.name.substr(0, 1)) && (backendDef.name = backendDef.name.substr(1)));
        }
        const localRequirements = {};
        const befores = ['init', 'prepopulate', 'pretransform', 'validate', 'populate', 'transform', 'authorize', 'before', 'prepare'].reduce((acc, n) => {
            if (!this.hooks[name]) return acc;
            if (!this.hooks[name][n]) return acc;
            return acc.concat(this.hooks[name][n].map(h => this.buildHookCode(localRequirements, h, {position: 'before', operationName})));
        }, []);
        let afters = ['prerefresh', 'after', 'refresh', 'postpopulate', 'convert', 'latepopulate', 'clean'].reduce((acc, n) => {
            if (!this.hooks[name]) return acc;
            if (!this.hooks[name][n]) return acc;
            return acc.concat(this.hooks[name][n].map(h => this.buildHookCode(localRequirements, h, {position: 'after', operationName})));
        }, []);
        if (listeners.length) {
            listeners.reduce((acc, l) => {
                const hh = this.buildHookCode(localRequirements, l, {position: 'after', operationName});
                if (hh) acc.push(hh);
                return acc;
            }, afters);
        }
        afters = ['notify', 'event', 'end'].reduce((acc, n) => {
            if (!this.hooks[name]) return acc;
            if (!this.hooks[name][n]) return acc;
            return acc.concat(this.hooks[name][n].map(h => this.buildHookCode(localRequirements, h, {position: 'after', operationName})));
        }, afters);
        const needHook = befores.reduce((acc, b) => acc || / hook\(/.test(b), false)
            || afters.reduce((acc, b) => acc || / hook\(/.test(b), <boolean>false)
        ;
        const batchMode = /^batch/.test(name);
        let nonBatchName = name.replace(/^batch/, '');
        nonBatchName = `${nonBatchName.substr(0, 1).toLowerCase()}${nonBatchName.substr(1)}`;
        const neededUtils = [...(needHook ? ['hook'] : []), ...Object.keys(localRequirements)];
        neededUtils.sort();
        const lines = [
            !!neededUtils.length && `    const {${neededUtils.join(', ')}} = service.helpers('${name}');`,
            ...befores,
            (!backendDef && !batchMode && !afters.length) && `    return undefined;`,
            (!!backendDef && !batchMode && !afters.length) && `    return ${this.buildBackendCall({prefix: 'service.', ...backendDef})};`,
            (!backendDef && !batchMode && !!afters.length) && `    let result = undefined;`,
            (!!backendDef && !batchMode && !!afters.length) && `    let result = ${this.buildBackendCall({prefix: 'service.', ...backendDef}, true)};`,
            (batchMode && !afters.length) && `    return Promise.all(data.map(d => service.${nonBatchName}({data: d, ...query})));`,
            (batchMode && !!afters.length) && `    let result = Promise.all(data.map(d => service.${nonBatchName}({data: d, ...query})));`,
            ...afters,
            (!!afters.length) && '    return result;',
        ].filter(x => !!x);
        return {
            needHook,
            neededUtils,
            async: true,
            args: batchMode ? ['{data = [], ...query}'] : ['query'],
            vars,
            code: lines.join("\n"),
        };
    }
    buildServiceFunctionConfig({async = false, vars = {}, args = [], code = ''}) {
        return {
            async,
            args,
            vars,
            code: ((code || '').trim()).split(/\n/g).map(l => `    ${l}`).join("\n"),
        };
    }
    buildBackendCall({prefix, name, method, args, value}, async = false) {
        switch (name) {
            case 'this':
                return `${async ? 'await ' : ''}${prefix}${method}(${args.join(', ')})`;
            case 'mock':
                return value ? `${async ? 'await ' : ''}${value}` : '{}';
            case 'none':
                return value ? `${async ? 'await ' : ''}${value}` : '{}';
            case 'raw':
                return value || '{}';
            default:
                return `${async ? 'await ' : ''}${prefix}${name}.${method}(${args.join(', ')})`;
        }
    }
    mapDataKey(k) {
        switch (k) {
            case '$': return 'data';
            case '%': return 'oldData';
            case '#': return 'user';
            default: return 'data';
        }
    }
    buildDataKeyString(k) {
        const s = this.mapDataKey(k);
        if ('data' === s) return '';
        return `, '${s}'`;
    }
    buildConditionPartCode(condition, requirements) {
        if ('string' === typeof condition) {
            let matches = condition.match(/^\s*(\$)([a-z0-9_]+)\s*\[\s*([a-z0-9_]+|\*)\s*=>\s*([a-z0-9_]+|\*)\s*]\s*$/i);
            if (!matches) {
                matches = condition.match(/^\s*([$%#])([a-z0-9_]+)\s*(=|>|<|<>|!=|%)(.*)$/i);
                if (!matches) {
                    matches = condition.match(/^\s*([$%#])([a-z0-9_]+)$/i);
                    if (!matches) {
                        throw new Error(`Unsupported condition definition: ${condition}`);
                    } else {
                        condition = {
                            type: 'defined',
                            attribute: matches[2],
                            dataKey: matches[1],
                        };
                    }
                } else {
                    const opMap = {'=': 'eq', '>': 'gt', '>=': 'gte', '<': 'lt', '<=': 'lte', '<>': 'ne', '!=': 'ne', '%': 'mod'};
                    condition = {
                        type: opMap[matches[3]] || opMap['eq'],
                        attribute: matches[2],
                        value: matches[4],
                        dataKey: matches[1],
                    };
                }
            } else {
                condition = {
                    type: 'transition',
                    attribute: matches[2],
                    from: matches[3],
                    to: matches[4],
                    dataKey: matches[1],
                };
            }
        } else if ('object' === typeof condition) {
            condition = {type: 'unknown', ...condition};
        } else {
            throw new Error(`Unsupported condition definition format: ${JSON.stringify(condition)}`);
        }
        switch (condition.type) {
            case 'transition':
                requirements['isTransition'] = true;
                return `isTransition('${condition.attribute}', '${condition.from}', '${condition.to}', query)`;
            case 'eq':
                requirements['isEqualTo'] = true;
                return `isEqualTo('${condition.attribute}', '${condition.value}', query${this.buildDataKeyString(condition.dataKey)})`;
            case 'ne':
                requirements['isNotEqualTo'] = true;
                return `isNotEqualTo('${condition.attribute}', '${condition.value}', query${this.buildDataKeyString(condition.dataKey)})`;
            case 'lt':
                requirements['isLessThan'] = true;
                return `isLessThan('${condition.attribute}', ${condition.value}, query${this.buildDataKeyString(condition.dataKey)})`;
            case 'lte':
                requirements['isLessOrEqualThan'] = true;
                return `isLessOrEqualThan('${condition.attribute}', ${condition.value}, query${this.buildDataKeyString(condition.dataKey)})`;
            case 'gt':
                requirements['isGreaterThan'] = true;
                return `isGreaterThan('${condition.attribute}', ${condition.value}, query${this.buildDataKeyString(condition.dataKey)})`;
            case 'gte':
                requirements['isGreaterOrEqualThan'] = true;
                return `isGreaterOrEqualThan('${condition.attribute}', ${condition.value}, query${this.buildDataKeyString(condition.dataKey)})`;
            case 'mod':
                requirements['isModulo'] = true;
                return `isModulo('${condition.attribute}', ${condition.value}, query${this.buildDataKeyString(condition.dataKey)})`;
            case 'defined':
                requirements['isDefined'] = true;
                return `isDefined('${condition.attribute}', query${this.buildDataKeyString(condition.dataKey)})`;
            case 'not-defined':
                requirements['isNotDefined'] = true;
                return `isNotDefined('${condition.attribute}', query${this.buildDataKeyString(condition.dataKey)})`;
            default:
                throw new Error(`Unknown condition type '${condition.type}'`);
        }
    }
    buildConditionCode(ifTrue, ifFalse, requirements) {
        const conditions = <{isTrue: boolean, condition: any}[]>[];
        !!ifTrue && conditions.push({isTrue: true, condition: ifTrue});
        !!ifFalse && conditions.push({isTrue: false, condition: ifFalse});
        return conditions.reduce((acc, {isTrue, condition}) => {
            const r = this.buildConditionPartCode(condition, requirements);
            acc = `${acc ? acc : ''}${isTrue ? '' : '!'}${r} && `;
            return acc;
        }, <any>undefined);
    }
    buildHookCallArgs(args, defaultValue) {
        if (!args) return defaultValue;
        if (Array.isArray(args)) {
            switch (args.length) {
                case 0: return '[]';
                case 1: return args[0];
                default: return `[${args.join(', ')}]`;
            }
        }
        return `${args}`;
    }
    buildHookStatement(call, varName, returnValue) {
        if (returnValue) return `${varName} = ${call}`;
        return call;
    }
    buildHookCode(requirements, {if: condition, ifNot: conditionNot, type, iteratorKey = undefined, ensureKeys = [], trackData = [], config = {}, args = undefined, return: returnValue = true}, options = {}) {
        const opts = {};
        if (iteratorKey) opts['loop'] = iteratorKey;
        if (ensureKeys && !!ensureKeys.length) opts['ensureKeys'] = ensureKeys;
        if (trackData && !!trackData.length) opts['trackData'] = trackData;
        const conditionCode = this.buildConditionCode(condition, conditionNot, requirements);
        let call: string|undefined = undefined;
        if ('@get' === type) return `    ${conditionCode || ''}Object.assign(query, await service.get(query.id, ${this.stringifyForHook(config['fields'] || [], options)}));`;
        const rawOpts = !!Object.keys(opts).length ? `, ${this.stringifyForHook(opts, options)}` : '';
        if ('@lambda/event' === type) {
            requirements['lambdaEvent'] = true;
            return `    ${conditionCode || ''}await lambdaEvent(${this.stringifyForHook(config['arn'], options)}, ${args ? (Array.isArray(args) ? (<any>args).join(', ') : args) : '{}'});`
        }
        if ('@sns/publish' === type) {
            requirements['snsPublish'] = true;
            return `    ${conditionCode || ''}await snsPublish(${this.stringifyForHook(config['topic'], options)}, ${args ? (Array.isArray(args) ? (<any>args).join(', ') : args) : '{}'});`
        }
        if ('%event' === type) {
            requirements['event'] = true;
            return `    ${conditionCode || ''}await event(${this.stringifyForHook(config['name'] || options['operationName'], options)}, result, query);`
        }
        if ('%event:' === type.slice(0, 7)) {
            requirements['event'] = true;
            return `    ${conditionCode || ''}await event(${this.stringifyForHook(type.slice(7), options)}, result, query);`
        }
        if ('%rule' === type) {
            requirements['rule'] = true;
            switch (options['position']) {
                case 'before': return `    ${conditionCode || ''}await rule(${this.stringifyForHook(config['name'], options)}, query);`;
                case 'after': return `    ${conditionCode || ''}await rule(${this.stringifyForHook(config['name'], options)}, result, query);`;
                default: return undefined;
            }
        }
        if ('%rule:' === type.slice(0, 6)) {
            requirements['rule'] = true;
            switch (options['position']) {
                case 'before': return `    ${conditionCode || ''}await rule(${this.stringifyForHook(type.slice(6), options)}, query);`;
                case 'after': return `    ${conditionCode || ''}await rule(${this.stringifyForHook(type.slice(6), options)}, result, query);`;
                default: return undefined;
            }
        }
        if ('@delete-references' === type) {
            requirements['deleteReferences'] = true;
            return `    ${conditionCode || ''}await deleteReferences(result, query);`
        }
        if ('@update-stats' === type) {
            requirements['updateStats'] = true;
            return `    ${conditionCode || ''}await updateStats(result, query);`
        }
        if ('@authorize' === type) {
            requirements['authorize'] = true;
            return `    ${conditionCode || ''}await authorize(query);`;
        }
        if ('@validate' === type) {
            requirements['validate'] = true;
            return `    ${conditionCode || ''}await validate(query${false === config['required'] ? ', false' : ''});`;
        }
        if ('@prepare' === type) {
            requirements['prepare'] = true;
            return `    ${conditionCode || ''}await prepare(query);`;
        }
        if ('@dispatch' === type) {
            requirements['dispatch'] = true;
            return `    ${conditionCode || ''}await dispatch(result, query);`;
        }
        if ('@after' === type) {
            requirements['after'] = true;
            return `    ${conditionCode || ''}await after(result, query);`;
        }
        if ('@dynamics' === type) {
            requirements['dynamics'] = true;
            return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(`await dynamics(result, query${!!config['mode'] ? `, '${config['mode']}'` : ''})`, 'result', returnValue)});` : `${this.buildHookStatement(`await dynamics(result, query${!!config['mode'] ? `, '${config['mode']}'` : ''})`, 'result', returnValue)};`}`;
        }
        if ('@triggers' === type) {
            requirements['triggers'] = true;
            return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(`await triggers(result, query${!!config['mode'] ? `, '${config['mode']}'` : ''})`, 'result', returnValue)});` : `${this.buildHookStatement(`await triggers(result, query${!!config['mode'] ? `, '${config['mode']}'` : ''})`, 'result', returnValue)};`}`;
        }
        if ('@requires' === type) {
            requirements['requires'] = true;
            return `    ${conditionCode || ''}await requires(query${!!config['mode'] ? `, '${config['mode']}'` : ''});`;
        }
        if ('@prefetch' === type) {
            requirements['prefetch'] = true;
            return `    ${conditionCode || ''}await prefetch(query);`;
        }
        if ('@transform' === type) {
            requirements['transform'] = true;
            return `    ${conditionCode || ''}await transform(query);`;
        }
        if ('@pretransform' === type) {
            requirements['pretransform'] = true;
            return `    ${conditionCode || ''}await pretransform(query);`;
        }
        if ('@auto-transitions' === type) {
            requirements['autoTransitions'] = true;
            switch (options['position']) {
                case 'before': return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(`await autoTransitions(query)`, 'query', returnValue)});` : `${this.buildHookStatement(`await autoTransitions(query)`, 'query', returnValue)};`}`;
                case 'after':  return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(`await autoTransitions(result, query)`, 'result', returnValue)});` : `${this.buildHookStatement(`await autoTransitions(result, query)`, 'result', returnValue)};`}`;
                default: return undefined;
            }
        }
        if ('@mutate' === type) {
            requirements['mutate'] = true;
            switch (options['position']) {
                case 'before': return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(`await mutate(query, '${config['type']}'${config['config'] ? `, ${this.stringifyForHook(config['config'], options)}` : ''})`, 'query', returnValue)});` : `${this.buildHookStatement(`await mutate(query, '${config['type']}'${config['config'] ? `, ${this.stringifyForHook(config['config'], options)}` : ''})`, 'query', returnValue)};`}`;
                case 'after':  return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(`await mutate(result, '${config['type']}'${config['config'] ? `, ${this.stringifyForHook(config['config'], options)}` : ''})`, 'result', returnValue)});` : `${this.buildHookStatement(`await mutate(result, '${config['type']}'${config['config'] ? `, ${this.stringifyForHook(config['config'], options)}` : ''})`, 'result', returnValue)};`}`;
                default: return undefined;
            }
        }
        if ('@convert' === type) {
            requirements['convert'] = true;
            return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(`await convert(result, query${!!config['mode'] ? `, '${config['mode']}'` : ''})`, 'result', returnValue)});` : `${this.buildHookStatement(`await convert(result, query${!!config['mode'] ? `, '${config['mode']}'` : ''})`, 'result', returnValue)};`}`;
        }
        if ('@populate' === type) {
            requirements['populate'] = true;
            return `    ${conditionCode || ''}await populate(query${!!config['prefix'] ? `, '${config['prefix']}'` : ''});`;
        }
        if ('@prepopulate' === type) {
            requirements['prepopulate'] = true;
            return `    ${conditionCode || ''}await prepopulate(query${!!config['prefix'] ? `, '${config['prefix']}'` : ''});`;
        }
        if ('@update-references' === type) {
            requirements['updateReferences'] = true;
            return `    ${conditionCode || ''}await updateReferences(result, query);`
        }
        if (!rawOpts && '@operation' === type) {
            requirements['call'] = true;
            return `    ${conditionCode || ''}await call('${config['operation']}', ${this.stringifyForHook(config['params'], options)});`;
        }
        if (!rawOpts && '@operation-result' === type) {
            requirements['call'] = true;
            const cc = `await call('${config['operation']}', ${this.stringifyForHook(config['params'], options)})`;
            switch (options['position']) {
                case 'before': return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(cc, 'query', returnValue)});` : `${this.buildHookStatement(cc, 'query', returnValue)};`}`;
                case 'after':  return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(cc, 'result', returnValue)});` : `${this.buildHookStatement(cc, 'result', returnValue)};`}`;
                default: return undefined;
            }
        }
        if (!rawOpts && '@set' === type) {
            const cc = `${this.stringifyForHook(config['value'], options)}`;
            switch (options['position']) {
                case 'before': return `    ${conditionCode ? `${conditionCode || ''}(query.${config['key']} = ${cc});` : `query.${config['key']} = ${cc};`}`;
                case 'after': return `    ${conditionCode ? `${conditionCode || ''}(result.${config['key']} = ${cc});` : `result.${config['key']} = ${cc};`}`;
                default: return undefined;
            }
        }
        const cfg = (!!Object.keys(config).length || !!rawOpts) ? `, ${this.stringifyForHook(config, options)}` : '';
        switch (options['position']) {
            case 'before':
                call = `await hook('${type}', ${this.buildHookCallArgs(args, 'query')}${cfg}${rawOpts})`;
                break;
            case 'after':
                call = `await hook('${type}', ${this.buildHookCallArgs(args, '[result, query]')}${cfg}${rawOpts})`;
                break;
            default:
                break;
        }
        switch (options['position']) {
            case 'before': return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(call, 'query', returnValue)});` : `${this.buildHookStatement(call, 'query', returnValue)};`}`;
            case 'after':  return `    ${conditionCode ? `${conditionCode || ''}(${this.buildHookStatement(call, 'result', returnValue)});` : `${this.buildHookStatement(call, 'result', returnValue)};`}`;
            default: return undefined;
        }
    }
    stringifyValueForHook(x, {position = undefined}) {
        // noinspection RegExpRedundantEscape
        if (/'\{\{[^{}]+}}'/.test(x)) {
            let a;
            // noinspection RegExpRedundantEscape
            const r = /'\{\{([^{}]+)}}'/;
            let prefix = '';
            switch (<any>position) {
                case 'before': prefix = 'query.'; break;
                case 'after': prefix = 'result.'; break;
                default: break;
            }
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], `${prefix}${a[1]}`);
            }
        }
        // noinspection RegExpRedundantEscape
        if (/'\{q\{[^{}]+}}'/.test(x)) {
            let a;
            // noinspection RegExpRedundantEscape
            const r = /'\{q\{([^{}]+)}}'/;
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], `query.${a[1]}`);
            }
        }
        // noinspection RegExpRedundantEscape
        if (/'\{r\{[^{}]+}}'/.test(x)) {
            let a;
            // noinspection RegExpRedundantEscape
            const r = /'\{r\{([^{}]+)}}'/;
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], `result.${a[1]}`);
            }
        }
        // noinspection RegExpRedundantEscape
        if (/\{\{[^{}]+}}/.test(x)) {
            let a;
            // noinspection RegExpRedundantEscape
            const r = /\{\{([^{}]+)}}/g;
            let prefix = '';
            switch (<any>position) {
                case 'before': prefix = 'query.'; break;
                case 'after': prefix = 'result.'; break;
                default: break;
            }
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], `\${${prefix}${a[1]}}`);
            }
            x = `\`${x.substr(1, x.length - 2)}\``;
        }
        if (/'%[a-z0-9_]+'/i.test(x)) {
            let a;
            const r = /'%([a-z0-9]+)'/i;
            let prefix = 'query[\'oldData\'].';
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], `${prefix}${a[1]}`);
            }
        }
        if (/'#[a-z0-9_]+'/i.test(x)) {
            let a;
            const r = /'#([a-z0-9]+)'/i;
            let prefix = 'query.user.';
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], `${prefix}${a[1]}`);
            }
        }
        if (/'\$[a-z0-9_]+'/i.test(x)) {
            let a;
            const r = /'\$([a-z0-9]+)'/i;
            let prefix = '';
            switch (<any>position) {
                case 'before': prefix = 'query.data.'; break;
                case 'after': prefix = 'result.'; break;
                default: break;
            }
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], `${prefix}${a[1]}`);
            }
        }
        if (/'\[\[process.env.[^{}]+]]'/.test(x)) {
            let a;
            const r = /'\[\[(process.env.[^{}]+)]]'/;
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], a[1]);
            }
        }
        if (/'\[\[now]]'/.test(x)) {
            let a;
            const r = /'\[\[now]]'/;
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], 'new Date().valueOf()');
            }
        }
        if (/'\[\[result]]'/.test(x)) {
            let a;
            const r = /'\[\[result]]'/;
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], 'result');
            }
        }
        if (/'\[\[query]]'/.test(x)) {
            let a;
            const r = /'\[\[query]]'/;
            while ((a = r.exec(x)) !== null) {
                x = x.replace(a[0], 'query');
            }
        }
        return x;
    }
    stringifyForHook(o, options) {
        if ('string' === typeof o) return this.stringifyValueForHook(`'${o}'`, options);
        return stringifyObject(o, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true, transform: (obj, prop, originalResult) => {
            return this.stringifyValueForHook(originalResult, options);
        }});
    }
    private findAuthorizationFor(name, authorizations = {}) {
        const x = Object.keys(authorizations).find(a => {
            if (name === a) return true;
            if (a.includes('*')) {
                if ('^' !== a.slice(0, 1)) {
                    a = `^${a.replace(/\*/g, '.*')}$`;
                }
                return new RegExp(a).test(name);
            }
            if ('^' === a.slice(0, 1)) {
                return new RegExp(a).test(name);
            }
            return false;
        });
        return x ? authorizations[x] : undefined;
    }
}