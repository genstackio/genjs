import YAML from 'yaml';
import IConfigEnhancer from './IConfigEnhancer';
import ejs from 'ejs';

export abstract class AbstractConfigEnhancer implements IConfigEnhancer {
    private readonly assetFetcher: Function;
    private readonly group: string;
    private readonly location: string;
    private readonly options: any;
    protected constructor(getAsset: Function, group: string, location: string, options: any = {}) {
        this.assetFetcher = getAsset;
        this.group = group;
        this.location = location;
        this.options = {parseType: true, ...options};
    }
    enrich(v: any): any {
        let c = v;
        if (this.options.parseType) {
            const [a, b] = this.enhanceConfig(this.location, ...this.parseTypeAndConfigFromRawValue(v));
            c = this.merge(a, b);
        }
        const d = (c.mixins || []).reduce((acc, m) => {
            let [asset, cfg] = this.enhanceConfig(`${this.location}-mixin`, ...this.parseTypeAndConfigFromRawValue(m))
            if (!!Object.keys(cfg.vars || {}).length) {
                const {attributesPrefix: vAttributesPrefix, operationsPrefix: vOperationsPrefix, functionsPrefix: vFunctionsPrefix, attributesSuffix: vAttributesSuffix, operationsSuffix: vOperationsSuffix, functionsSuffix: vFunctionsSuffix, attributes: vAttributes, operations: vOperations, functions: vFunctions, vars: vVars} = Object.entries(cfg.vars).reduce((acc, [k, v]: [string, any]) => {
                    if ('_attributes' === k) {
                        acc.attributes = v;
                    } else if ('_attributesPrefix' === k) {
                        acc.attributesPrefix = v;
                    } else if ('_attributesSuffix' === k) {
                        acc.attributesSuffix = v;
                    } else if ('_operations' === k) {
                        acc.operations = v;
                    } else if ('_operationsPrefix' === k) {
                        acc.operationsPrefix = v;
                    } else if ('_operationsSuffix' === k) {
                        acc.operationsSuffix = v;
                    } else if ('_functions' === k) {
                        acc.functions = v;
                    } else if ('_functionsPrefix' === k) {
                        acc.functionsPrefix = v;
                    } else if ('_functionsSuffix' === k) {
                        acc.functionsSuffix = v;
                    } else {
                        acc.vars[k] = v;
                    }
                    return acc;
                }, {attributesPrefix: undefined, operationsPrefix: undefined, functionsPrefix: undefined, attributesSuffix: undefined, operationsSuffix: undefined, functionsSuffix: undefined, attributes: {}, operations: {}, functions: {}, vars: {}} as {attributesPrefix?: string, operationsPrefix?: string, functionsPrefix?: string, attributesSuffix?: string, operationsSuffix?: string, functionsSuffix?: string, attributes: Record<string, string>, operations: Record<string, string>, functions: Record<string, string>, vars: Record<string, any>});
                asset = (!vAttributesPrefix || !asset?.attributes) ? asset : Object.entries(asset.attributes).reduce((acc, [k, v]) => {
                    acc.attributes[`${vAttributesPrefix}${k.slice(0, 1).toUpperCase()}${k.slice(1)}`] = v;
                    delete acc.attributes[k];
                    return acc;
                }, asset);
                asset = (!vAttributesSuffix || !asset?.attributes) ? asset : Object.entries(asset.attributes).reduce((acc, [k, v]) => {
                    acc.attributes[`${k}${vAttributesSuffix.slice(0, 1).toUpperCase()}${vAttributesSuffix.slice(1)}`] = v;
                    delete acc.attributes[k];
                    return acc;
                }, asset);
                asset = (!vOperationsPrefix || !asset?.operations) ? asset : Object.entries(asset.operations).reduce((acc, [k, v]) => {
                    acc.operations[`${vOperationsPrefix}${k.slice(0, 1).toUpperCase()}${k.slice(1)}`] = v;
                    delete acc.operations[k];
                    return acc;
                }, asset);
                asset = (!vOperationsSuffix || !asset?.operations) ? asset : Object.entries(asset.operations).reduce((acc, [k, v]) => {
                    acc.operations[`${k}${vOperationsSuffix.slice(0, 1).toUpperCase()}${vOperationsSuffix.slice(1)}`] = v;
                    delete acc.operations[k];
                    return acc;
                }, asset);
                asset = (!vFunctionsPrefix || !asset?.functions) ? asset : Object.entries(asset.functions).reduce((acc, [k, v]) => {
                    acc.functions[`${vFunctionsPrefix}${k.slice(0, 1).toUpperCase()}${k.slice(1)}`] = v;
                    delete acc.functions[k];
                    return acc;
                }, asset);
                asset = (!vFunctionsSuffix || !asset?.functions) ? asset : Object.entries(asset.functions).reduce((acc, [k, v]) => {
                    acc.functions[`${k}${vFunctionsSuffix.slice(0, 1).toUpperCase()}${vFunctionsSuffix.slice(1)}`] = v;
                    delete acc.functions[k];
                    return acc;
                }, asset);
                asset = Object.entries(vAttributes).reduce((acc, [k, v]: [string, string]) => {
                    if ((!asset?.attributes || {})[k]) return acc;
                    acc.attributes[v] = acc.attributes[k];
                    delete acc.attributes[k];
                    return acc;
                }, asset);
                asset = Object.entries(vOperations).reduce((acc, [k, v]: [string, string]) => {
                    if ((!asset?.operations || {})[k]) return acc;
                    acc.operations[v] = acc.operations[k];
                    delete acc.operations[k];
                    return acc;
                }, asset);
                asset = Object.entries(vFunctions).reduce((acc, [k, v]: [string, string]) => {
                    if ((!asset?.functions || {})[k]) return acc;
                    acc.functions[v] = acc.functions[k];
                    delete acc.functions[k];
                    return acc;
                }, asset);
                asset = this.replaceVarsRecursive(asset, vVars);
            }
            return this.merge(acc, this.merge(asset, cfg));
        }, {});
        return this.merge(d, c);
    }
    protected replaceVarsRecursive(data: any, vars: any) {
        if (!data) return data;
        if ('string' === typeof data) return ejs.render(data, vars);
        if ('boolean' === typeof data) return data;
        if ('number' === typeof data) return data;
        if ('object' === typeof data) {
            if (Array.isArray(data)) return data.map(x => this.replaceVarsRecursive(x, vars));
            return Object.entries(data).reduce((acc, [k, v]) => {
                acc[this.replaceVarsRecursive(k, vars)] = this.replaceVarsRecursive(v, vars);
                return acc;
            }, {});
        }
        return data;
    }
    enhance(c: any, type: string) {
        const [asset, cfg] = this.enhanceConfig(this.location, ...this.parseConfigType(c, type));
        return this.merge(asset, cfg);
    }
    protected abstract merge(a: any, b: any);
    // noinspection JSUnusedGlobalSymbols
    protected enhanceConfig(location, type: string|undefined, cfg: any|undefined = {}) {
        cfg = cfg || {};
        if (type) {
            const [rawType, ...mixins] = type.split(/\s*\+\s*/g);
            type = rawType;
            cfg.mixins = this.mergeMixins(cfg.mixins || [], mixins);
        }
        const asset = type ? this.assetFetcher(this.group, `${location}/${type}`) : {};
        cfg.vars = this.prepareVarsFromAssetInputs(cfg.vars || {} , asset.inputs || {});
        return [asset, cfg];
    }
    protected mergeMixins(a: any[] = [], b: any[] = []) {
        const mixins = a.concat(b);
        return mixins.reduce((acc, x) => {
            !acc.includes(x) && (acc.push(x));
            return acc;
        }, <any[]>[]);
    }
    protected mergeVars(a: any = {}, b: any = {}) {
        return {...a, ...b};
    }
    protected parseConfigType = (cfg: any, type: string): [string|undefined, any|undefined] => {
        const match = type.match(/^([^(]+)\(([^)]*)\)$/);
        let parsedVars = {};
        if (!!match && !!match.length) {
            type = match[1];
            parsedVars = !!match[1] ? match[2].split(/\s*,\s*/g).reduce((acc, t) => {
                const [k, v = undefined] = t.split(/\s*=\s*/)
                if (undefined === v) {
                    acc['default'] = this.replaceVarValueIfNeeded(k);
                } else {
                    acc[k] = this.replaceVarValueIfNeeded(YAML.parse(v || ''));
                }
                return acc;
            }, {}) : {};
        }
        cfg = {...cfg, vars: {...parsedVars, ...(cfg.vars || {})}};
        return [type, cfg];
    }
    protected replaceVarValueIfNeeded(value: any) {
        if ('string' !== typeof value) return value;
        switch (value) {
            case '$now.time': return 'new Date().getTime()';
            case '$now': return 'new Date()';
            case '$now.iso': return 'new Date().toISOString()';
            default: return value;
        }
    }
    // noinspection JSUnusedGlobalSymbols
    protected parseTypeAndConfigFromRawValue(v: any): [string|undefined, any|undefined] {
        if ('string' === typeof v) {
            return this.parseConfigType({}, v);
        }
        const {type, ...cfg} = v;
        return type ? this.parseConfigType(cfg, type) : [undefined, cfg];
    }
    protected prepareVarsFromAssetInputs(vars, inputs) {
        const vv = Object.entries(vars || {}).reduce((acc, [k, v]) => {
                if ('@' === k.slice(0, 1)) {
                    if ('@prefix@' === k) {
                        acc['_attributesPrefix'] = v;
                    } else if ('@suffix@' === k) {
                        acc['_attributesSuffix'] = v;
                    } else {
                        acc['_attributes'] = acc['_attributes'] || {};
                        acc['_attributes'][k.slice(1)] = v;
                    }
                }
                if ('%' === k.slice(0, 1)) {
                    if ('%prefix%' === k) {
                        acc['_operationsPrefix'] = v;
                    } else if ('%suffix%' === k) {
                        acc['_operationsSuffix'] = v;
                    } else {
                        acc['_operations'] = acc['_operations'] || {};
                        acc['_operations'][k.slice(1)] = v;
                    }
                }
                if (':' === k.slice(0, 1)) {
                    if (':prefix:' === k) {
                        acc['_functionsPrefix'] = v;
                    } else if (':suffix:' === k) {
                        acc['_functionsSuffix'] = v;
                    } else {
                        acc['_functions'] = acc['_functions'] || {};
                        acc['_functions'][k.slice(1)] = v;
                    }
                }
                return acc;
        }, {});
        return Object.entries(inputs || {}).reduce((acc, [k, v]) => {
            const input = {required: true, type: 'string', ...((null === v || undefined === v) ? {} : <any>v)};
            let value = vars[k] || undefined;
            if (!!input.main && vars.default) value = vars.default;
            (undefined === value) && (value = input.default);
            if ((undefined === value) && input.required) throw new Error(`Required input '${k}' is missing (vars: ${JSON.stringify(vars)}, inputs: ${JSON.stringify(inputs)})`);
            switch (input.type) {
                case 'string': value = String(value); break;
                case 'boolean': value = Boolean(value); break;
                case 'number': value = Number(value); break;
                case 'string[]': value = value.split(/\s*\|\s*/g).map(x => String(x)); break;
                case 'boolean[]': value = value.split(/\s*\|\s*/g).map(x => Boolean(x)); break;
                case 'number[]': value = value.split(/\s*\|\s*/g).map(x => Number(x)); break;
                default: break;
            }
            acc[k] = value;
            return acc;
        }, vv);
    }
    protected mergeMapOfLists(a: any = {}, b: any = {}) {
        return Object.keys(b).reduce((acc, k) => {
            acc[k] = [...(acc[k] || [])];
            acc[k] = acc[k].concat(b[k] || []);
            return acc;
        }, {...a});
    }
    protected mergeObjects(a: any = {}, b: any = {}) {
        return {...a, ...b};
    }
    protected mergeListOfStringsOrObjects(a: any[] = [], b: any[] = []) {
        const items = a.concat(b);
        return items.reduce((acc, b) => {
            if ('string' !== typeof b) acc.push(b)
            else if (!acc.includes(b)) acc.push(b);
            return acc;
        }, <any[]>[]);
    }
}

// noinspection JSUnusedGlobalSymbols
export default AbstractConfigEnhancer